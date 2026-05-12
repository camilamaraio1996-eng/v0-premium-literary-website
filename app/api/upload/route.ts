import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('[v0-upload] Request received:', {
      method: request.method,
      contentType: request.headers.get('content-type'),
      url: request.url,
      timestamp: new Date().toISOString(),
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

    // Verify Supabase credentials
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('[v0-upload] Supabase credentials check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlLength: supabaseUrl?.length,
      keyLength: supabaseKey?.length,
    })

    if (!supabaseUrl || !supabaseKey) {
      console.error('[v0-upload] Missing Supabase credentials')
      return NextResponse.json(
        {
          success: false,
          message: 'Server configuration error: Missing Supabase credentials',
        },
        { status: 500 }
      )
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

    // Create Supabase client with service role key
    // This allows us to upload files without RLS restrictions
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log('[v0-upload] Supabase client created')

    // Upload to Supabase Storage
    console.log('[v0-upload] Starting Supabase upload...', {
      bucket: bucketName,
      fileName,
      contentType: file.type,
      bufferSize: buffer.length,
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
        details: (uploadError as any).details,
      })
      
      // Provide specific error messages based on error type
      let userMessage = 'Error al subir el archivo a Supabase'
      if (uploadError.message.includes('permission')) {
        userMessage = 'Permiso denegado: Verifica la configuración de Supabase'
      } else if (uploadError.message.includes('Bucket not found')) {
        userMessage = 'Bucket de almacenamiento no encontrado'
      } else if (uploadError.message.includes('payload too large')) {
        userMessage = 'El archivo es demasiado grande'
      }

      return NextResponse.json(
        {
          success: false,
          message: userMessage,
          error: uploadError.message,
          details: process.env.NODE_ENV === 'development' ? uploadError : undefined,
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
        { success: false, message: 'No se pudo generar la URL pública' },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime
    console.log('[v0-upload] Upload complete:', {
      fileName,
      publicUrl,
      size: file.size,
      duration: `${duration}ms`,
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
    const duration = Date.now() - startTime
    console.error('[v0-upload] Unexpected error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      duration: `${duration}ms`,
    })

    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'An unexpected error occurred during upload',
        error: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      },
      { status: 500 }
    )
  }
}
