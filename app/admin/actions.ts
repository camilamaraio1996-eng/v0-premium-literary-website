'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function updateSiteSettings(settings: Record<string, string>) {
  const supabase = await createClient()

  try {
    console.log('[v0] Starting settings update. Total keys:', Object.keys(settings).length)
    
    for (const [key, value] of Object.entries(settings)) {
      console.log('[v0] Updating setting:', { key, value: value.substring(0, 50) })
      
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', key)
        .single()

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key)
        
        if (error) {
          console.error('[v0] Update error for', key, ':', error)
          throw error
        }
        console.log('[v0] Setting updated:', key)
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert({ key, value })
        
        if (error) {
          console.error('[v0] Insert error for', key, ':', error)
          throw error
        }
        console.log('[v0] Setting inserted:', key)
      }
    }

    console.log('[v0] All settings updated. Revalidating cache...')
    // Revalidate all pages that use navigation
    revalidatePath('/', 'layout')
    revalidateTag('site-settings')
    revalidateTag('navigation')

    return { success: true, message: 'Configuración actualizada correctamente' }
  } catch (error: any) {
    console.error('[v0] Error updating settings:', error)
    console.error('[v0] Error details:', error.message, error.code)
    return { success: false, message: error.message || 'Error desconocido actualizando configuración' }
  }
}

export async function updateBookInfo(bookData: {
  id: string
  title: string
  subtitle?: string | null
  author_name?: string | null
  cover_image_url?: string | null
  description?: string | null
  video_url?: string | null
}) {
  const supabase = await createClient()

  try {
    // Validaciones
    if (!bookData.title || bookData.title.trim().length < 3) {
      return { success: false, message: 'El título debe tener al menos 3 caracteres' }
    }
    
    if (!bookData.description || bookData.description.trim().length < 20) {
      return { success: false, message: 'La sinopsis debe tener al menos 20 caracteres' }
    }
    
    if (bookData.description.trim().length > 1000) {
      return { success: false, message: 'La sinopsis no puede exceder 1000 caracteres' }
    }
    
    console.log('[v0] Updating book info:', { id: bookData.id, title: bookData.title })
    
    // Only send columns that exist on book_info
    const updateData = {
      title: bookData.title,
      subtitle: bookData.subtitle ?? null,
      author_name: bookData.author_name ?? null,
      cover_image_url: bookData.cover_image_url ?? null,
      description: bookData.description ?? null,
      video_url: bookData.video_url ?? null,
      updated_at: new Date().toISOString(),
    }
    
    console.log('[v0] Update payload:', updateData)
    
    const { data, error } = await supabase
      .from('book_info')
      .update(updateData)
      .eq('id', bookData.id)
      .select()

    if (error) {
      console.error('[v0] Book update error:', error)
      throw error
    }
    
    console.log('[v0] Book updated successfully:', data)

    revalidatePath('/libro')
    revalidateTag('book-info')

    return { success: true, message: 'Libro actualizado correctamente' }
  } catch (error: any) {
    console.error('[v0] Error updating book:', error)
    console.error('[v0] Error details:', error.message, error.code)
    return { success: false, message: error.message || 'Error desconocido actualizando libro' }
  }
}

export async function createFragment() {
  const supabase = await createClient()

  try {
    const { data: maxOrder } = await supabase
      .from('book_fragments')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxOrder?.sort_order ?? 0) + 1

    const { data, error } = await supabase
      .from('book_fragments')
      .insert({
        title: 'Nuevo Fragmento',
        content: '',
        sort_order: nextOrder,
        published: false,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/libro')
    revalidateTag('book-fragments')

    return { success: true, message: 'Fragmento creado', fragment: data }
  } catch (error: any) {
    console.error('[v0] Error creating fragment:', error)
    return { success: false, message: error.message }
  }
}

export async function updateFragments(fragments: any[]) {
  const supabase = await createClient()

  try {
    console.log('[v0] Starting fragment update. Total fragments:', fragments.length)
    
    for (const fragment of fragments) {
      console.log('[v0] Updating fragment:', { id: fragment.id, title: fragment.title })
      
      // Only send columns that actually exist on book_fragments:
      // id, title, chapter_number, content, audio_url, sort_order, published, created_at, image_url
      const updateData = {
        title: fragment.title,
        content: fragment.content ?? '',
        image_url: fragment.image_url ?? null,
        sort_order: fragment.sort_order ?? 0,
        published: fragment.published ?? false,
        chapter_number: fragment.chapter_number ?? null,
      }
      
      console.log('[v0] Update payload:', updateData)
      
      const { data, error } = await supabase
        .from('book_fragments')
        .update(updateData)
        .eq('id', fragment.id)
        .select()

      if (error) {
        console.error('[v0] Update error for fragment', fragment.id, ':', error)
        throw error
      }
      
      console.log('[v0] Fragment updated successfully:', data)
    }

    console.log('[v0] All fragments updated. Revalidating cache...')
    revalidatePath('/libro')
    revalidateTag('book-fragments')

    return { success: true, message: 'Fragmentos actualizados correctamente' }
  } catch (error: any) {
    console.error('[v0] Error updating fragments:', error)
    console.error('[v0] Error details:', error.message, error.code, error.hint)
    return { success: false, message: error.message || 'Error desconocido actualizando fragmentos' }
  }
}

export async function deleteFragment(fragmentId: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('book_fragments')
      .delete()
      .eq('id', fragmentId)

    if (error) throw error

    revalidatePath('/libro')
    revalidateTag('book-fragments')

    return { success: true, message: 'Fragmento eliminado correctamente' }
  } catch (error: any) {
    console.error('[v0] Error deleting fragment:', error)
    return { success: false, message: error.message }
  }
}

export async function uploadFile(
  file: File,
  bucketName: 'book-images' | 'book-videos' | 'blog-images'
) {
  const supabase = await createClient()

  try {
    // Validate file size
    const maxSize = bucketName === 'book-videos' ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return {
        success: false,
        message: `El archivo debe ser menor a ${maxSize / 1024 / 1024}MB`,
      }
    }

    // Validate file type
    const isImage = bucketName !== 'book-videos'
    if (isImage && !file.type.startsWith('image/')) {
      return { success: false, message: 'Por favor sube una imagen válida' }
    }
    if (!isImage && !file.type.startsWith('video/')) {
      return { success: false, message: 'Por favor sube un video válido' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${bucketName}-${uuidv4()}.${fileExt}`

    console.log('[v0] Uploading file to Supabase:', {
      bucket: bucketName,
      fileName,
      size: file.size,
      type: file.type,
    })

    // Convert File to Buffer for server upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('[v0] Supabase upload error:', uploadError)
      return {
        success: false,
        message: uploadError.message || 'Error al subir el archivo',
      }
    }

    console.log('[v0] File uploaded successfully:', data)

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    const publicUrl = publicUrlData.publicUrl

    if (!publicUrl) {
      return { success: false, message: 'No se pudo generar la URL pública' }
    }

    console.log('[v0] Public URL generated:', publicUrl)

    return { success: true, url: publicUrl }
  } catch (error: any) {
    console.error('[v0] Upload error:', error)
    return {
      success: false,
      message: error.message || 'Error desconocido al subir el archivo',
    }
  }
}
