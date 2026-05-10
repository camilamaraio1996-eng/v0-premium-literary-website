'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, PenLine } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string
  reading_time: number
  created_at: string
  featured: boolean
}

// Sample posts for when database is empty
const samplePosts: Post[] = [
  {
    id: '1',
    title: 'Sobre el arte de soñar despierto',
    slug: 'arte-de-sonar-despierto',
    excerpt: 'Hay quienes dicen que soñar despierto es perder el tiempo. Yo creo que es la forma más honesta de estar vivo. Los sueños diurnos son bocetos de la imaginación, ensayos generales de mundos posibles.',
    category: 'Reflexión',
    reading_time: 5,
    created_at: '2026-05-15T10:00:00Z',
    featured: true
  },
  {
    id: '2',
    title: 'El proceso de escribir sobre los sueños',
    slug: 'proceso-escribir-suenos',
    excerpt: 'Cada noche, antes de dormir, dejo un cuaderno junto a la cama. Los sueños más reveladores son los que olvidamos primero, los que se desvanecen con las primeras luces del día.',
    category: 'Proceso Creativo',
    reading_time: 7,
    created_at: '2026-05-10T10:00:00Z',
    featured: false
  },
  {
    id: '3',
    title: 'La memoria como materia prima',
    slug: 'memoria-materia-prima',
    excerpt: 'La ficción y la memoria comparten un secreto: ambas reconstruyen lo que alguna vez fue real. Cada vez que recordamos, inventamos; cada vez que inventamos, recordamos.',
    category: 'Escritura',
    reading_time: 4,
    created_at: '2026-05-05T10:00:00Z',
    featured: false
  },
  {
    id: '4',
    title: 'Conversaciones con personajes',
    slug: 'conversaciones-personajes',
    excerpt: 'Los personajes de una novela no se crean: se descubren. Aparecen en los momentos más inesperados, a veces en sueños, a veces en el silencio de una tarde cualquiera.',
    category: 'Proceso Creativo',
    reading_time: 6,
    created_at: '2026-05-01T10:00:00Z',
    featured: false
  }
]

interface DiarioListProps {
  posts: Post[]
}

export function DiarioList({ posts }: DiarioListProps) {
  const displayPosts = posts.length > 0 ? posts : samplePosts
  const featuredPost = displayPosts.find(p => p.featured) || displayPosts[0]
  const otherPosts = displayPosts.filter(p => p.id !== featuredPost?.id)

  if (displayPosts.length === 0) {
    return (
      <section className="py-12 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <PenLine className="w-16 h-16 text-muted-foreground/50 mx-auto mb-6" />
          <h2 className="font-serif text-2xl text-primary mb-4">
            Próximamente
          </h2>
          <p className="text-muted-foreground">
            Las entradas del diario estarán disponibles pronto.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 lg:py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Featured Post */}
        {featuredPost && (
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Link href={`/diario/${featuredPost.slug}`} className="group block">
              <div className="p-8 lg:p-12 bg-card/50 border border-border hover:border-accent/30 rounded-lg transition-colors">
                <span className="text-xs uppercase tracking-wider text-accent mb-4 block">
                  {featuredPost.category}
                </span>
                <h2 className="font-serif text-3xl lg:text-4xl text-primary mb-4 group-hover:text-accent transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(featuredPost.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.reading_time} min de lectura
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        )}

        {/* Other Posts */}
        <div className="grid md:grid-cols-2 gap-8">
          {otherPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/diario/${post.slug}`} className="block p-6 bg-card/30 border border-border hover:border-accent/30 rounded-lg transition-colors h-full">
                <span className="text-xs uppercase tracking-wider text-accent mb-3 block">
                  {post.category}
                </span>
                <h3 className="font-serif text-xl text-primary mb-3 group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(post.created_at), "d MMM, yyyy", { locale: es })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.reading_time} min
                  </span>
                </div>
                <span className="mt-4 text-sm text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                  Leer más <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
