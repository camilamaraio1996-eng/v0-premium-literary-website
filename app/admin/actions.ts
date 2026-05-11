'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateSiteSettings(settings: Record<string, string>) {
  const supabase = await createClient()

  try {
    for (const [key, value] of Object.entries(settings)) {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', key)
        .single()

      if (existing) {
        await supabase
          .from('site_settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key)
      } else {
        await supabase
          .from('site_settings')
          .insert({ key, value })
      }
    }

    // Revalidate all pages that use navigation
    revalidatePath('/', 'layout')
    revalidateTag('site-settings')
    revalidateTag('navigation')

    return { success: true, message: 'Configuración actualizada correctamente' }
  } catch (error: any) {
    console.error('[v0] Error updating settings:', error)
    return { success: false, message: error.message }
  }
}

export async function updateBookInfo(bookData: {
  id: string
  title: string
  subtitle?: string | null
  author_name?: string | null
  cover_image_url?: string | null
  description?: string | null
}) {
  const supabase = await createClient()

  try {
    // Only send columns that exist on book_info
    const { error } = await supabase
      .from('book_info')
      .update({
        title: bookData.title,
        subtitle: bookData.subtitle ?? null,
        author_name: bookData.author_name ?? null,
        cover_image_url: bookData.cover_image_url ?? null,
        description: bookData.description ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookData.id)

    if (error) throw error

    revalidatePath('/libro')
    revalidateTag('book-info')

    return { success: true, message: 'Libro actualizado correctamente' }
  } catch (error: any) {
    console.error('[v0] Error updating book:', error)
    return { success: false, message: error.message }
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
    for (const fragment of fragments) {
      // Only send columns that actually exist on book_fragments:
      // id, title, chapter_number, content, audio_url, sort_order, published, created_at, image_url
      const { error } = await supabase
        .from('book_fragments')
        .update({
          title: fragment.title,
          content: fragment.content ?? '',
          image_url: fragment.image_url ?? null,
          sort_order: fragment.sort_order ?? 0,
          published: fragment.published ?? false,
          chapter_number: fragment.chapter_number ?? null,
        })
        .eq('id', fragment.id)

      if (error) throw error
    }

    revalidatePath('/libro')
    revalidateTag('book-fragments')

    return { success: true, message: 'Fragmentos actualizados correctamente' }
  } catch (error: any) {
    console.error('[v0] Error updating fragments:', error)
    return { success: false, message: error.message }
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
