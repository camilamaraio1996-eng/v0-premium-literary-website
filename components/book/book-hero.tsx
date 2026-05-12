'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BookHeroProps } from '@/types/book'

/**
 * Book hero component with optimized image loading
 * Images use priority prop for LCP optimization and blur placeholder for visual feedback
 */
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
    <section className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Book cover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="relative mx-auto w-64 lg:w-80">
              {/* Cover */}
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

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-[#958568] mb-5 block">
              un libro de relatos
            </span>
            <h1 className="font-serif text-3xl lg:text-3xl xl:text-3xl text-primary mb-6 leading-tight">
              {bookTitle}
            </h1>
            <div className="w-10 h-px bg-accent mb-7" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-md">
              Explora los distintos universos.
            </p>

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs mb-10">
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
