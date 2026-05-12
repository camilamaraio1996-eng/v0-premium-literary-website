import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { AboutBookSection } from '@/components/home/about-book-section'
import { FeaturedFragmentSection } from '@/components/home/featured-fragment-section'
import { getNavigationData, getSiteSettings } from '@/lib/cms'

export default async function HomePage() {
  const { navItems, siteTitle } = await getNavigationData()
  const settings = await getSiteSettings()

  return (
    <>
      <Navigation navItems={navItems} siteTitle={siteTitle} />
      <main>
        <HeroSection
          eyebrow={settings['hero_eyebrow'] || 'Una novela de'}
          title={settings['hero_title'] || 'Lo real y lo otro'}
          description={settings['hero_description'] || 'Un viaje a través de los territorios más profundos de la memoria, donde los sueños y las emociones se entrelazan en una narrativa que desafía los límites de lo real.'}
          imageUrl={settings['home_hero_image_url'] || null}
          imageAlt={settings['home_hero_image_alt'] || ''}
          ctaPrimaryLabel={settings['hero_cta_primary_label'] || 'Descubrir el Libro'}
          ctaPrimaryHref={settings['hero_cta_primary_href'] || '/libro'}
          ctaSecondaryLabel={settings['hero_cta_secondary_label'] || 'Ir al Diario'}
          ctaSecondaryHref={settings['hero_cta_secondary_href'] || '/diario'}
          videoUrl={settings['home_video_url'] || null}
          buyUrl={settings['home_buy_url'] || null}
          buyLabel={settings['home_buy_label'] || 'Comprar el Libro'}
        />
        <AboutBookSection />
        <FeaturedFragmentSection />
      </main>
      <Footer />
    </>
  )
}
