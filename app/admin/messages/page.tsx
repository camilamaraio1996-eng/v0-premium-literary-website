import { createClient } from '@/lib/supabase/server'
import { MessagesTable } from '@/components/admin/messages-table'

async function getMessages() {
  const supabase = await createClient()
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  
  return messages || []
}

export default async function AdminMessagesPage() {
  const messages = await getMessages()
  const unreadCount = messages.filter(m => !m.read).length
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-primary">Mensajes</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount} sin leer de {messages.length} totales
          </p>
        </div>
      </div>
      
      <MessagesTable messages={messages} />
    </div>
  )
}
