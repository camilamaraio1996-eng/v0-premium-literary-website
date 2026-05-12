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
              <div className="relative">
                <Image
                  src="/images/book-cover.jpg"
                  alt="Lo real y lo otro - Book Cover"
                  width={400}
                  height={600}
                  className="w-full h-auto"
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
            <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-md whitespace-pre-line">
              {`Explora los distintos universos.
Toca temáticas relacionadas con los sueños, el inconsciente, las voces que habitan en nuestra mente y mucho más. 
Atrapando al lector desde el primer momento, relata historias reales que parecen de ficción.`}
            </p>
            
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
