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
    const { error } = await supabase.from('subscribers').insert({ email })
    if (error) {
      setStatus('error')
      setMessage(error.code === '23505' ? 'Este email ya está suscrito.' : 'Error al suscribirse. Intenta de nuevo.')
    } else {
      setStatus('success')
      setMessage('Gracias por suscribirte.')
      setEmail('')
    }
    setTimeout(() => { setStatus('idle'); setMessage('') }, 4000)
  }

  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand + newsletter */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-xl text-primary mb-3">
              El Libro de los Sueños
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mb-7">
              Una novela sobre los sueños, la memoria y las emociones. 
              Suscríbete para recibir novedades.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <Input
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border text-sm"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                disabled={status === 'loading'}
                className="shrink-0 border border-border text-xs uppercase tracking-[0.12em]"
              >
                {status === 'loading' ? '...' : 'Suscribir'}
              </Button>
            </form>
            {message && (
              <p className={`mt-2 text-xs ${status === 'success' ? 'text-accent' : 'text-destructive'}`}>
                {message}
              </p>
            )}
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Páginas
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/libro', label: 'El Libro' },
                { href: '/diario', label: 'Diario' },
                { href: '/autor', label: 'Autora' },
                { href: '/contacto', label: 'Contacto' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} El Libro de los Sueños. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Hecho con pasión por las palabras
          </p>
        </div>
      </div>
    </footer>
  )
}
