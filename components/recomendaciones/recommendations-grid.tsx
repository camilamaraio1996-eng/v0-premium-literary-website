'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface Recommendation {
  id: string
  title: string
  author: string
  description: string
  image_url: string | null
  sort_order: number
}

export function RecommendationsGrid({
  recommendations,
}: {
  recommendations: Recommendation[]
}) {
  if (recommendations.length === 0) {
    return (
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center py-12 bg-card/50 rounded-lg border border-border">
            <p className="text-muted-foreground">No hay recomendaciones publicadas todavía.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative mb-6 overflow-hidden rounded-lg bg-muted/20 aspect-[2/3]">
                {rec.image_url ? (
                  <Image
                    src={rec.image_url}
                    alt={rec.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-muted-foreground text-sm">Sin portada</div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-serif text-xl text-primary mb-2 line-clamp-2">
                  {rec.title}
                </h3>
                <p className="text-sm text-[#958568] mb-3 font-medium">
                  {rec.author}
                </p>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {rec.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
