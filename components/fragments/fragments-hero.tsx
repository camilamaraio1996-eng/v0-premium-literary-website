'use client'

import { motion } from 'framer-motion'

export function FragmentsHero() {
  return (
    <section className="py-24 lg:py-32 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-transparent" />
      
      <div className="max-w-3xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm uppercase tracking-[0.2em] text-accent mb-4 block">
            Lectura Exclusiva
          </span>
          <h1 className="font-serif text-4xl lg:text-5xl text-primary mb-6">
            Fragmentos del Libro
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Una selección de pasajes que te permitirán asomarte al universo 
            onírico de esta novela antes de su publicación.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
