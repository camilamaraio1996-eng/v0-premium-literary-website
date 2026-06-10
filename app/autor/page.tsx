import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { AuthorHeader } from '@/components/autor/author-header'
import { AuthorHero } from '@/components/autor/author-hero'
import { AuthorBio } from '@/components/autor/author-bio'
import { getNavigationData } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Sobre el Autor',
  description: 'Conoce a Camila Maraio. Su trayectoria y el proceso detrás de la novela.',
}

export default async function AutorPage() {
  const { navItems, siteTitle } = await getNavigationData()

  return (
    <>
      <Navigation navItems={navItems} siteTitle={siteTitle} />
      <main className="pt-20">
        <AuthorHeader />
        <AuthorHero />
        <AuthorBio />
      </main>
      <Footer />
    </>
  )
}
