'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function AboutBookSection() {
  return (
    <section id="about-book" className="py-24 lg:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Book Cover - Larger and more prominent */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative lg:col-span-1 flex justify-center lg:justify-start"
          >
            <div className="relative w-72 lg:w-96">
              {/* Book shadow */}
              <div className="absolute inset-0 bg-accent/20 blur-3xl transform translate-y-12 scale-90 -z-10" />
              
              {/* Book cover image */}
              <div className="relative shadow-2xl">
                <Image
                  src="/images/book-cover.jpg"
                  alt="Lo real y lo otro - Book Cover"
                  width={400}
                  height={600}
                  className="w-full h-auto rounded-sm"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <span className="text-sm uppercase tracking-[0.2em] text-primary mb-4 block">
              Lo real y lo otro - editorial orsai
            </span>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                A través de historias reales, el libro busca una conexión con el lector. Que este pueda encontrarse en las páginas, hundirse en ellas hasta hacerlas propias.
              </p>
              <p>
                Es una exploración íntima de los vínculos, los sueños, el inconsciente. Cada relato aborda una temática diferente de la vida. Algunos lo hacen en un tono humorístico, mientras que otros se vuelven sombríos.
              </p>
              <p>
                Son historias de vida, consecuencias unas de las otras.
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild variant="outline">
                <Link href="/libro">
                  Descubrir Más
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
