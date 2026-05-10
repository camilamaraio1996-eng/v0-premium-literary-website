'use client'

import { motion } from 'framer-motion'

const chapters = [
  { number: 1, title: 'El umbral', description: 'Donde todo comienza, en la frontera entre dos mundos.' },
  { number: 2, title: 'Fragmentos de luz', description: 'Los primeros recuerdos que emergen de la oscuridad.' },
  { number: 3, title: 'Las manos de mi madre', description: 'Una memoria que regresa transformada.' },
  { number: 4, title: 'El jardín sumergido', description: 'Un lugar que solo existe en el sueño.' },
  { number: 5, title: 'Voces sin rostro', description: 'Conversaciones con quienes ya no están.' },
  { number: 6, title: 'La casa vacía', description: 'El regreso a un lugar que ya no existe.' },
  { number: 7, title: 'Tiempo líquido', description: 'Cuando pasado y presente se confunden.' },
  { number: 8, title: 'El peso del aire', description: 'La memoria del cuerpo.' },
  { number: 9, title: 'Lluvia interior', description: 'Las lágrimas que no se derraman despiertas.' },
  { number: 10, title: 'El espejo negro', description: 'Confrontación con el yo oculto.' },
  { number: 11, title: 'Amanecer diferido', description: 'La promesa de despertar.' },
  { number: 12, title: 'El despertar', description: 'El regreso, transformado.' },
]

export function BookDetails() {
  return (
    <section className="py-24 lg:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Synopsis */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-24"
        >
          <span className="text-sm uppercase tracking-[0.2em] text-accent mb-4 block">
            Sinopsis
          </span>
          <div className="prose-literary">
            <p className="text-lg text-muted-foreground leading-relaxed">
              En una ciudad sin nombre, un hombre comienza a soñar recuerdos que 
              no le pertenecen. Cada noche, al cerrar los ojos, se encuentra en 
              lugares que nunca visitó, conversando con personas que jamás conoció, 
              sintiendo emociones de vidas ajenas.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              A medida que los sueños se intensifican, la frontera entre su vida 
              y esas memorias prestadas comienza a disolverse. ¿Es él quien sueña, 
              o es el sueño de alguien más?
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              <em>El Libro de los Sueños</em> es una meditación sobre la identidad, 
              la memoria y la naturaleza porosa de la realidad. Una novela para 
              quienes alguna vez despertaron preguntándose si el sueño no era, 
              acaso, la verdadera vida.
            </p>
          </div>
        </motion.div>

        {/* Chapter list */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl text-primary text-center mb-12">
            Los Capítulos
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group p-6 bg-card/50 border border-border hover:border-accent/30 rounded-lg transition-colors"
              >
                <span className="text-xs text-accent font-mono">
                  {String(chapter.number).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-lg text-primary mt-2 mb-2 group-hover:text-accent transition-colors">
                  {chapter.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {chapter.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
