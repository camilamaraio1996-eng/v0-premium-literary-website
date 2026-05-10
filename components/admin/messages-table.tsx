'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Mail, MailOpen, Trash2 } from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  created_at: string
}

interface MessagesTableProps {
  messages: Message[]
}

export function MessagesTable({ messages }: MessagesTableProps) {
  const [localMessages, setLocalMessages] = useState(messages)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const router = useRouter()
  
  const markAsRead = async (id: string) => {
    const supabase = createClient()
    await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id)
    
    setLocalMessages(prev => 
      prev.map(m => m.id === id ? { ...m, read: true } : m)
    )
  }
  
  const deleteMessage = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return
    
    const supabase = createClient()
    await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)
    
    setLocalMessages(prev => prev.filter(m => m.id !== id))
    setSelectedMessage(null)
    router.refresh()
  }
  
  const openMessage = async (message: Message) => {
    setSelectedMessage(message)
    if (!message.read) {
      await markAsRead(message.id)
    }
  }
  
  if (localMessages.length === 0) {
    return (
      <div className="text-center py-12 bg-card/50 rounded-lg border border-border">
        <p className="text-muted-foreground">No hay mensajes todavía.</p>
      </div>
    )
  }
  
  return (
    <>
      <div className="bg-card/50 rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>De</TableHead>
              <TableHead>Asunto</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localMessages.map((message) => (
              <TableRow 
                key={message.id}
                className={message.read ? '' : 'bg-accent/5'}
              >
                <TableCell>
                  {message.read ? (
                    <MailOpen className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Mail className="w-4 h-4 text-accent" />
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <span className={`font-medium ${!message.read ? 'text-primary' : ''}`}>
                      {message.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {message.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {message.subject ? (
                    <Badge variant="outline">{message.subject}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">
                  {message.message}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(message.created_at), 'd MMM yyyy', { locale: es })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openMessage(message)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {selectedMessage?.subject || 'Sin asunto'}
            </DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{selectedMessage.name}</span>
                  <span className="text-muted-foreground ml-2">
                    &lt;{selectedMessage.email}&gt;
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {format(new Date(selectedMessage.created_at), "d MMM yyyy 'a las' HH:mm", { locale: es })}
                </span>
              </div>
              <div className="prose-literary text-foreground/90 whitespace-pre-wrap bg-secondary/30 rounded-lg p-4">
                {selectedMessage.message}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedMessage.email}`, '_blank')}
                >
                  Responder
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => deleteMessage(selectedMessage.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
