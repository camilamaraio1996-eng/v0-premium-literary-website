'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function BookCTASection() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-accent transition-colors uppercase tracking-[0.15em] text-xs px-8">
            <Link href="#fragmentos">
              Descubrir El Libro
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="uppercase tracking-[0.15em] text-xs px-8">
            <Link href="/diario">
              Blog
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
