'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookHeroProps {
  coverImage?: string | null
  bookTitle?: string
  buyUrl?: string | null
  buyLabel?: string
}

export function BookHero({ coverImage, bookTitle = 'El Libro de los Sueños', buyUrl, buyLabel = 'Comprar Ahora' }: BookHeroProps) {
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
                {coverImage ? (
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={coverImage}
                      alt={bookTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[2/3] flex flex-col items-center justify-center p-10 text-center">
                    <div className="w-full h-px bg-primary-foreground/20 mb-10" />
                    <span className="text-[10px] uppercase tracking-[0.35em] text-primary-foreground/60 mb-5">
                      Novela
                    </span>
                    <h2 className="font-serif text-2xl lg:text-3xl text-primary-foreground leading-tight mb-5">
                      {bookTitle}
                    </h2>
                    <div className="w-10 h-px bg-primary-foreground/40 mb-5" />
                    <span className="text-xs text-primary-foreground/50 tracking-wider">
                      Autora
                    </span>
                    <div className="w-full h-px bg-primary-foreground/20 mt-10" />
                  </div>
                )}
              </div>

              {/* Pages effect */}
              <div className="absolute right-0 top-1 bottom-1 w-2 bg-gradient-to-l from-[#958568]/20 to-transparent rounded-r-sm" />
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
              Una novela de sueños y memoria
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl text-primary mb-6 leading-tight">
              {bookTitle}
            </h1>
            <div className="w-10 h-px bg-accent mb-7" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-md">
              Una exploración íntima de los territorios donde la vigilia y el 
              sueño se entrelazan, donde los recuerdos mutan y las emociones 
              encuentran su forma más pura.
            </p>

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs mb-10">
              {[
                { label: 'Género', value: 'Ficción Literaria' },
                { label: 'Idioma', value: 'Español' },
                { label: 'Publicación', value: 'Otoño 2026' },
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
}
