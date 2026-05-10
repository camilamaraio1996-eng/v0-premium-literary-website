'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Quote } from 'lucide-react'

export function FeaturedFragmentSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Quote className="w-12 h-12 text-accent/50 mx-auto mb-8" />
          
          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-primary leading-relaxed mb-8 text-balance">
            &ldquo;En el sueño, mi madre volvía a tener las manos jóvenes. 
            Las reconocí por el modo en que sostenían las cosas: con esa 
            delicadeza que solo conocen quienes han aprendido que todo, 
            absolutamente todo, puede romperse.&rdquo;
          </blockquote>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-border" />
            <span className="text-sm text-muted-foreground uppercase tracking-wider">
              Fragmento del Capítulo III
            </span>
            <div className="h-px w-12 bg-border" />
          </div>

            <Button asChild variant="outline" className="group">
            <Link href="/libro">
              Ver Fragmentos
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
