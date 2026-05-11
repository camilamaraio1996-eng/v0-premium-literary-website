import { createClient } from '@/lib/supabase/server'

export async function getSiteSettings(): Promise<Record<string, string>> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')

  const settings: Record<string, string> = {}
  data?.forEach(({ key, value }) => {
    settings[key] = value || ''
  })
  return settings
}

export async function getBookInfo() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('book_info')
    .select('*')
    .single()

  return data || {
    id: '',
    title: 'El Libro de los Sueños',
    subtitle: null,
    author_name: null,
    cover_image_url: null,
    description: null,
  }
}
