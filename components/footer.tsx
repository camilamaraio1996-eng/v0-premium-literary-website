'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    const supabase = createClient()

    const { error } = await supabase
      .from('subscribers')
      .insert({ email })

    if (error) {
      if (error.code === '23505') {
        setStatus('error')
        setMessage('Este email ya está suscrito.')
      } else {
        setStatus('error')
        setMessage('Error al suscribirse. Intenta de nuevo.')
      }
    } else {
      setStatus('success')
      setMessage('Gracias por suscribirte.')
      setEmail('')
    }

    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 4000)
  }

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl text-primary mb-4">
              El Libro de los Sueños
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-md mb-6">
              Una novela que explora los territorios más profundos de los sueños 
              y las emociones. Una experiencia literaria inmersiva.
            </p>
            
            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <Input
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border"
                required
              />
              <Button 
                type="submit" 
                variant="secondary"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Enviando...' : 'Suscribir'}
              </Button>
            </form>
            {message && (
              <p className={`mt-2 text-sm ${status === 'success' ? 'text-accent' : 'text-destructive'}`}>
                {message}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Navegación
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/libro" className="text-foreground/80 hover:text-primary transition-colors">
                  El Libro
                </Link>
              </li>
              <li>
                <Link href="/fragmentos" className="text-foreground/80 hover:text-primary transition-colors">
                  Fragmentos
                </Link>
              </li>
              <li>
                <Link href="/diario" className="text-foreground/80 hover:text-primary transition-colors">
                  Diario
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/autor" className="text-foreground/80 hover:text-primary transition-colors">
                  Sobre el Autor
                </Link>
              </li>
              <li>
                <Link href="/preventa" className="text-foreground/80 hover:text-primary transition-colors">
                  Preventa
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-foreground/80 hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} El Libro de los Sueños. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Hecho con pasión por las palabras
          </p>
        </div>
      </div>
    </footer>
  )
}
