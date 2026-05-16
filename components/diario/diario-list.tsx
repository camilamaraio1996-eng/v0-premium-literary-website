'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { extractTextPreview } from '@/lib/content-utils'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  image_url: string | null
  reading_time: number
  created_at: string
}

export function DiarioList({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center py-12 bg-card/50 rounded-lg border border-border">
            <p className="text-muted-foreground">No hay entradas todavía. Regresa pronto.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="space-y-16 sm:space-y-20">
          {posts.map((post, i) => {
            const preview = extractTextPreview(post.content, 220)
            
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: '-100px' }}
                className="relative group"
              >
                <Link href={`/diario/${post.slug}`} className="block">
                  <div className="flex flex-col gap-4 sm:gap-5">
                    {/* Date and reading time */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
                      <time dateTime={post.created_at} className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        {format(new Date(post.created_at), "d 'de' MMMM", { locale: es })}
                      </time>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        {post.reading_time} min
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-3xl text-primary group-hover:text-accent transition-colors duration-300">
                      {post.title}
                    </h3>

                    {/* Content preview - elegant and editorial */}
                    <p className="text-sm sm:text-base leading-relaxed text-foreground/70 max-w-2xl line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">
                      {preview}
                    </p>

                    {/* Read more link - premium styling */}
                    <div className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.15em] text-accent group-hover:text-primary transition-all duration-300 w-fit">
                      <span className="relative">
                        Leer más
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:bg-primary transition-all duration-300 group-hover:w-full" />
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>

                {/* Subtle divider */}
                {posts.indexOf(post) < posts.length - 1 && (
                  <div className="mt-16 sm:mt-20 pt-16 sm:pt-20 border-t border-border/50" />
                )}
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
