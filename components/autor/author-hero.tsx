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
          {/* Editorial biography with integrated flowing image */}
          <div className="text-sm leading-[1.85] text-muted-foreground">
            {/* Single paragraph container with inline image */}
            <p className="text-justify mb-6">
              Nació en Buenos Aires en 1996. Es técnica en Trabajo Social (UNLaM), vendedora y comerciante. Participó de distintos talleres literarios y escribe a diario.
              
              {/* Image inlined within text flow - floats right to allow text wrapping */}
              <span className="float-right mb-3 ml-5 sm:mb-6 sm:ml-8 w-[140px] sm:w-[240px] flex-shrink-0 inline-block">
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-md border border-border/30 bg-muted">
                  <Image
                    src="/images/author-photo-new.jpg"
                    alt="Camila Maraio - Autora"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 140px, 240px"
                  />
                </div>
              </span>
              
              Encuentra su pasión en relatar hechos de la vida cotidiana a través del humor y la sensibilidad.
            </p>

            <p className="text-justify clear-both">
              En el 2026 sacó su primer libro de relatos &quot;Lo real y lo otro&quot; de la mano de la editorial Orsai.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}




