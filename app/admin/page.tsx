import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminNav } from '@/components/admin/admin-nav'
import { FileText, BookOpen, Users, Mail } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = await createClient()
  
  const [posts, fragments, preorders, messages] = await Promise.all([
    supabase.from('blog_posts').select('id', { count: 'exact' }),
    supabase.from('book_fragments').select('id', { count: 'exact' }),
    supabase.from('preorders').select('id', { count: 'exact' }),
    supabase.from('contact_messages').select('id', { count: 'exact' }).eq('read', false),
  ])
  
  return {
    posts: posts.count || 0,
    fragments: fragments.count || 0,
    preorders: preorders.count || 0,
    unreadMessages: messages.count || 0,
  }
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/admin/login')
  }
  
  const stats = await getStats()
  
  const cards = [
    {
      title: 'Entradas del Blog',
      value: stats.posts,
      icon: FileText,
      href: '/admin/posts',
      description: 'Total de entradas',
    },
    {
      title: 'Fragmentos',
      value: stats.fragments,
      icon: BookOpen,
      href: '/admin/fragments',
      description: 'Fragmentos publicados',
    },
    {
      title: 'Reservas',
      value: stats.preorders,
      icon: Users,
      href: '/admin/preorders',
      description: 'Pre-ordenes recibidas',
    },
    {
      title: 'Mensajes',
      value: stats.unreadMessages,
      icon: Mail,
      href: '/admin/messages',
      description: 'Sin leer',
    },
  ]
  
  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={user} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="font-serif text-3xl text-primary mb-8">Dashboard</h1>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.title} href={card.href}>
                <Card className="hover:border-accent/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </CardTitle>
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-light text-primary">{card.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
