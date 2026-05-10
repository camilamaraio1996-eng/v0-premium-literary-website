'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const editions = [
  {
    id: 'digital',
    name: 'Edición Digital',
    price: '$9.99',
    description: 'Acceso inmediato a todos los formatos digitales',
    features: [
      'PDF de alta calidad',
      'ePub para e-readers',
      'Capítulo extra exclusivo',
      'Playlist del autor',
      'Descarga inmediata',
    ],
    popular: false,
  },
  {
    id: 'fisica',
    name: 'Edición Física',
    price: '$24.99',
    description: 'Libro físico con extras exclusivos',
    features: [
      'Tapa dura premium',
      'Papel de alta calidad',
      'Dedicatoria personalizada',
      'Marcapáginas exclusivo',
      'Edición digital incluida',
      'Envío gratuito',
    ],
    popular: true,
  },
  {
    id: 'coleccionista',
    name: 'Edición Coleccionista',
    price: '$49.99',
    description: 'Para los verdaderos amantes de los libros',
    features: [
      'Todo de la edición física',
      'Numerada y firmada',
      'Ilustraciones exclusivas',
      'Caja de colección',
      'Impresión artística',
      'Acceso a eventos privados',
      'Limitada a 100 copias',
    ],
    popular: false,
    limited: true,
  },
]

export function BookEditions() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-[0.2em] text-accent mb-4 block">
            Elige tu edición
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl text-primary mb-4">
            Ediciones Disponibles
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Cada edición ha sido cuidadosamente diseñada para ofrecer 
            una experiencia única de lectura.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {editions.map((edition, index) => (
            <motion.div
              key={edition.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative p-8 bg-card border rounded-lg ${
                edition.popular ? 'border-accent' : 'border-border'
              }`}
            >
              {edition.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs px-4 py-1 rounded-full">
                  Más Popular
                </span>
              )}
              {edition.limited && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground text-xs px-4 py-1 rounded-full">
                  Edición Limitada
                </span>
              )}
              
              <h3 className="font-serif text-xl text-primary mb-2">
                {edition.name}
              </h3>
              <p className="text-3xl font-light text-accent mb-2">
                {edition.price}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {edition.description}
              </p>
              
              <ul className="space-y-3 mb-8">
                {edition.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                asChild 
                className="w-full"
                variant={edition.popular ? 'default' : 'outline'}
              >
                <Link href={`/preventa?edition=${edition.id}`}>
                  Reservar Ahora
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
