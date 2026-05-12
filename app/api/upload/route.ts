import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0-upload] Request received:', {
      method: request.method,
      contentType: request.headers.get('content-type'),
      url: request.url,
    })

    // Parse FormData
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucketName = formData.get('bucketName') as string | null

    console.log('[v0-upload] FormData parsed:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      bucketName,
    })

    // Validate inputs
    if (!file) {
      console.error('[v0-upload] No file provided')
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    if (!bucketName) {
      console.error('[v0-upload] No bucketName provided')
      return NextResponse.json(
        { success: false, message: 'No bucketName provided' },
        { status: 400 }
      )
    }

    // Validate bucket name
    const validBuckets = ['book-images', 'book-videos', 'blog-images']
    if (!validBuckets.includes(bucketName)) {
      console.error('[v0-upload] Invalid bucket:', bucketName)
      return NextResponse.json(
        { success: false, message: 'Invalid bucket name' },
        { status: 400 }
      )
    }

    // Validate file size
    const maxSize = bucketName === 'book-videos' ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      const sizeMB = maxSize / 1024 / 1024
      console.error('[v0-upload] File too large:', { fileSize: file.size, maxSize })
      return NextResponse.json(
        { success: false, message: `El archivo debe ser menor a ${sizeMB}MB` },
        { status: 400 }
      )
    }

    // Validate file type
    const isImage = bucketName !== 'book-videos'
    if (isImage) {
      if (!file.type.startsWith('image/')) {
        console.error('[v0-upload] Invalid image type:', file.type)
        return NextResponse.json(
          { success: false, message: 'Por favor sube una imagen válida (JPG, PNG, WebP)' },
          { status: 400 }
        )
      }
      // Additional check for allowed image formats
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        console.error('[v0-upload] Image type not allowed:', file.type)
        return NextResponse.json(
          { success: false, message: 'Formato de imagen no permitido. Use JPG, PNG o WebP' },
          { status: 400 }
        )
      }
    } else {
      if (!file.type.startsWith('video/')) {
        console.error('[v0-upload] Invalid video type:', file.type)
        return NextResponse.json(
          { success: false, message: 'Por favor sube un video válido' },
          { status: 400 }
        )
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const fileName = `${bucketName}-${uuidv4()}.${fileExt}`

    console.log('[v0-upload] Generated filename:', fileName)

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log('[v0-upload] Buffer created:', {
      size: buffer.length,
      fileName,
    })

    // Create Supabase client
    const supabase = await createClient()

    // Upload to Supabase Storage
    console.log('[v0-upload] Starting Supabase upload...', {
      bucket: bucketName,
      fileName,
      contentType: file.type,
    })

    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('[v0-upload] Supabase upload error:', {
        message: uploadError.message,
        status: (uploadError as any).status,
        statusCode: (uploadError as any).statusCode,
      })
      return NextResponse.json(
        {
          success: false,
          message: `Upload failed: ${uploadError.message}`,
          error: uploadError.message,
        },
        { status: 500 }
      )
    }

    console.log('[v0-upload] Supabase upload successful:', data)

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    const publicUrl = publicUrlData?.publicUrl

    if (!publicUrl) {
      console.error('[v0-upload] Could not generate public URL')
      return NextResponse.json(
        { success: false, message: 'Could not generate public URL' },
        { status: 500 }
      )
    }

    console.log('[v0-upload] Upload complete:', {
      fileName,
      publicUrl,
      size: file.size,
    })

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        fileName,
        size: file.size,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0-upload] Unexpected error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    })

    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      },
      { status: 500 }
    )
  }
}
