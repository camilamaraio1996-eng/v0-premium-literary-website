'use client'

import { motion } from 'framer-motion'

export function AuthorHero() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Author Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="relative mx-auto w-64 lg:w-80 aspect-[3/4]">
              {/* Ambient glow */}
              <div className="absolute inset-0 bg-accent/10 blur-3xl" />
              
              {/* Image placeholder */}
              <div className="relative bg-gradient-to-br from-secondary to-muted rounded-lg overflow-hidden h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 rounded-full bg-muted-foreground/10 mx-auto mb-4 flex items-center justify-center">
                    <span className="font-serif text-4xl text-muted-foreground">A</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Fotografía del autor</span>
                </div>
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
              El Autor
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl text-primary mb-6 leading-tight">
              Una voz entre sueños y palabras
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Escritor, soñador y explorador de los territorios donde la memoria 
              y la imaginación se entrelazan. <em>El Libro de los Sueños</em> es 
              su primera novela publicada, aunque no la primera que ha escrito.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              &ldquo;Escribo porque hay cosas que solo pueden decirse en la 
              frontera entre el sueño y la vigilia, en ese espacio donde las 
              palabras todavía no han aprendido a mentir.&rdquo;
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
