'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  image_url: string | null
  category: string
  reading_time: number
  created_at: string
}

const CATEGORIES = ['Todos', 'Reflexion', 'Proceso', 'Fragmentos', 'Fotos']

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function categoryLabel(cat: string) {
  const map: Record<string, string> = {
    reflexion: 'Reflexión',
    proceso: 'Proceso',
    fragmentos: 'Fragmentos',
    fotos: 'Fotos',
  }
  return map[cat?.toLowerCase()] ?? cat
}

export function DiarioList({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState('Todos')

  const filtered =
    active === 'Todos'
      ? posts
      : posts.filter((p) => p.category?.toLowerCase() === active.toLowerCase())

  const [featured, ...rest] = filtered

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-xs uppercase tracking-[0.18em] px-4 py-2 border transition-colors duration-200 ${
                active === cat
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-accent hover:text-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground text-sm uppercase tracking-widest">
            No hay entradas en esta categoría todavía.
          </div>
        )}

        {/* Featured post — large card */}
        {featured && (
          <motion.article
            key={featured.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <Link href={`/diario/${featured.slug}`} className="group block">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Image */}
                <div className="aspect-[4/3] bg-secondary/40 overflow-hidden relative">
                  {(featured.image_url || featured.cover_image) ? (
                    <Image
                      src={featured.image_url ?? featured.cover_image ?? ''}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/40">
                      <div className="w-12 h-px bg-border" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#958568]">
                      {categoryLabel(featured.category)}
                    </span>
                    <span className="text-border">—</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(featured.created_at)}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl lg:text-3xl text-primary mb-4 group-hover:text-accent transition-colors leading-snug text-balance">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                      {featured.excerpt}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-accent">
                    Leer entrada
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        )}

        {/* Divider */}
        {rest.length > 0 && (
          <div className="border-t border-border mb-14" />
        )}

        {/* Rest — grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post, index) => {
            const photo = post.image_url ?? post.cover_image
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="group"
              >
                <Link href={`/diario/${post.slug}`} className="block">
                  {/* Image */}
                  <div className="aspect-[3/2] bg-secondary/30 overflow-hidden relative mb-5">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
                        <div className="w-8 h-px bg-border" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-3 h-3 text-[#958568]" />
                    <span className="text-xs uppercase tracking-[0.15em] text-[#958568]">
                      {categoryLabel(post.category)}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-primary mb-3 group-hover:text-accent transition-colors leading-snug">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.reading_time} min
                    </span>
                  </div>
                </Link>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
