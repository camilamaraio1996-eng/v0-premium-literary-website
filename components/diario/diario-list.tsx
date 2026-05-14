'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

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
        <div className="space-y-12 sm:space-y-16">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Link href={`/diario/${post.slug}`} className="block group">
                <div className="flex flex-col gap-4">
                  {/* Date and reading time */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <time dateTime={post.created_at} className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(post.created_at), "d 'de' MMMM", { locale: es })}
                    </time>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.reading_time} min
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl lg:text-3xl text-primary group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>

                  {/* Image if present */}
                  {post.image_url && (
                    <div className="relative overflow-hidden rounded-sm bg-muted/20 aspect-video">
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Read more link */}
                  <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-accent group-hover:text-primary transition-colors w-fit">
                    <span>Leer más</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
