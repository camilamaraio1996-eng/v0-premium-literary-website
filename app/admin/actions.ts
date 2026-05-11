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

export async function updateBookInfo(bookData: any) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('book_info')
      .update({ ...bookData, updated_at: new Date().toISOString() })
      .eq('id', bookData.id)

    if (error) throw error

    // Revalidate book pages
    revalidatePath('/libro')
    revalidateTag('book-info')

    return { success: true, message: 'Libro actualizado correctamente' }
  } catch (error: any) {
    console.error('[v0] Error updating book:', error)
    return { success: false, message: error.message }
  }
}

export async function updateFragments(fragments: any[]) {
  const supabase = await createClient()

  try {
    for (const fragment of fragments) {
      const { error } = await supabase
        .from('book_fragments')
        .update({
          title: fragment.title,
          description: fragment.description,
          content: fragment.content,
          image_url: fragment.image_url,
          sort_order: fragment.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', fragment.id)

      if (error) throw error
    }

    // Revalidate fragment pages
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
