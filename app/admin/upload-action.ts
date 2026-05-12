'use server'

import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

/**
 * Server-side upload handler for files
 * Converts FormData to buffer and uploads to Supabase Storage
 */
export async function uploadFileAction(
  formData: FormData,
  bucketName: 'book-images' | 'book-videos' | 'blog-images'
) {
  const supabase = await createClient()

  try {
    console.log('[v0 UPLOAD] Starting upload to bucket:', bucketName)
    
    // Get file from FormData
    const file = formData.get('file') as File | null
    if (!file) {
      console.error('[v0 UPLOAD] No file in FormData')
      return { success: false, message: 'No se proporcionó archivo' }
    }

    console.log('[v0 UPLOAD] File received:', {
      name: file.name,
      size: file.size,
      type: file.type,
      bucketName,
    })

    // Validate file size
    const maxSize = bucketName === 'book-videos' ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      const maxMB = maxSize / 1024 / 1024
      console.error(`[v0 UPLOAD] File too large: ${file.size} > ${maxSize}`)
      return {
        success: false,
        message: `El archivo debe ser menor a ${maxMB}MB. Tu archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      }
    }

    // Validate file type
    const isImage = bucketName !== 'book-videos'
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp']
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']

    if (isImage && !validImageTypes.includes(file.type)) {
      console.error(`[v0 UPLOAD] Invalid image type: ${file.type}`)
      return {
        success: false,
        message: `Formato inválido. Solo: JPG, PNG, WebP. Tu formato: ${file.type}`,
      }
    }
    if (!isImage && !validVideoTypes.includes(file.type)) {
      console.error(`[v0 UPLOAD] Invalid video type: ${file.type}`)
      return {
        success: false,
        message: `Formato inválido. Solo: MP4, WebM, OGG. Tu formato: ${file.type}`,
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const fileName = `${bucketName}-${uuidv4()}.${fileExt}`

    console.log('[v0 UPLOAD] Generated filename:', fileName)

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log('[v0 UPLOAD] Buffer created, size:', buffer.length, 'bytes')

    // Upload to Supabase Storage
    console.log('[v0 UPLOAD] Starting Supabase storage upload...')
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('[v0 UPLOAD] Supabase upload failed:', {
        error: uploadError.message,
        status: uploadError.status,
        code: uploadError.code,
      })
      return {
        success: false,
        message: `Error en Supabase: ${uploadError.message}`,
      }
    }

    console.log('[v0 UPLOAD] File uploaded successfully to Supabase:', data)

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    const publicUrl = publicUrlData?.publicUrl

    if (!publicUrl) {
      console.error('[v0 UPLOAD] Failed to generate public URL')
      return { 
        success: false, 
        message: 'No se pudo generar la URL pública del archivo' 
      }
    }

    console.log('[v0 UPLOAD] Success! Public URL:', publicUrl)

    return { 
      success: true, 
      url: publicUrl,
      message: 'Archivo subido exitosamente'
    }
  } catch (error: any) {
    console.error('[v0 UPLOAD] CRITICAL ERROR:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
      name: error?.name,
    })
    return {
      success: false,
      message: `Error crítico: ${error?.message || 'Error desconocido'}`,
    }
  }
}
