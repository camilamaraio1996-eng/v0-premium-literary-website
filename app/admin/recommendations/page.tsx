import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/admin-nav'
import { RecommendationsTable } from '@/components/admin/recommendations-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminRecommendationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: recs } = await supabase
    .from('recommendations')
    .select('id, title, author, published, created_at')
    .order('created_at', { ascending: false })

  const recommendations = (recs || []).map(rec => ({
    id: String(rec.id ?? ''),
    title: String(rec.title ?? 'Sin título'),
    author: rec.author ? String(rec.author) : null,
    published: Boolean(rec.published),
    created_at: String(rec.created_at ?? ''),
  }))

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl text-primary">Recomendaciones</h1>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/recommendations/new">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Recomendación
            </Link>
          </Button>
        </div>
        <RecommendationsTable recommendations={recommendations} />
      </main>
    </div>
  )
}
