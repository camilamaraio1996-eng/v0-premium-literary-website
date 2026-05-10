import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BookHero } from '@/components/book/book-hero'
import { BookDetails } from '@/components/book/book-details'
import { BookEditions } from '@/components/book/book-editions'

export const metadata: Metadata = {
  title: 'El Libro',
  description: 'Descubre la historia detrás de El Libro de los Sueños. Una novela que explora los territorios del inconsciente y las emociones más profundas.',
}

export default function LibroPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <BookHero />
        <BookDetails />
        <BookEditions />
      </main>
      <Footer />
    </>
  )
}
