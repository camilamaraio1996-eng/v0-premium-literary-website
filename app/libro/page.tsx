import { Metadata } from 'next'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BookHero } from '@/components/book/book-hero'
import { PremiumYoutubePlayer } from '@/components/book/premium-youtube-player'
import { BookFragments } from '@/components/book/book-fragments'
import { createClient } from '@/lib/supabase/server'
import { getNavigationData, getSiteSettings } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'El Libro',
  description: 'Conoce la novela, su historia y fragmentos seleccionados.',
}

async function getFragments() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('book_fragments')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  return data || []
}

async function getBookInfo() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('book_info')
    .select('*')
    .single()

  return data || {
    title: 'El Libro de los Sueños',
    cover_image_url: null,
    description: null,
    video_url: null,
  }
}

export default async function LibroPage() {
  const [{ navItems, siteTitle }, book, fragments, settings] = await Promise.all([
    getNavigationData(),
    getBookInfo(),
    getFragments(),
    getSiteSettings(),
  ])

  return (
    <>
      <Navigation navItems={navItems} siteTitle={siteTitle} />
      <main className="pt-20">
        <BookHero
          coverImage={book.cover_image_url}
          bookTitle={book.title}
          buyUrl={settings['book_buy_url'] || null}
          buyLabel={settings['book_buy_label'] || 'Comprar Ahora'}
        />
        {/* Title Section - Lo real y lo otro */}
        <section className="py-32 lg:py-40 bg-background">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-8">
                Lo real y lo otro
              </h2>
              <div className="w-12 h-px bg-accent mx-auto" />
            </motion.div>
          </div>
        </section>
        {/* Video Section */}
        <PremiumYoutubePlayer />
        {/* Fragments Section */}
        <BookFragments fragments={fragments} />
      </main>
      <Footer />
    </>
  )
}
