'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Check, Mail, MessageSquare } from 'lucide-react'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    
    const supabase = createClient()
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        subject: subject || null,
        message,
      })
    
    if (error) {
      setStatus('error')
      setErrorMessage('Error al enviar el mensaje. Intenta de nuevo.')
      return
    }
    
    setStatus('success')
  }
  
  if (status === 'success') {
    return (
      <section className="py-12 lg:py-24">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-serif text-3xl text-primary mb-4">
              Mensaje Enviado
            </h2>
            <p className="text-muted-foreground">
              Gracias por tu mensaje, {name}. Responderé lo antes posible 
              a través de {email}.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }
  
  return (
    <section className="py-12 lg:py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="subject">
                  Asunto <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="¿Sobre qué quieres escribir?"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={6}
                  required
                  className="mt-1"
                />
              </div>
              
              {errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}
              
              <Button type="submit" size="lg" disabled={status === 'loading'}>
                {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
              </Button>
            </form>
          </motion.div>
          
          {/* Info sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="space-y-8">
              <div className="p-6 bg-card/50 border border-border rounded-lg">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-serif text-lg text-primary mb-2">
                  Email Directo
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Para consultas urgentes o colaboraciones profesionales.
                </p>
                <a 
                  href="mailto:autor@ellibrodelssuenos.com" 
                  className="text-sm text-accent hover:underline"
                >
                  autor@ellibrodelssuenos.com
                </a>
              </div>
              
              <div className="p-6 bg-card/50 border border-border rounded-lg">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-serif text-lg text-primary mb-2">
                  Respuestas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Intento responder todos los mensajes en un plazo de 
                  2-3 días hábiles. Los mensajes sobre el libro y el 
                  proceso creativo son especialmente bienvenidos.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
