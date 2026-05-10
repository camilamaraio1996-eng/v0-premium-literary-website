'use client'

import { motion } from 'framer-motion'
import { BookOpen, Pen, Gift, Zap, Mail, Star } from 'lucide-react'

const benefits = [
  {
    icon: Pen,
    title: 'Dedicatoria Personalizada',
    description: 'Cada ejemplar físico incluye una dedicatoria escrita a mano por el autor.',
  },
  {
    icon: BookOpen,
    title: 'Capítulo Exclusivo',
    description: 'Acceso a un capítulo adicional que no estará en la edición regular.',
  },
  {
    icon: Zap,
    title: 'Acceso Anticipado',
    description: 'Recibe fragmentos exclusivos antes del lanzamiento oficial.',
  },
  {
    icon: Gift,
    title: 'Extras Digitales',
    description: 'Playlist curada por el autor, wallpapers y material detrás de escenas.',
  },
  {
    icon: Star,
    title: 'Reconocimiento',
    description: 'Tu nombre en la sección de agradecimientos del libro.',
  },
  {
    icon: Mail,
    title: 'Comunicación Directa',
    description: 'Actualizaciones exclusivas sobre el proceso de publicación.',
  },
]

export function PreventaBenefits() {
  return (
    <section className="py-24 lg:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-[0.2em] text-accent mb-4 block">
            Beneficios
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl text-primary mb-4">
            ¿Por qué reservar ahora?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Los primeros lectores recibirán beneficios exclusivos que no 
            estarán disponibles después del lanzamiento.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-card/50 border border-border rounded-lg"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-lg text-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
