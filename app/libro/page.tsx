import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BookFragments } from '@/components/book/book-fragments'
import { createClient } from '@/lib/supabase/server'
import { getNavigationData, getSiteSettings } from '@/lib/cms'
import type { BookFragment } from '@/types/book'

export const metadata: Metadata = {
  title: 'El Libro | Camila Maraio',
  description: 'Conoce "Lo real y lo otro", fragmentos seleccionados y la historia del libro de Editorial Orsai.',
  openGraph: {
    title: 'El Libro | Camila Maraio',
    description: 'Conoce "Lo real y lo otro", fragmentos seleccionados y la historia del libro.',
  },
}

// Revalidate every hour for optimal freshness + performance
export const revalidate = 3600

async function getFragmentsData() {
  const supabase = await createClient()
  
  // Fetch fragments with optimized columns only
  const { data: fragmentsData, error } = await supabase
    .from('book_fragments')
    .select('id, title, chapter_number, content, sort_order')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .limit(20) // Limit to prevent excessive data loading

  if (error) {
    console.error('[v0] Error fetching fragments:', error)
    return []
  }

  return (fragmentsData || []) as BookFragment[]
}

export default async function LibroPage() {
  // Parallel data fetching for optimal performance
  const [{ navItems, siteTitle }, fragments] = await Promise.all([
    getNavigationData(),
    getFragmentsData(),
  ])

  return (
    <>
      <Navigation navItems={navItems} siteTitle={siteTitle} />
      <main className="pt-20">
        {/* Fragments Section */}
        <BookFragments fragments={fragments} />
      </main>
      <Footer />
    </>
  )
}
