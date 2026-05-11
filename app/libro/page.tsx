import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BookHero } from '@/components/book/book-hero'
import { BookDetails } from '@/components/book/book-details'
import { BookFragments } from '@/components/book/book-fragments'
import { createClient } from '@/lib/supabase/server'
import { getNavigationData } from '@/lib/cms'

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
  }
}

export default async function LibroPage() {
  const { navItems, siteTitle } = await getNavigationData()
  const book = await getBookInfo()
  const fragments = await getFragments()

  return (
    <>
      <Navigation navItems={navItems} siteTitle={siteTitle} />
      <main className="pt-20">
        <BookHero coverImage={book.cover_image_url} bookTitle={book.title} />
        <BookDetails description={book.description} />
        <BookFragments fragments={fragments} />
      </main>
      <Footer />
    </>
  )
}
