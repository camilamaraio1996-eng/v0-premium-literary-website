'use client'

import { motion } from 'framer-motion'

export function AuthorHeader() {
  return (
    <section className="pt-8 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-primary leading-tight mb-6 whitespace-nowrap">
            Camila Maraio
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl text-sm">
            La autora
          </p>
        </motion.div>
      </div>
    </section>
  )
}
