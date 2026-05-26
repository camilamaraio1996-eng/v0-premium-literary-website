import { createClient } from '@/lib/supabase/server'

export interface NavItem {
  href: string
  label: string
}

export async function getNavigationData() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')

  const settingsMap: Record<string, string> = {}
  settings?.forEach(({ key, value }) => {
    settingsMap[key] = value || ''
  })

  // Override nav_recomendaciones to ensure it always shows BIBLIOTECA
  const navRecomendacionesValue = settingsMap['nav_recomendaciones'] || 'BIBLIOTECA'
  const normalizedValue = 
    navRecomendacionesValue === 'Recomendaciones' || 
    navRecomendacionesValue === 'recomendaciones' ||
    navRecomendacionesValue === 'RECOMENDACIONES'
      ? 'BIBLIOTECA'
      : navRecomendacionesValue || 'BIBLIOTECA'

  const navItems: NavItem[] = [
    { href: '/', label: settingsMap['nav_inicio'] || 'INICIO' },
    { href: '/libro', label: settingsMap['nav_libro'] || 'EL LIBRO' },
    { href: '/diario', label: settingsMap['nav_diario'] || 'BLOG' },
    { href: '/recomendaciones', label: normalizedValue },
    { href: '/autor', label: settingsMap['nav_autor'] || 'AUTORA' },
  ]

  return {
    navItems,
    siteTitle: settingsMap['site_title'] || 'Camila Maraio',
    settings: settingsMap,
  }
}

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
    author_name: 'Camila Maraio',
    cover_image_url: null,
    description: null,
  }
}
