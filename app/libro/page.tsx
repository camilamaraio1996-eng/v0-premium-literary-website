import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BookHero } from '@/components/book/book-hero'
import { BookVideo } from '@/components/book/book-video'
import { BookDetails } from '@/components/book/book-details'
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
        {book.video_url && <BookVideo videoUrl={book.video_url} />}
        <BookDetails description={book.description} />
        <BookFragments fragments={fragments} />
      </main>
      <Footer />
    </>
  )
}
