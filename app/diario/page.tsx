import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { DiarioHero } from '@/components/diario/diario-hero'
import { DiarioList } from '@/components/diario/diario-list'
import { createClient } from '@/lib/supabase/server'
import { getNavigationData } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Diario',
  description: 'Reflexiones sobre el proceso creativo, la escritura y los sueños. Un diario íntimo del autor.',
}

async function getPosts() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, content, image_url, reading_time, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
  
  return posts || []
}

export default async function DiarioPage() {
  const { navItems, siteTitle } = await getNavigationData()
  const posts = await getPosts()
  
  return (
    <>
      <Navigation navItems={navItems} siteTitle={siteTitle} />
      <main className="pt-20">
        <DiarioHero />
        <DiarioList posts={posts} />
      </main>
      <Footer />
    </>
  )
}
