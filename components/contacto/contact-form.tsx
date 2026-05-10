'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Check } from 'lucide-react'

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
      .insert({ name, email, subject: subject || null, message })

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
            <div className="w-14 h-14 bg-secondary flex items-center justify-center mx-auto mb-6">
              <Check className="w-6 h-6 text-accent" />
            </div>
            <h2 className="font-serif text-2xl text-primary mb-4">
              Mensaje Enviado
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Gracias, {name}. Me pondré en contacto contigo pronto a través de {email}.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 lg:py-24">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Nombre
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
                className="bg-background border-border focus:border-accent"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="bg-background border-border focus:border-accent"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Asunto <span className="normal-case text-muted-foreground/60">(opcional)</span>
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="¿Sobre qué quieres escribirme?"
              className="bg-background border-border focus:border-accent"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Mensaje
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              rows={7}
              required
              className="bg-background border-border focus:border-accent resize-none"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}

          <Button
            type="submit"
            disabled={status === 'loading'}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-accent transition-colors uppercase tracking-[0.15em] text-xs"
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
          </Button>
        </motion.form>
      </div>
    </section>
  )
}
