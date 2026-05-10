import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BookHero } from '@/components/book/book-hero'
import { BookDetails } from '@/components/book/book-details'

export const metadata: Metadata = {
  title: 'El Libro',
  description: 'Conoce la novela, su historia y sinopsis.',
}

export default async function LibroPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <BookHero />
        <BookDetails />
      </main>
      <Footer />
    </>
  )
}
