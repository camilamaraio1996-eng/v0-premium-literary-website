import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/admin-nav'
import { AdminPagesEditor } from '@/components/admin/admin-pages-editor'

async function getPageSections() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('page_sections')
    .select('*')
    .order('page_slug', { ascending: true })
    .order('sort_order', { ascending: true })

  const sections: Record<string, any[]> = {}
  data?.forEach((section) => {
    if (!sections[section.page_slug]) {
      sections[section.page_slug] = []
    }
    sections[section.page_slug].push(section)
  })
  return sections
}

export default async function AdminPagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const sections = await getPageSections()

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={user} />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="font-serif text-3xl text-primary mb-8">Editar Páginas</h1>
        <AdminPagesEditor sections={sections} />
      </main>
    </div>
  )
}
