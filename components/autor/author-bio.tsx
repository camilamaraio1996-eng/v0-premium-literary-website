'use client'

import { motion } from 'framer-motion'

export function AuthorBio() {
  return (
    <section className="py-24 lg:py-32 bg-card/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="prose-literary"
        >
          <h2 className="font-serif text-3xl text-primary mb-8 text-center">
            Sobre el Proceso
          </h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              La escritura de <em>El Libro de los Sueños</em> comenzó, como muchas 
              cosas importantes, de manera accidental. Un cuaderno junto a la cama, 
              la costumbre de anotar los sueños al despertar, y la gradual comprensión 
              de que esos fragmentos nocturnos contenían algo que merecía ser explorado.
            </p>
            
            <p>
              El proceso tomó varios años. No fueron años de escritura continua, sino 
              de espera, de observación, de dejar que las historias maduraran en 
              silencio antes de intentar capturarlas con palabras.
            </p>
            
            <p>
              Esta novela es el resultado de ese proceso: una meditación sobre la 
              naturaleza de la memoria, la identidad y los mundos que construimos 
              cada noche cuando cerramos los ojos.
            </p>
          </div>
        </motion.div>
        
        {/* Influences */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-24"
        >
          <h3 className="font-serif text-2xl text-primary mb-8 text-center">
            Influencias
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Borges',
                description: 'La arquitectura de los laberintos y la exploración del infinito.',
              },
              {
                name: 'Cortázar',
                description: 'El juego con la realidad y las puertas entre mundos.',
              },
              {
                name: 'Rulfo',
                description: 'Los murmullos, las voces que hablan desde otro lugar.',
              },
            ].map((influence) => (
              <div 
                key={influence.name}
                className="p-6 bg-card/50 border border-border rounded-lg text-center"
              >
                <h4 className="font-serif text-lg text-primary mb-2">
                  {influence.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {influence.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
