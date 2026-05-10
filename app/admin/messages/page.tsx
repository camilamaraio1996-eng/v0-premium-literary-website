import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MessagesTable } from '@/components/admin/messages-table'
import { AdminNav } from '@/components/admin/admin-nav'

async function getMessages() {
  const supabase = await createClient()
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  
  return messages || []
}

export default async function AdminMessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/admin/login')
  }
  
  const messages = await getMessages()
  const unreadCount = messages.filter(m => !m.read).length
  
  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={user} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-primary">Mensajes</h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount} sin leer de {messages.length} totales
            </p>
          </div>
        </div>
        
        <MessagesTable messages={messages} />
      </main>
    </div>
  )
}
