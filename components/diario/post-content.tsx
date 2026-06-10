'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Post {
  title: string
  content: string
  reading_time: number
  created_at: string
  image_url?: string | null
}

interface PostContentProps {
  post: Post
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function PostContent({ post }: PostContentProps) {
  const photo = post.image_url

  // Content is already HTML from the DB; render directly
  const isHTML = post.content.trim().startsWith('<')

  // Plain-text fallback renderer
  const renderPlainText = (content: string) => {
    const paragraphs = content.split(/\n\n+/)
    return paragraphs.map((para, i) => {
      const trimmed = para.trim()
      if (!trimmed) return null
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={i} className="font-serif text-xl text-primary mt-10 mb-4">
            {trimmed.slice(3)}
          </h2>
        )
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={i} className="border-l-2 border-accent pl-6 my-8 italic text-muted-foreground">
            {trimmed.slice(2)}
          </blockquote>
        )
      }
      return (
        <p key={i} className="mb-5 leading-relaxed text-foreground">
          {trimmed}
        </p>
      )
    })
  }

  return (
    <article className="py-16 lg:py-24">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary -ml-3">
            <Link href="/diario">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al diario
            </Link>
          </Button>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="font-serif text-3xl lg:text-4xl text-primary mb-6 leading-snug text-balance">
            {post.title}
          </h1>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.reading_time} min de lectura
            </span>
          </div>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[15px] leading-relaxed"
        >
          {isHTML ? (
            <div
              className="prose-blog"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="prose-blog">{renderPlainText(post.content)}</div>
          )}
        </motion.div>

        {/* Featured image - at the end (single image, if exists) */}
        {photo && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 w-full rounded-lg overflow-hidden bg-muted/10"
          >
            <div className="relative w-full" style={{ aspectRatio: 'auto' }}>
              <Image 
                src={photo} 
                alt={post.title} 
                width={800}
                height={600}
                className="w-full h-auto object-contain"
                quality={85}
              />
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 lg:mt-20 pt-10 border-t border-border text-center"
        >
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-[0.12em] text-xs">
            <Link href="/diario">Ver más entradas</Link>
          </Button>
        </motion.div>
      </div>
    </article>
  )
}
