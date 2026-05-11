import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/admin-nav'
import { AdminFragmentsForm } from '@/components/admin/admin-fragments-form'

async function getFragments() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('book_fragments')
    .select('*')
    .order('sort_order', { ascending: true })

  return data || []
}

export default async function AdminFragmentsEditPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const fragments = await getFragments()

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={user} />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="font-serif text-3xl text-primary mb-8">Editar Fragmentos</h1>
        <AdminFragmentsForm fragments={fragments} />
      </main>
    </div>
  )
}
