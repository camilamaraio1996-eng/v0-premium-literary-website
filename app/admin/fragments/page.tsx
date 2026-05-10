import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { FragmentsTable } from '@/components/admin/fragments-table'
import { AdminNav } from '@/components/admin/admin-nav'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

async function getFragments() {
  const supabase = await createClient()
  const { data: fragments } = await supabase
    .from('book_fragments')
    .select('*')
    .order('sort_order', { ascending: true })
  
  return fragments || []
}

export default async function AdminFragmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/admin/login')
  }
  
  const fragments = await getFragments()
  
  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={user} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-primary">Fragmentos</h1>
          <Button asChild>
            <Link href="/admin/fragments/new">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Fragmento
            </Link>
          </Button>
        </div>
        
        <FragmentsTable fragments={fragments} />
      </main>
    </div>
  )
}
