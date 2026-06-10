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
        >
          {/* Biography with inline floating image - editorial layout */}
          <div className="text-sm leading-relaxed text-muted-foreground">
            {/* Floating author photo - inline with text */}
            <div className="float-right mb-3.5 ml-4.5 sm:mb-6 sm:ml-8 w-32 sm:w-72 flex-shrink-0">
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-md border border-border/30">
                <Image
                  src="/images/author-photo-new.jpg"
                  alt="Camila Maraio - Autora"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 128px, 288px"
                />
              </div>
            </div>

            <p className="text-justify mb-6">
              Nació en Buenos Aires en 1996. Es técnica en Trabajo Social (UNLaM), vendedora y comerciante.
            </p>

            <p className="text-justify mb-6">
              Participó de distintos talleres literarios y escribe a diario. Encuentra su pasión en relatar hechos de la vida cotidiana a través del humor y la sensibilidad.
            </p>
            <p className="text-justify">
              En el 2026 sacó su primer libro de relatos &quot;Lo real y lo otro&quot; de la mano de la editorial Orsai.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}



