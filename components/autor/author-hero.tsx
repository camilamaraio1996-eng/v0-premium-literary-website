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
          {/* Biography with integrated image */}
          <div className="text-sm leading-relaxed text-muted-foreground">
            <p className="text-justify mb-6">
              Nació en Buenos Aires en 1996. Es técnica en Trabajo Social (UNLaM), vendedora y comerciante.
            </p>

            {/* Integrated author photo - responsive sizing */}
            <div className="my-8 flex justify-center lg:float-right lg:ml-8 lg:mb-6">
              <div className="relative w-44 lg:w-64 aspect-[3/4] overflow-hidden rounded-md border border-border/30 flex-shrink-0">
                <Image
                  src="/images/author-photo-new.jpg"
                  alt="Camila Maraio - Autora"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 176px, 256px"
                />
              </div>
            </div>

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


