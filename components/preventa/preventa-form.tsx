'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Check } from 'lucide-react'

const editions = [
  {
    id: 'digital',
    name: 'Edición Digital',
    price: '$9.99',
    description: 'PDF + ePub + contenido extra',
  },
  {
    id: 'fisica',
    name: 'Edición Física',
    price: '$24.99',
    description: 'Tapa dura + dedicatoria + digital',
    popular: true,
  },
  {
    id: 'coleccionista',
    name: 'Edición Coleccionista',
    price: '$49.99',
    description: 'Firmada + numerada + extras',
    limited: true,
  },
]

export function PreventaForm() {
  return (
    <Suspense fallback={<PreventaFormSkeleton />}>
      <PreventaFormContent />
    </Suspense>
  )
}

function PreventaFormSkeleton() {
  return (
    <section id="reservar" className="py-24 lg:py-32">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl text-primary mb-4">
            Reserva Tu Copia
          </h2>
          <p className="text-muted-foreground">
            Cargando formulario...
          </p>
        </div>
        <div className="animate-pulse space-y-8">
          <div className="h-48 bg-muted/20 rounded-lg" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="h-12 bg-muted/20 rounded-lg" />
            <div className="h-12 bg-muted/20 rounded-lg" />
          </div>
          <div className="h-24 bg-muted/20 rounded-lg" />
          <div className="h-12 bg-muted/20 rounded-lg" />
        </div>
      </div>
    </section>
  )
}

function PreventaFormContent() {
  const searchParams = useSearchParams()
  const initialEdition = searchParams.get('edition') || 'fisica'
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [edition, setEdition] = useState(initialEdition)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    
    const supabase = createClient()
    const { error } = await supabase
      .from('preorders')
      .insert({
        name,
        email,
        edition,
        message: message || null,
      })
    
    if (error) {
      setStatus('error')
      setErrorMessage('Error al procesar la reserva. Intenta de nuevo.')
      return
    }
    
    setStatus('success')
  }
  
  if (status === 'success') {
    return (
      <section className="py-24 lg:py-32">
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
              ¡Reserva Confirmada!
            </h2>
            <p className="text-muted-foreground mb-6">
              Gracias por tu confianza, {name}. Recibirás un email en{' '}
              <span className="text-primary">{email}</span> con los detalles de tu reserva 
              y actualizaciones sobre el lanzamiento.
            </p>
            <p className="text-sm text-muted-foreground">
              Pronto te enviaremos acceso a los fragmentos exclusivos.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }
  
  return (
    <section id="reservar" className="py-24 lg:py-32">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-primary mb-4">
              Reserva Tu Copia
            </h2>
            <p className="text-muted-foreground">
              Completa el formulario para asegurar tu ejemplar.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Edition Selection */}
            <div>
              <Label className="text-base mb-4 block">Selecciona tu edición</Label>
              <RadioGroup
                value={edition}
                onValueChange={setEdition}
                className="grid gap-4"
              >
                {editions.map((ed) => (
                  <label
                    key={ed.id}
                    className={`relative flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                      edition === ed.id
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <RadioGroupItem value={ed.id} id={ed.id} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-primary">{ed.name}</span>
                        {ed.popular && (
                          <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">
                            Popular
                          </span>
                        )}
                        {ed.limited && (
                          <span className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded">
                            Limitada
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{ed.description}</span>
                    </div>
                    <span className="text-lg font-light text-accent">{ed.price}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
            
            {/* Contact Info */}
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
            
            {/* Optional Message */}
            <div>
              <Label htmlFor="message">
                Mensaje para la dedicatoria <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Si tienes alguna solicitud especial para la dedicatoria..."
                rows={3}
                className="mt-1"
              />
            </div>
            
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
            
            <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
              {status === 'loading' ? 'Procesando...' : 'Confirmar Reserva'}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Al reservar aceptas recibir comunicaciones sobre el lanzamiento. 
              El pago se procesará más cerca de la fecha de envío.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
