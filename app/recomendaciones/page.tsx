import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { RecommendationsHero } from '@/components/recomendaciones/recommendations-hero'
import { RecommendationsGrid } from '@/components/recomendaciones/recommendations-grid'
import { createClient } from '@/lib/supabase/server'
import { getNavigationData } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Biblioteca',
  description: 'Explorá la biblioteca de libros recomendados. Una selección de obras que han inspirado mi escritura.',
  openGraph: {
    title: 'Biblioteca',
    description: 'Explorá la biblioteca de libros recomendados. Una selección de obras que han inspirado mi escritura.',
  },
}

async function getRecommendations() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('recommendations')
    .select('id, title, author, description, image_url, genre, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(50)
  return data || []
}

export default async function RecomendacionesPage() {
  const { navItems, siteTitle } = await getNavigationData()
  const recommendations = await getRecommendations()

  return (
    <>
      <Navigation navItems={navItems} siteTitle={siteTitle} />
      <main className="pt-20">
        <RecommendationsHero />
        <RecommendationsGrid recommendations={recommendations} />
      </main>
      <Footer />
    </>
  )
}
