'use client'

import { motion } from 'framer-motion'

export function DiarioHero() {
  return (
    <section className="pt-24 pb-16 lg:pt-32 lg:pb-20 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#958568] block mb-4">
            Blog
          </span>
          <h1 className="font-serif text-4xl lg:text-6xl text-primary leading-tight mb-6">
            Diario
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl text-sm">
            Lo que se cruce en el día, simple, sin filtros
          </p>
        </motion.div>
      </div>
    </section>
  )
}
