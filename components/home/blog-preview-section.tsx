'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface BlogPost {
  id: string
  title: string
  slug: string
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

interface BlogPreviewSectionProps {
  posts: BlogPost[]
}

export function BlogPreviewSection({ posts }: BlogPreviewSectionProps) {
  if (posts.length === 0) return null

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#958568] mb-4 block">
              Diario
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-primary">
              Ultimas Entradas
            </h2>
          </div>
          <Button asChild variant="ghost" className="mt-4 md:mt-0 group">
            <Link href="/diario">
              Ver todo el diario
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/diario/${post.slug}`} className="block">
                {/* Cover image */}
                {post.image_url && (
                  <div className="relative mb-5 overflow-hidden aspect-video bg-muted/20">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="mb-3">
                  <span className="text-xs uppercase tracking-[0.15em] text-[#958568]">
                    {categoryLabel(post.category)}
                  </span>
                </div>

                <h3 className="font-serif text-xl text-primary mb-3 group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(post.created_at), "d MMM yyyy", { locale: es })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.reading_time} min
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
