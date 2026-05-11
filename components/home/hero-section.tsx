'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown, ShoppingBag } from 'lucide-react'

interface HeroSectionProps {
  title?: string
  eyebrow?: string
  description?: string
  imageUrl?: string | null
  imageAlt?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
  videoUrl?: string | null
  buyUrl?: string | null
  buyLabel?: string
}

function getEmbedUrl(url: string): string | null {
  if (url.includes('youtu.be/')) {
    return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`
  }
  if (url.includes('youtube.com/watch?v=')) {
    return `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}`
  }
  if (url.includes('youtube.com/embed/')) return url
  if (url.includes('vimeo.com/')) {
    const id = url.split('/').pop()?.split('?')[0]
    return id ? `https://player.vimeo.com/video/${id}` : null
  }
  return url // direct video URL
}

export function HeroSection({
  title = 'El Libro de los Sueños',
  eyebrow = 'Una novela de',
  description = 'Un viaje a través de los territorios más profundos de la memoria, donde los sueños y las emociones se entrelazan en una narrativa que desafía los límites de lo real.',
  imageUrl = null,
  imageAlt = '',
  ctaPrimaryLabel = 'Descubrir el Libro',
  ctaPrimaryHref = '/libro',
  ctaSecondaryLabel = 'Ir al Diario',
  ctaSecondaryHref = '/diario',
  videoUrl,
  buyUrl,
  buyLabel = 'Comprar el Libro',
}: HeroSectionProps) {
  const scrollToContent = () => {
    const element = document.getElementById('about-book')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null
  const isIframe = videoUrl && (videoUrl.includes('youtube') || videoUrl.includes('vimeo'))

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-block text-xs uppercase tracking-[0.35em] text-[#958568] mb-10"
        >
          {eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary mb-8 text-balance leading-tight"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="w-12 h-px bg-accent mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-base md:text-lg text-foreground/70 max-w-xl mx-auto mb-12 leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-accent transition-colors uppercase tracking-[0.15em] text-xs px-8">
            <Link href={ctaPrimaryHref}>{ctaPrimaryLabel}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors uppercase tracking-[0.15em] text-xs px-8">
            <Link href={ctaSecondaryHref}>{ctaSecondaryLabel}</Link>
          </Button>
        </motion.div>

        {/* Hero image */}
        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="w-full max-w-2xl mx-auto mb-10 rounded-lg overflow-hidden border border-border shadow-md h-80 sm:h-96 md:h-[500px] relative"
          >
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        {/* Home video */}
        {embedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="w-full max-w-3xl mx-auto mb-10 rounded-lg overflow-hidden border border-border shadow-md aspect-video"
          >
            {isIframe ? (
              <iframe
                src={embedUrl}
                title="Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={embedUrl} className="w-full h-full object-cover" controls controlsList="nodownload" />
            )}
          </motion.div>
        )}

        {/* Buy link */}
        {buyUrl && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95 }}
          >
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors uppercase tracking-[0.15em] text-xs px-10 gap-2">
              <a href={buyUrl} target="_blank" rel="noopener noreferrer">
                <ShoppingBag className="w-4 h-4" />
                {buyLabel}
              </a>
            </Button>
          </motion.div>
        )}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        onClick={scrollToContent}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/40 hover:text-primary transition-colors"
        aria-label="Desplazar hacia abajo"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown size={28} />
        </motion.div>
      </motion.button>
    </section>
  )
}
