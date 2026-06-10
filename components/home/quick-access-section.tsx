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
    <section className="py-6 sm:py-8 lg:py-10 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: item.delay }}
              className="flex flex-col items-start justify-between p-3 sm:p-4 lg:p-5 rounded-md border border-border/30 hover:border-border/50 hover:bg-secondary/10 transition-all duration-300 group"
            >
              <h3 className="font-serif text-xs sm:text-sm lg:text-base text-primary mb-2.5 sm:mb-3 group-hover:text-accent transition-colors duration-300 tracking-[0.08em] uppercase leading-tight">
                {item.title}
              </h3>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="text-[10px] sm:text-xs uppercase tracking-[0.12em] gap-1.5 h-auto py-1.5 px-3 sm:px-3.5 group-hover:text-accent transition-colors"
              >
                <Link href={item.href}>
                  {item.buttonText}
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
