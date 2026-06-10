'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function QuickAccessSection() {
  const items = [
    {
      title: 'Descubrí libros',
      buttonText: 'IR A BIBLIOTECA',
      href: '/recomendaciones',
      delay: 0.1,
    },
    {
      title: '¿Querés leer?',
      buttonText: 'IR AL BLOG',
      href: '/diario',
      delay: 0.2,
    },
  ]

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: item.delay }}
              className="flex flex-col items-start justify-between p-6 sm:p-8 rounded-lg border border-border/40 bg-card/30 hover:bg-card/50 hover:border-border/60 transition-all duration-300 group"
            >
              <h3 className="font-serif text-sm sm:text-lg md:text-xl text-primary mb-4 group-hover:text-accent transition-colors duration-300 tracking-wide">
                {item.title}
              </h3>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="text-xs uppercase tracking-[0.15em] gap-2 group-hover:bg-primary/5"
              >
                <Link href={item.href}>
                  {item.buttonText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
