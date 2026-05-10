'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

// This would come from the database in production
const previewPosts = [
  {
    id: '1',
    title: 'Sobre el arte de soñar despierto',
    excerpt: 'Hay quienes dicen que soñar despierto es perder el tiempo. Yo creo que es la forma más honesta de estar vivo.',
    category: 'Reflexión',
    date: '15 Mayo, 2026',
    readingTime: 5,
    slug: 'arte-de-sonar-despierto'
  },
  {
    id: '2',
    title: 'El proceso de escribir sobre los sueños',
    excerpt: 'Cada noche, antes de dormir, dejo un cuaderno junto a la cama. Los sueños más reveladores son los que olvidamos primero.',
    category: 'Proceso Creativo',
    date: '10 Mayo, 2026',
    readingTime: 7,
    slug: 'proceso-escribir-suenos'
  },
  {
    id: '3',
    title: 'La memoria como materia prima',
    excerpt: 'La ficción y la memoria comparten un secreto: ambas reconstruyen lo que alguna vez fue real.',
    category: 'Escritura',
    date: '5 Mayo, 2026',
    readingTime: 4,
    slug: 'memoria-materia-prima'
  }
]

export function BlogPreviewSection() {
  return (
    <section className="py-24 lg:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-sm uppercase tracking-[0.2em] text-accent mb-4 block">
              Diario del Autor
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-primary">
              Reflexiones y Proceso
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
          {previewPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/diario/${post.slug}`} className="block">
                <div className="mb-4">
                  <span className="text-xs uppercase tracking-wider text-accent">
                    {post.category}
                  </span>
                </div>
                
                <h3 className="font-serif text-xl text-primary mb-3 group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readingTime} min
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
