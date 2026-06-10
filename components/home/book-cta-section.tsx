'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

interface BookCTAProps {
  buyUrl?: string | null
  buyLabel?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  description?: string
}

export function BookCTA({
  buyUrl,
  buyLabel = 'Comprar el Libro',
  ctaPrimaryLabel = 'Descubrí "Lo real y lo otro"',
  ctaPrimaryHref = '/libro',
  description = 'Un libro de relatos cortos, realistas.',
}: BookCTAProps) {
  return (
    <section className="py-8 sm:py-16 lg:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-base md:text-lg text-foreground/70 mb-8"
        >
          {description}
        </motion.p>

        {/* Buy button */}
        {buyUrl && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-4"
          >
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors uppercase tracking-[0.15em] text-xs px-10 gap-2">
              <a href={buyUrl} target="_blank" rel="noopener noreferrer">
                <ShoppingBag className="w-4 h-4" />
                {buyLabel}
              </a>
            </Button>
          </motion.div>
        )}

        {/* Discover button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center"
        >
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-accent transition-colors uppercase tracking-[0.15em] text-xs px-8">
            <Link href={ctaPrimaryHref}>{ctaPrimaryLabel}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
