'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface HomeHeroSectionProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  description?: string
  imageUrl?: string | null
  imageAlt?: string
  primaryCTALabel?: string
  primaryCTAHref?: string
  secondaryCTALabel?: string
  secondaryCTAHref?: string
}

export function HomeHeroSection({
  eyebrow = 'Una novela de',
  title = '',
  subtitle = '',
  description = '',
  imageUrl = null,
  imageAlt = '',
  primaryCTALabel = 'Descubrir el Libro',
  primaryCTAHref = '/libro',
  secondaryCTALabel = 'Ir al Diario',
  secondaryCTAHref = '/diario',
}: HomeHeroSectionProps) {
  return (
    <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 max-w-2xl text-center lg:text-left"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          {eyebrow}
        </p>

        <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl text-primary mb-6 leading-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-lg text-muted-foreground mb-8 font-light">
            {subtitle}
          </p>
        )}

        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
          {primaryCTAHref && (
            <Link
              href={primaryCTAHref}
              className="px-8 py-3 bg-primary text-primary-foreground uppercase text-xs tracking-[0.15em] hover:bg-accent transition-colors"
            >
              {primaryCTALabel}
            </Link>
          )}
          {secondaryCTAHref && (
            <Link
              href={secondaryCTAHref}
              className="px-8 py-3 border border-primary text-primary uppercase text-xs tracking-[0.15em] hover:bg-accent/10 transition-colors"
            >
              {secondaryCTALabel}
            </Link>
          )}
        </div>
      </motion.div>

      {imageUrl && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative w-full h-96 lg:h-screen max-w-md"
        >
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </motion.div>
      )}
    </section>
  )
}
