import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { RecommendationsHero } from '@/components/recomendaciones/recommendations-hero'
import { RecommendationsGrid } from '@/components/recomendaciones/recommendations-grid'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Recomendaciones de Lectura',
  description: 'Descubre los libros que recomiendo. Una selección de obras que han inspirado mi escritura.',
}

async function getRecommendations() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('recommendations')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
  return data || []
}

export default async function RecomendacionesPage() {
  const recommendations = await getRecommendations()

  return (
    <>
      <Navigation />
      <main className="pt-20">
        <RecommendationsHero />
        <RecommendationsGrid recommendations={recommendations} />
      </main>
      <Footer />
    </>
  )
}
