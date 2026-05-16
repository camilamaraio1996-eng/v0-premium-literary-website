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
  eyebrow = 'Camila Maraio',
  description = 'Un viaje a través de los territorios más profundos de la memoria, donde los sueños y las emociones se entrelazan en una narrativa que desafía los límites de lo real.',
  imageUrl = null,
  imageAlt = '',
  ctaPrimaryLabel = 'Descubrir el Libro',
  ctaPrimaryHref = '/libro',
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
    <section className="relative min-h-screen flex flex-col justify-start overflow-hidden bg-background pt-28 md:pt-36 lg:pt-44">
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 w-full">
        {/* Author name - small eyebrow */}
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-block text-xs uppercase tracking-[0.35em] text-[#958568] mb-6"
          >
            {eyebrow}
          </motion.span>
        )}

        {/* Main title - editorial premium */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="font-serif text-5xl md:text-6xl lg:text-7xl text-primary mb-6 text-balance leading-tight uppercase tracking-tight"
        >
          {title}
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="w-12 h-px bg-accent mb-10 md:mb-14 origin-left"
        />

        {/* Premium video wrapper - asymmetric positioning */}
        {embedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="relative mt-10 md:mt-14 w-full max-w-3xl md:max-w-4xl mx-auto md:ml-[18%] md:mr-auto md:-translate-x-6"
          >
            {/* Subtle glow background */}
            <div className="absolute -inset-6 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-2xl blur-3xl opacity-60" />
            
            {/* Video container */}
            <div className="relative rounded-2xl p-1 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/30 shadow-2xl overflow-hidden">
              <div className="relative rounded-xl overflow-hidden bg-background border border-border/50 backdrop-blur-sm">
                <div className="relative aspect-video bg-muted">
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
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subtitle - below video */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto text-center mt-8 leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Primary CTA buttons - horizontal layout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-accent transition-colors uppercase tracking-[0.15em] text-xs px-8">
            <Link href={ctaPrimaryHref}>{ctaPrimaryLabel}</Link>
          </Button>
        </motion.div>

        {/* Buy button - same row as primary CTA on desktop */}
        {buyUrl && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center mt-4 sm:mt-0 sm:-mt-16 sm:ml-4"
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

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        onClick={scrollToContent}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/40 hover:text-primary transition-colors mt-auto"
        aria-label="Desplazar hacia abajo"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown size={28} />
        </motion.div>
      </motion.button>
    </section>
  )
}
