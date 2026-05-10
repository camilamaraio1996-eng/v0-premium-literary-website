'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm uppercase tracking-[0.2em] text-accent mb-6 block">
            Preventa Exclusiva
          </span>
          
          <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-6 text-balance">
            Sé parte de este sueño
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            Reserva tu copia en preventa y recibe acceso anticipado a 
            contenido exclusivo, fragmentos inéditos y una dedicatoria 
            personalizada del autor.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/preventa">
                Reservar Ahora
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/contacto">
                Contactar al Autor
              </Link>
            </Button>
          </div>

          {/* Editions preview */}
          <div className="mt-16 grid sm:grid-cols-2 gap-6 max-w-lg mx-auto">
            <div className="p-6 bg-card/50 border border-border rounded-lg">
              <h3 className="font-serif text-xl text-primary mb-2">
                Edición Digital
              </h3>
              <p className="text-2xl font-light text-accent mb-2">$9.99</p>
              <p className="text-sm text-muted-foreground">
                PDF + ePub + contenido extra
              </p>
            </div>
            <div className="p-6 bg-card/50 border border-accent/30 rounded-lg relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full">
                Popular
              </span>
              <h3 className="font-serif text-xl text-primary mb-2">
                Edición Física
              </h3>
              <p className="text-2xl font-light text-accent mb-2">$24.99</p>
              <p className="text-sm text-muted-foreground">
                Tapa dura + dedicatoria + digital
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
