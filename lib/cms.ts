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

  const navItems: NavItem[] = [
    { href: '/', label: settingsMap['nav_inicio'] || 'Inicio' },
    { href: '/libro', label: settingsMap['nav_libro'] || 'El Libro' },
    { href: '/diario', label: settingsMap['nav_diario'] || 'Diario' },
    { href: '/recomendaciones', label: settingsMap['nav_recomendaciones'] || 'Recomendaciones' },
    { href: '/autor', label: settingsMap['nav_autor'] || 'Autora' },
    { href: '/contacto', label: settingsMap['nav_contacto'] || 'Contacto' },
  ]

  return {
    navItems,
    siteTitle: settingsMap['site_title'] || 'El Libro de los Sueños',
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
    author_name: null,
    cover_image_url: null,
    description: null,
  }
}
