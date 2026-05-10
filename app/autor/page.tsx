import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { AuthorHero } from '@/components/autor/author-hero'
import { AuthorBio } from '@/components/autor/author-bio'
import { AuthorQuotes } from '@/components/autor/author-quotes'

export const metadata: Metadata = {
  title: 'Sobre el Autor',
  description: 'Conoce al autor de El Libro de los Sueños. Su trayectoria, influencias y el proceso detrás de la novela.',
}

export default function AutorPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <AuthorHero />
        <AuthorBio />
        <AuthorQuotes />
      </main>
      <Footer />
    </>
  )
}
