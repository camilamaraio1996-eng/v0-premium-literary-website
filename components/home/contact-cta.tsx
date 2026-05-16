'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ContactCTA() {
  return (
    <section className="py-16 lg:py-24 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Eyebrow */}
          <span className="text-xs uppercase tracking-[0.25em] text-[#958568] block mb-4">
            Hablemos
          </span>

          {/* Heading */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary leading-tight mb-6">
            Contacto
          </h2>

          {/* Description */}
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
            ¿Tenes ideas, preguntas, colaboraciones? Podes contactarme desde aca
          </p>

          {/* CTA Button/Link */}
          <Link
            href="/contacto"
            className={cn(
              'inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5',
              'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
              'transition-all duration-300 uppercase text-xs sm:text-sm tracking-[0.12em]',
              'group'
            )}
          >
            Enviar Mensaje
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
