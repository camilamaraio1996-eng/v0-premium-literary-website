'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const quotes = [
  'Los sueños no son mentiras; son verdades que todavía no sabemos leer.',
  'Escribir es recordar cosas que nunca sucedieron.',
  'Cada libro es una puerta. El lector decide si quiere atravesarla.',
]

export function AuthorQuotes() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl text-primary mb-12 text-center">
            Pensamientos
          </h2>
          
          <div className="space-y-8">
            {quotes.map((quote, index) => (
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-l-2 border-accent pl-6 py-2"
              >
                <p className="font-serif text-xl text-primary/90 italic">
                  &ldquo;{quote}&rdquo;
                </p>
              </motion.blockquote>
            ))}
          </div>
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">
            ¿Quieres conocer más sobre el proceso creativo?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link href="/diario">
                Leer el Diario
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contacto">
                Contactar
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
