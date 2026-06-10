'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Post {
  title: string
  content: string
  reading_time: number
  created_at: string
  image_url?: string | null
  images?: string[] | null
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

// Positions (paragraph index after which) each image appears
const IMAGE_POSITIONS = [0, 2, 4]

export function PostContent({ post }: PostContentProps) {
  // Prefer new `images` column, fall back to legacy `image_url`
  const allImages =
    post.images && post.images.length > 0
      ? post.images
      : post.image_url
      ? [post.image_url]
      : []

  // Content is already HTML from the DB; render directly
  const isHTML = post.content.trim().startsWith('<')

  // Plain-text renderer with images intercalated between paragraphs
  const renderPlainText = (content: string) => {
    const paragraphs = content.split(/\n\n+/)
    const result: React.ReactNode[] = []

    paragraphs.forEach((para, i) => {
      const trimmed = para.trim()
      if (!trimmed) return

      if (trimmed.startsWith('## ')) {
        result.push(
          <h2 key={`h-${i}`} className="font-serif text-xl text-primary mt-10 mb-4">
            {trimmed.slice(3)}
          </h2>
        )
      } else if (trimmed.startsWith('> ')) {
        result.push(
          <blockquote key={`bq-${i}`} className="border-l-2 border-accent pl-6 my-8 italic text-muted-foreground">
            {trimmed.slice(2)}
          </blockquote>
        )
      } else {
        result.push(
          <p key={`p-${i}`} className="mb-5 leading-relaxed text-foreground">
            {trimmed}
          </p>
        )
      }

      // Insert image after the configured paragraph positions
      const imgIndex = IMAGE_POSITIONS.indexOf(i)
      if (imgIndex !== -1 && allImages[imgIndex]) {
        result.push(
          <img
            key={`img-${imgIndex}`}
            src={allImages[imgIndex]}
            alt={`${post.title} - imagen ${imgIndex + 1}`}
            className={`blog-inline-image${imgIndex % 2 === 1 ? ' blog-inline-image--left' : ''}`}
          />
        )
      }
    })

    return result
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
            <>
              {/* HTML content - images injected via float CSS inside prose-blog */}
              <div
                className="prose-blog"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              {/* Show any images not already in the HTML below the content */}
              {allImages.length > 0 && (
                <div className="mt-10 clearfix">
                  {allImages.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`${post.title} - imagen ${idx + 1}`}
                      className={`blog-inline-image${idx % 2 === 1 ? ' blog-inline-image--left' : ''}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="prose-blog clearfix">{renderPlainText(post.content)}</div>
          )}
        </motion.div>

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
