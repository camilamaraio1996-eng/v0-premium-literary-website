'use client'

import { motion } from 'framer-motion'

export function BookHero() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden grain">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Book Cover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="relative mx-auto w-72 lg:w-96">
              {/* Ambient glow */}
              <div className="absolute inset-0 bg-accent/20 blur-3xl transform translate-y-8" />
              
              {/* Book */}
              <div className="relative">
                {/* Book cover */}
                <div className="bg-gradient-to-br from-secondary to-muted rounded-sm overflow-hidden shadow-2xl">
                  <div className="aspect-[2/3] flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-full h-px bg-border mb-12" />
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
                      Novela
                    </span>
                    <h2 className="font-serif text-3xl lg:text-4xl text-primary leading-tight mb-6">
                      El Libro de<br />los Sueños
                    </h2>
                    <div className="w-16 h-px bg-accent mb-6" />
                    <span className="text-muted-foreground">
                      Autor
                    </span>
                    <div className="w-full h-px bg-border mt-12" />
                  </div>
                </div>
                
                {/* Book pages effect */}
                <div className="absolute right-0 top-2 bottom-2 w-2 bg-gradient-to-l from-foreground/5 to-transparent rounded-r-sm" />
                <div className="absolute right-1 top-1 bottom-1 w-1 bg-foreground/5 rounded-r-sm" />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <span className="text-sm uppercase tracking-[0.2em] text-accent mb-4 block">
              Una novela de sueños y memoria
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl text-primary mb-6 leading-tight">
              El Libro de los Sueños
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Una exploración íntima de los territorios donde la vigilia y el 
              sueño se entrelazan, donde los recuerdos mutan y las emociones 
              encuentran su forma más pura.
            </p>
            
            {/* Meta info */}
            <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
              <div>
                <span className="block text-primary font-medium">Género</span>
                Ficción Literaria
              </div>
              <div>
                <span className="block text-primary font-medium">Páginas</span>
                320
              </div>
              <div>
                <span className="block text-primary font-medium">Idioma</span>
                Español
              </div>
              <div>
                <span className="block text-primary font-medium">Publicación</span>
                Otoño 2026
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
