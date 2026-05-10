import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BookHero } from '@/components/book/book-hero'
import { BookDetails } from '@/components/book/book-details'
import { BookFragments } from '@/components/book/book-fragments'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'El Libro',
  description: 'Conoce la novela, su historia y lee fragmentos seleccionados.',
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

export default async function LibroPage() {
  const fragments = await getFragments()

  return (
    <>
      <Navigation />
      <main className="pt-20">
        <BookHero />
        <BookDetails />
        <BookFragments fragments={fragments} />
      </main>
      <Footer />
    </>
  )
}
