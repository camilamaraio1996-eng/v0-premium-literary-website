import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BookHero } from '@/components/book/book-hero'
import { BookDetails } from '@/components/book/book-details'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'El Libro',
  description: 'Conoce la novela, su historia y fragmentos seleccionados.',
}

async function getBookInfo() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('book_info')
    .select('*')
    .single()

  return data || {
    title: 'El Libro de los Sueños',
    cover_image_url: null,
    description: null,
  }
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
  const book = await getBookInfo()
  const fragments = await getFragments()

  return (
    <>
      <Navigation />
      <main className="pt-20">
        <BookHero coverImage={book.cover_image_url} bookTitle={book.title} />
        <BookDetails description={book.description} />
        
        {/* Fragmentos section */}
        {fragments.length > 0 && (
          <section className="py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <h2 className="font-serif text-3xl text-primary text-center mb-16">
                Fragmentos del Libro
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fragments.map((fragment, index) => (
                  <div
                    key={fragment.id}
                    className="group p-6 bg-card/50 border border-border hover:border-accent/30 rounded-lg transition-colors"
                  >
                    <span className="text-xs text-accent font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-serif text-lg text-primary mt-2 mb-2 group-hover:text-accent transition-colors">
                      {fragment.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {fragment.description}
                    </p>
                    {fragment.content && (
                      <p className="text-xs text-muted-foreground/70 mt-4 line-clamp-2">
                        {fragment.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
