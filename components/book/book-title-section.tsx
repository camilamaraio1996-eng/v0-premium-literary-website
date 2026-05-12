'use client'

import { motion } from 'framer-motion'

export function BookTitleSection() {
  return (
    <section className="py-32 lg:py-40 bg-background">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-8">
            Lo real y lo otro
          </h2>
          <div className="w-12 h-px bg-accent mx-auto" />
        </motion.div>
      </div>
    </section>
  )
}
