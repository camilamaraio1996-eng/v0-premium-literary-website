'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createGoogleDoc, updateGoogleDoc, deleteGoogleDoc } from '@/lib/google-drive'

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
    revalidateTag('site-settings', 'max')
    revalidateTag('navigation', 'max')

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
    revalidateTag('book-info', 'max')

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
    revalidateTag('book-fragments', 'max')

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
    revalidateTag('book-fragments', 'max')

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
    revalidateTag('book-fragments', 'max')

    return { success: true, message: 'Fragmento eliminado correctamente' }
  } catch (error: any) {
    console.error('[v0] Error deleting fragment:', error)
    return { success: false, message: error.message }
  }
}

export async function deleteRecommendation(formData: FormData) {
  'use server'
  
  const id = formData.get('id') as string
  
  console.log('[v0-admin-action] Delete recommendation requested, id:', id)
  
  if (!id || typeof id !== 'string') {
    console.error('[v0-admin-action] Invalid ID provided')
    throw new Error('ID no proporcionado o inválido')
  }

  try {
    const supabase = await createClient()

    console.log('[v0-admin-action] Supabase client created, deleting from recommendations...')

    const { error } = await supabase
      .from('recommendations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[v0-admin-action] Supabase delete error:', error)
      throw error
    }

    console.log('[v0-admin-action] Delete successful, revalidating paths...')

    revalidatePath('/admin/recommendations')
    revalidatePath('/recomendaciones')
    revalidateTag('recommendations', 'max')

    console.log('[v0-admin-action] Revalidation complete')
  } catch (error: any) {
    console.error('[v0-admin-action] Error in deleteRecommendation:', {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      id,
    })
    throw error
  }
}

/** Sincroniza una entrada del blog con Google Drive */
export async function syncBlogPostToGoogleDrive(postId: string) {
  const supabase = await createClient()

  try {
    console.log('[v0] Syncing blog post to Google Drive:', postId)

    // 1. Obtener la entrada del blog
    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (fetchError || !post) {
      throw new Error('Entrada de blog no encontrada')
    }

    console.log('[v0] Post fetched:', { title: post.title, hasDocId: !!post.google_doc_id })

    // 2. Construir URL del blog
    const blogUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/diario/${post.slug}`

    // 3. Preparar imágenes (si existen)
    const images = post.images || (post.image_url ? [post.image_url] : [])

    // 4. Crear o actualizar Google Doc
    let result
    if (post.google_doc_id) {
      console.log('[v0] Updating existing Google Doc:', post.google_doc_id)
      result = await updateGoogleDoc({
        docId: post.google_doc_id,
        title: post.title,
        content: post.content,
        images,
        blogUrl,
      })
    } else {
      console.log('[v0] Creating new Google Doc')
      result = await createGoogleDoc({
        title: post.title,
        content: post.content,
        images,
        blogUrl,
      })
    }

    // 5. Guardar información del Doc en la BD
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({
        google_doc_id: result.docId,
        google_doc_url: result.docUrl,
        sync_status: 'synced',
        synced_at: new Date().toISOString(),
      })
      .eq('id', postId)

    if (updateError) {
      throw updateError
    }

    console.log('[v0] Blog post synced successfully')

    // 6. Revalidar caché
    revalidatePath('/admin/posts')
    revalidatePath(`/diario/${post.slug}`)
    revalidateTag('blog-posts', 'max')

    return {
      success: true,
      message: 'Entrada sincronizada con Google Drive',
      docUrl: result.docUrl,
    }
  } catch (error: any) {
    console.error('[v0] Error syncing to Google Drive:', {
      message: error.message,
      code: error.code,
      status: error.status,
      errors: error.errors,
      stack: error.stack,
    })

    // Actualizar estado a error
    try {
      await supabase
        .from('blog_posts')
        .update({
          sync_status: 'error',
        })
        .eq('id', postId)
    } catch (e) {
      console.error('[v0] Error updating sync status:', e)
    }

    return {
      success: false,
      message: `Error sincronizando: ${error.message}`,
    }
  }
}
