'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'

interface Recommendation {
  id: string
  title: string
  author: string | null
  description: string | null
  image_url: string | null
  sort_order: number
}

function BookCover({ imageUrl, title }: { imageUrl: string | null; title: string }) {
  return (
    <div className="relative flex-shrink-0 w-24 sm:w-28 md:w-32 aspect-[3/4] rounded-sm overflow-hidden bg-secondary/40 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`Portada de ${title}`}
          fill
          sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
          className="object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary/60">
          <BookOpen className="w-6 h-6 text-primary/30" strokeWidth={1} />
        </div>
      )}
    </div>
  )
}

export function RecommendationsGrid({
  recommendations,
}: {
  recommendations: Recommendation[]
}) {
  if (recommendations.length === 0) {
    return (
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground tracking-wide">
            No hay recomendaciones publicadas todavía.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="pb-24 lg:pb-32">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="divide-y divide-border/60">
          {recommendations.map((rec, i) => (
            <motion.article
              key={rec.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true, margin: '-40px' }}
              className="group flex gap-6 sm:gap-8 py-10 first:pt-0"
            >
              {/* Book Cover */}
              <BookCover imageUrl={rec.image_url} title={rec.title} />

              {/* Text Content */}
              <div className="flex flex-col justify-center min-w-0 flex-1">
                {/* Index number */}
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#958568]/60 mb-2 font-mono">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Title */}
                <h3 className="font-serif text-lg sm:text-xl text-primary leading-snug mb-1 text-pretty">
                  {rec.title}
                </h3>

                {/* Author */}
                {rec.author && (
                  <p className="text-xs sm:text-sm tracking-wide text-[#958568] mb-3 font-medium uppercase">
                    {rec.author}
                  </p>
                )}

                {/* Description */}
                {rec.description && (
                  <p className="text-sm text-foreground/65 leading-relaxed line-clamp-3 text-pretty">
                    {rec.description}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground/50 text-center">
            {recommendations.length} {recommendations.length === 1 ? 'título seleccionado' : 'títulos seleccionados'}
          </p>
        </div>
      </div>
    </section>
  )
}
