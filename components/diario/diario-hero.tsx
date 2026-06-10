'use client'

import { motion } from 'framer-motion'

export function DiarioHero() {
  return (
    <section className="pt-20 pb-8 sm:pt-24 sm:pb-12 lg:pt-32 lg:pb-20 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-serif text-4xl lg:text-6xl text-primary leading-tight mb-6">
            Blog
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl text-sm">
            Lo que se cruce en el día, simple, sin filtros
          </p>
        </motion.div>
      </div>
    </section>
  )
}
