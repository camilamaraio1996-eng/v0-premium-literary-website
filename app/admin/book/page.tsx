import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/admin-nav'
import { AdminBookForm } from '@/components/admin/admin-book-form'

async function getBookInfo() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('book_info')
    .select('*')
    .single()

  return data || {
    id: '',
    title: 'El Libro de los Sueños',
    subtitle: null,
    author_name: null,
    cover_image_url: null,
    description: null,
  }
}

export default async function AdminBookPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const book = await getBookInfo()

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={user} />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="font-serif text-3xl text-primary mb-8">Editar Libro</h1>
        <AdminBookForm book={book} />
      </main>
    </div>
  )
}
