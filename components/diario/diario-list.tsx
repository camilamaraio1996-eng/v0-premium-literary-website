'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Tag } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  image_url: string | null
  category: string
  reading_time: number
  created_at: string
}

const categoryLabel = (cat: string) => {
  const labels: Record<string, string> = {
    reflexion: 'Reflexión',
    proceso: 'Proceso',
    fragmentos: 'Fragmentos',
    fotos: 'Fotos',
  }
  return labels[cat] || cat
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
        <div className="space-y-16">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Timeline line */}
              {i < posts.length - 1 && (
                <div className="absolute -bottom-8 left-4 w-0.5 h-8 bg-border" />
              )}

              {/* Timeline dot */}
              <div className="absolute -left-0.5 top-2 w-9 h-9 rounded-full bg-background border-2 border-accent flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent" />
              </div>

              {/* Post content */}
              <div className="ml-12">
                {/* Meta info - Date and time */}
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.created_at}>
                      {format(new Date(post.created_at), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { 
                        locale: es 
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-[#958568]" />
                    <span className="text-xs uppercase tracking-[0.15em] text-[#958568]">
                      {categoryLabel(post.category)}
                    </span>
                  </div>
                </div>

                {/* Link to full post */}
                <Link href={`/diario/${post.slug}`} className="block group">
                  <h3 className="font-serif text-2xl lg:text-3xl text-primary mb-4 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>

                  {/* Image if present */}
                  {post.image_url && (
                    <div className="relative mb-4 overflow-hidden rounded-lg bg-muted/20 aspect-video">
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-foreground/70 leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Read more */}
                  <div className="inline-block">
                    <span className="text-sm uppercase tracking-[0.15em] text-accent group-hover:text-primary transition-colors">
                      Leer más →
                    </span>
                  </div>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
