'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function AuthorHero() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Author Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="relative mx-auto w-64 lg:w-80 aspect-[3/4]">
              {/* Ambient glow */}
              <div className="absolute inset-0 bg-accent/10 blur-3xl" />
              
              {/* Author photo */}
              <div className="relative bg-muted rounded-lg overflow-hidden h-full">
                <Image
                  src="/images/author-photo.jpg"
                  alt="Camila Maraio - Author"
                  width={400}
                  height={533}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <span className="text-sm uppercase tracking-[0.2em] text-accent mb-4 block">
              El Autor
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl text-primary mb-6 leading-tight">
              Una voz entre sueños y palabras
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Escritor, soñador y explorador de los territorios donde la memoria 
              y la imaginación se entrelazan. <em>El Libro de los Sueños</em> es 
              su primera novela publicada, aunque no la primera que ha escrito.
            </p>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {`Nació en Buenos Aires en 1996. Es técnica en Trabajo Social (UNLaM), vendedora y comerciante. 

Participó de distintos talleres literarios y escribe a diario. 
Encuentra su pasión en relatar hechos de la vida cotidiana a través del humor y la sensibilidad. 

En el 2026 saca su primer libro de relatos "Lo real y lo otro" de la mano de la editorial Orsai.`}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
