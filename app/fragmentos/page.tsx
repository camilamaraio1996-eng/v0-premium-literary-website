import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { FragmentsHero } from '@/components/fragments/fragments-hero'
import { FragmentsList } from '@/components/fragments/fragments-list'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Fragmentos',
  description: 'Lee fragmentos exclusivos de El Libro de los Sueños. Una muestra del universo onírico que te espera.',
}

async function getFragments() {
  const supabase = await createClient()
  const { data: fragments } = await supabase
    .from('book_fragments')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
  
  return fragments || []
}

export default async function FragmentosPage() {
  const fragments = await getFragments()
  
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <FragmentsHero />
        <FragmentsList fragments={fragments} />
      </main>
      <Footer />
    </>
  )
}
