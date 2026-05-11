import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { AboutBookSection } from '@/components/home/about-book-section'
import { FeaturedFragmentSection } from '@/components/home/featured-fragment-section'
import { createClient } from '@/lib/supabase/server'

async function getNavigationData() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .then(result => ({
      ...result,
      tags: ['site-settings', 'navigation']
    }))

  const settingsMap: Record<string, string> = {}
  settings?.forEach(({ key, value }) => {
    settingsMap[key] = value || ''
  })

  const navItems = [
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
  }
}

export default async function HomePage() {
  const { navItems, siteTitle } = await getNavigationData()

  return (
    <>
      <Navigation navItems={navItems} siteTitle={siteTitle} />
      <main>
        <HeroSection />
        <AboutBookSection />
        <FeaturedFragmentSection />
      </main>
      <Footer />
    </>
  )
}
