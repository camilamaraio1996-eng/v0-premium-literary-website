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
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              La escritura de <em>El Libro de los Sueños</em> comenzó, como muchas 
              cosas importantes, de manera accidental. Un cuaderno junto a la cama, 
              la costumbre de anotar los sueños al despertar, y la gradual comprensión 
              de que esos fragmentos nocturnos contenían algo que merecía ser explorado.
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
                name: 'm. enriquez',
                description: 'Un lugar soleado para gente sombría',
              },
              {
                name: 'N Ephron',
                description: 'No me gusta mi cuello',
              },
              {
                name: 'K. O. KNAUSGARD',
                description: 'La isla de la infancia',
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
