import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { BookFragments } from '@/components/book/book-fragments'
import { BookCTA } from '@/components/home/book-cta-section'
import { ContactCTA } from '@/components/home/contact-cta'
import { createClient } from '@/lib/supabase/server'
import { getNavigationData, getSiteSettings } from '@/lib/cms'
import type { BookFragment } from '@/types/book'

export const revalidate = 3600

async function getFragmentsData() {
  const supabase = await createClient()
  
  // Fetch fragments with optimized columns only
  const { data: fragmentsData, error } = await supabase
    .from('book_fragments')
    .select('id, title, chapter_number, content, sort_order')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .limit(20)

  if (error) {
    console.error('[v0] Error fetching fragments:', error)
    return []
  }

  return (fragmentsData || []) as BookFragment[]
}

export default async function HomePage() {
  const [{ navItems, siteTitle }, fragments] = await Promise.all([
    getNavigationData(),
    getFragmentsData(),
  ])
  const settings = await getSiteSettings()

  return (
    <>
      <Navigation navItems={navItems} siteTitle={siteTitle} />
      <main>
        <HeroSection
          eyebrow={settings['hero_eyebrow'] || ''}
          title={settings['hero_title'] || 'Lo real y lo otro'}
          description={settings['hero_description'] || 'Un libro de relatos cortos, realistas. '}
          imageUrl={settings['home_hero_image_url'] || null}
          imageAlt={settings['home_hero_image_alt'] || ''}
          ctaPrimaryLabel={settings['hero_cta_primary_label'] || 'Descubrí "Lo real y lo otro"'}
          ctaPrimaryHref={settings['hero_cta_primary_href'] || '/libro'}
          videoUrl={settings['home_video_url'] || null}
          buyUrl={settings['home_buy_url'] || null}
          buyLabel={settings['home_buy_label'] || 'Comprar el Libro'}
        />
        {/* Fragments Section */}
        <BookFragments fragments={fragments} title="FRAGMENTOS DEL LIBRO" />
        {/* Book CTA Section - Buttons below fragments */}
        <BookCTA
          buyUrl={settings['home_buy_url'] || null}
          buyLabel={settings['home_buy_label'] || 'Comprar el Libro'}
          ctaPrimaryLabel={settings['hero_cta_primary_label'] || 'Descubrí "Lo real y lo otro"'}
          ctaPrimaryHref={settings['hero_cta_primary_href'] || '/libro'}
          description={settings['hero_description'] || 'Un libro de relatos cortos, realistas.'}
        />
        <ContactCTA />
      </main>
      <Footer />
    </>
  )
}
