'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AboutBookSection() {
  return (
    <section id="about-book" className="py-24 lg:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Book Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative mx-auto w-64 lg:w-80">
              {/* Book shadow */}
              <div className="absolute inset-0 bg-accent/20 blur-3xl transform translate-y-8 scale-90" />
              
              {/* Book cover */}
              <div className="relative bg-gradient-to-br from-secondary to-muted rounded-sm overflow-hidden shadow-2xl transform perspective-1000 rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-500">
                <div className="aspect-[2/3] flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-full h-px bg-border mb-8" />
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                    Novela
                  </span>
                  <h3 className="font-serif text-2xl lg:text-3xl text-primary leading-tight mb-4">
                    El Libro de<br />los Sueños
                  </h3>
                  <div className="w-12 h-px bg-accent mb-4" />
                  <span className="text-sm text-muted-foreground">
                    Autor
                  </span>
                  <div className="w-full h-px bg-border mt-8" />
                </div>
              </div>
              
              {/* Book spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background/50 to-transparent" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-sm uppercase tracking-[0.2em] text-accent mb-4 block">
              La Historia
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-primary mb-6 leading-tight">
              Un viaje a los territorios del inconsciente
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                En algún lugar entre la vigilia y el sueño, existe un mundo donde 
                los recuerdos se transforman, donde las emociones cobran forma 
                tangible y donde cada noche es una oportunidad de descubrir 
                verdades que el día nos oculta.
              </p>
              <p>
                Esta novela es una exploración íntima de ese territorio. A través 
                de una prosa cuidadosamente tejida, te invito a sumergirte en una 
                narrativa que desdibuja las fronteras entre lo real y lo onírico.
              </p>
              <p>
                Cada capítulo es una puerta. Cada página, un sueño por descifrar.
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild variant="outline">
                <Link href="/libro">
                  Descubrir Más
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/fragmentos">
                  Leer un Fragmento
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-12 border-t border-border pt-8">
              <div>
                <span className="font-serif text-3xl text-primary">320</span>
                <p className="text-sm text-muted-foreground mt-1">Páginas</p>
              </div>
              <div>
                <span className="font-serif text-3xl text-primary">12</span>
                <p className="text-sm text-muted-foreground mt-1">Capítulos</p>
              </div>
              <div>
                <span className="font-serif text-3xl text-primary">2</span>
                <p className="text-sm text-muted-foreground mt-1">Ediciones</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
