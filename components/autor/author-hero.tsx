'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function AuthorHero() {
  return (
    <section className="py-12 lg:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start"
        >
          {/* Author photo - appears first on mobile, left on desktop */}
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <div className="mx-auto lg:mx-0 w-48 lg:w-72">
              <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-border/30">
                <Image
                  src="/images/author-photo-new.jpg"
                  alt="Camila Maraio - Autora"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 192px, 288px"
                />
              </div>
            </div>
          </div>

          {/* Biography text - justified */}
          <div className="flex-1 text-sm leading-relaxed text-muted-foreground">
            <p className="text-justify mb-4">
              Nació en Buenos Aires en 1996. Es técnica en Trabajo Social (UNLaM), vendedora y comerciante.
            </p>
            <p className="text-justify mb-4">
              Participó de distintos talleres literarios y escribe a diario. Encuentra su pasión en relatar hechos de la vida cotidiana a través del humor y la sensibilidad.
            </p>
            <p className="text-justify">
              En el 2026 saca su primer libro de relatos &quot;Lo real y lo otro&quot; de la mano de la editorial Orsai.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

