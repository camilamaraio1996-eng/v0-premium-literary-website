'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BookHeroProps } from '@/types/book'

// Default book cover image path
const DEFAULT_COVER_IMAGE = '/images/book-cover.png'

export const BookHero = memo(function BookHero({
  coverImage,
  bookTitle = 'Lo real y lo otro',
  buyUrl,
  buyLabel = 'Comprar Ahora',
}: BookHeroProps) {
  // Use provided cover image or fall back to default
  const displayCoverImage = coverImage || DEFAULT_COVER_IMAGE

  return (
    <section className="py-12 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Mobile Layout: Cover -> Meta -> Button */}
        {/* Desktop Layout: Cover (left) | Content (right) */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Book cover - Shows first on mobile, left on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:order-1"
          >
            <div className="relative mx-auto w-64 lg:w-80">
              <div className="relative bg-transparent overflow-hidden">
                <div className="aspect-[2/3] relative">
                  <Image
                    src={displayCoverImage}
                    alt={bookTitle}
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 768px) 256px, 320px"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Section - Shows second on mobile, right on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:order-2"
          >
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-6 lg:mb-10">
              Explora los distintos universos.
            </p>

            {/* Meta */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 text-xs mb-10">
              {[
                { label: 'Género', value: 'Realismo Mágico' },
                { label: 'Idioma', value: 'Español' },
                { label: 'Publicación', value: 'Junio 2026' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="block uppercase tracking-[0.15em] text-muted-foreground mb-1">
                    {label}
                  </span>
                  <span className="text-primary font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* Buy link */}
            {buyUrl && (
              <Button asChild size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-accent transition-colors uppercase tracking-[0.15em] text-xs px-8">
                <a href={buyUrl} target="_blank" rel="noopener noreferrer">
                  <ShoppingBag className="w-4 h-4" />
                  {buyLabel}
                </a>
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
})

