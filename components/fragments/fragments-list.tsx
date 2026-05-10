'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface Fragment {
  id: string
  title: string
  chapter_number: number | null
  content: string
  audio_url: string | null
}

// Sample fragments for display when database is empty
const sampleFragments: Fragment[] = [
  {
    id: '1',
    title: 'El umbral',
    chapter_number: 1,
    content: `Hay un momento, justo antes de que el sueño se apodere de nosotros, en el que todavía somos conscientes de estar cayendo. Es un instante suspendido, una frontera líquida donde el pensamiento se vuelve imagen y las imágenes empiezan a tener peso.

Esa noche, en ese preciso umbral, lo vi por primera vez. No era un rostro conocido, pero había en él algo familiar, como un recuerdo que no logras ubicar, como una canción cuya letra olvidaste pero cuya melodía te persigue.

"Llevas tiempo esperando", dijo sin mover los labios.

Y yo supe, con la certeza que solo otorgan los sueños, que tenía razón. Que toda mi vida había sido una espera de ese momento exacto.`,
    audio_url: null
  },
  {
    id: '2',
    title: 'Las manos de mi madre',
    chapter_number: 3,
    content: `En el sueño, mi madre volvía a tener las manos jóvenes. Las reconocí por el modo en que sostenían las cosas: con esa delicadeza que solo conocen quienes han aprendido que todo, absolutamente todo, puede romperse.

Estaba pelando una manzana en espiral, dejando que la cáscara cayera en una sola tira continua, roja como la sangre reciente. Yo la observaba desde algún lugar que no era exactamente la infancia, pero que la contenía.

"Los sueños no mienten", me dijo sin levantar la vista de su labor. "Solo dicen la verdad de maneras que no siempre entendemos."

La cáscara tocó el suelo y se convirtió en una serpiente que se alejó reptando hacia la oscuridad. Mi madre siguió pelando, aunque ya no quedaba manzana que pelar.`,
    audio_url: null
  },
  {
    id: '3',
    title: 'El jardín sumergido',
    chapter_number: 4,
    content: `El jardín estaba bajo el agua, pero de alguna manera yo podía respirar. Las flores se mecían con una corriente que no existía, y los árboles tenían las raíces hacia el cielo, hundiéndose en un suelo de nubes.

Caminé entre los rosales sumergidos, sintiendo cómo los pétalos me rozaban la piel con la suavidad de secretos que nadie quiere contar. Cada paso levantaba pequeñas nubes de arena que eran, al mirarlas de cerca, fragmentos de cartas nunca enviadas.

En el centro del jardín había una mesa puesta para dos. Las tazas de té flotaban ligeramente sobre sus platillos, el vapor ascendiendo en espirales hacia algún lugar que no alcanzaba a ver.

Alguien me esperaba. Siempre alguien me esperaba en estos sueños.`,
    audio_url: null
  }
]

interface FragmentsListProps {
  fragments: Fragment[]
}

export function FragmentsList({ fragments }: FragmentsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const displayFragments = fragments.length > 0 ? fragments : sampleFragments

  const toggleFragment = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section className="py-12 lg:py-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {displayFragments.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-6" />
            <h2 className="font-serif text-2xl text-primary mb-4">
              Próximamente
            </h2>
            <p className="text-muted-foreground mb-8">
              Los fragmentos del libro estarán disponibles pronto.
            </p>
            <Button asChild variant="outline">
              <Link href="/preventa">
                Reservar para Acceso Anticipado
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {displayFragments.map((fragment, index) => (
              <motion.article
                key={fragment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-border rounded-lg overflow-hidden bg-card/50"
              >
                <button
                  onClick={() => toggleFragment(fragment.id)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-card/80 transition-colors"
                >
                  <div>
                    {fragment.chapter_number && (
                      <span className="text-xs font-mono text-accent mb-1 block">
                        Capítulo {String(fragment.chapter_number).padStart(2, '0')}
                      </span>
                    )}
                    <h2 className="font-serif text-xl text-primary">
                      {fragment.title}
                    </h2>
                  </div>
                  {expandedId === fragment.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedId === fragment.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-border">
                        <div className="prose-literary text-foreground/90 whitespace-pre-line leading-relaxed">
                          {fragment.content}
                        </div>
                        
                        {fragment.audio_url && (
                          <div className="mt-6 pt-4 border-t border-border">
                            <span className="text-sm text-muted-foreground mb-2 block">
                              Escuchar fragmento
                            </span>
                            <audio controls className="w-full">
                              <source src={fragment.audio_url} type="audio/mpeg" />
                            </audio>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            ))}
          </div>
        )}
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center p-8 bg-secondary/30 rounded-lg border border-border"
        >
          <h3 className="font-serif text-2xl text-primary mb-4">
            ¿Te gustó lo que leíste?
          </h3>
          <p className="text-muted-foreground mb-6">
            Reserva tu copia y accede a más fragmentos exclusivos antes del lanzamiento.
          </p>
          <Button asChild>
            <Link href="/preventa">
              Reservar Ahora
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
