'use client'

import { motion } from 'framer-motion'

interface BookDetailsProps {
  description?: string
}

export function BookDetails({ description }: BookDetailsProps) {
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
            {description ? (
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            ) : (
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                Las historias de este libro exploran el ruido mental, los sueños, los vínculos, entre otras temáticas. 
A través de relatos autobiograficos, la autora busca contar una visión del mundo que se va modificando con los años. Habla de la búsqueda de una identidad a través de los diálogos internos.
Vacila entre un tono humorístico y sombrío, detallando diversas situaciones de la vida cotidiana. 
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
