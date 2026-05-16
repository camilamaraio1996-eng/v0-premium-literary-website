import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BookHero } from '@/components/book/book-hero'
import { BookFragments } from '@/components/book/book-fragments'
import { DiscountWheel } from '@/components/book/discount-wheel'
import { createClient } from '@/lib/supabase/server'
import { getNavigationData, getSiteSettings } from '@/lib/cms'
import type { Book, BookFragment } from '@/types/book'

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

async function getBookData() {
  const supabase = await createClient()
  
  // Fetch book info with optimized columns
  const { data: bookData, error: bookError } = await supabase
    .from('book_info')
    .select('id, title, slug, cover_image_url, description, video_url, published_at')
    .single()

  if (bookError || !bookData) {
    return {
      title: 'Lo real y lo otro',
      cover_image_url: null,
      description: null,
      video_url: 'qXAKNC4rXF0',
    } as Book
  }

  return bookData
}

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
  const [{ navItems, siteTitle }, book, fragments, settings] = await Promise.all([
    getNavigationData(),
    getBookData(),
    getFragmentsData(),
    getSiteSettings(),
  ])

  return (
    <>
      <Navigation navItems={navItems} siteTitle={siteTitle} />
      <main className="pt-20">
        <BookHero
          coverImage={book.cover_image_url}
          bookTitle={book.title}
          buyUrl={settings['book_buy_url'] as string | null}
          buyLabel={(settings['book_buy_label'] as string) || 'Comprar Ahora'}
        />
        
        {/* Discount Wheel Section */}
        <DiscountWheel />
        
        {/* Fragments Section */}
        <BookFragments fragments={fragments} />
      </main>
      <Footer />
    </>
  )
}
