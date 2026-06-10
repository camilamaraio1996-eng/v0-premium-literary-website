'use server'

import { createClient } from '@supabase/supabase-js'
import { createGoogleDoc, updateGoogleDoc } from '@/lib/google-drive'

export async function syncBlogPostToGoogleDrive(postId: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Obtener el post
    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (fetchError || !post) {
      throw new Error(`Post no encontrado: ${fetchError?.message}`)
    }

    // 2. Preparar datos
    const title = post.title
    const content = post.content
    const images = post.images || (post.image_url ? [post.image_url] : [])

    // 3. Crear o actualizar documento
    let docId = post.google_doc_id
    let docUrl = post.google_doc_url

    if (!docId) {
      // Crear nuevo documento
      console.log('[v0] Creating new Google Doc for post:', title)
      const result = await createGoogleDoc({
        title,
        content,
        images,
      })
      docId = result.docId
      docUrl = result.docUrl
    } else {
      // Actualizar documento existente
      console.log('[v0] Updating existing Google Doc:', docId)
      await updateGoogleDoc({
        docId,
        title,
        content,
        images,
      })
    }

    // 4. Guardar links en la BD
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({
        google_doc_id: docId,
        google_doc_url: docUrl,
        sync_status: 'synced',
        synced_at: new Date().toISOString(),
      })
      .eq('id', postId)

    if (updateError) {
      throw new Error(`Error guardando en BD: ${updateError.message}`)
    }

    console.log('[v0] Blog post synced successfully:', {
      postId,
      docId,
      docUrl,
    })

    return {
      success: true,
      docId,
      docUrl,
    }
  } catch (error: any) {
    console.error('[v0] Error syncing blog post:', error.message)

    // Guardar estado de error en BD
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      await supabase
        .from('blog_posts')
        .update({
          sync_status: 'failed',
        })
        .eq('id', postId)
    } catch (e) {
      console.error('[v0] Could not update sync status:', e)
    }

    throw error
  }
}
