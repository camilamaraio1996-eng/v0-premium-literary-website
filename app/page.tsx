import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { AboutBookSection } from '@/components/home/about-book-section'
import { BlogPreviewSection } from '@/components/home/blog-preview-section'
import { ContactCTA } from '@/components/home/contact-cta'
import { getNavigationData, getSiteSettings } from '@/lib/cms'
import { createClient } from '@/lib/supabase/server'

async function getRecentPosts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, slug, image_url, reading_time, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)
  return data || []
}

export default async function HomePage() {
  const { navItems, siteTitle } = await getNavigationData()
  const settings = await getSiteSettings()
  const recentPosts = await getRecentPosts()

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
        <AboutBookSection />
        <BlogPreviewSection posts={recentPosts} />
        <ContactCTA />
      </main>
      <Footer />
    </>
  )
}
