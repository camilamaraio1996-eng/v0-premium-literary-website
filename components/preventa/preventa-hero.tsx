'use client'

import { motion } from 'framer-motion'

export function PreventaHero() {
  return (
    <section className="py-24 lg:py-32 text-center relative overflow-hidden grain">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="max-w-3xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm uppercase tracking-[0.2em] text-accent mb-4 block">
            Reserva Exclusiva
          </span>
          <h1 className="font-serif text-4xl lg:text-6xl text-primary mb-6 text-balance">
            Sé parte de este sueño
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Reserva tu copia de <em>El Libro de los Sueños</em> y obtén acceso 
            exclusivo a contenido adicional, una dedicatoria personalizada del 
            autor y envío prioritario.
          </p>
        </motion.div>
        
        {/* Countdown or date */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 inline-flex items-center gap-4 px-6 py-3 bg-card/50 border border-border rounded-full"
        >
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">
            Envío estimado: <span className="text-primary font-medium">Otoño 2026</span>
          </span>
        </motion.div>
      </div>
    </section>
  )
}
