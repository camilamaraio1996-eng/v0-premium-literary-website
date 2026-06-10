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

/** Returns the paragraph indices where each image should be inserted,
 *  distributed proportionally across the text. */
function getImagePositions(paragraphCount: number, imageCount: number): number[] {
  if (imageCount === 0) return []
  if (imageCount === 1) return [1]
  if (imageCount === 2) return [1, Math.floor(paragraphCount / 2)]
  // 3 images
  return [1, Math.floor(paragraphCount / 2), paragraphCount - 2]
}

export function PostContent({ post }: PostContentProps) {
  // Prefer new `images` column, fall back to legacy `image_url`
  const allImages =
    post.images && post.images.length > 0
      ? post.images
      : post.image_url
      ? [post.image_url]
      : []

  const isHTML = post.content.trim().startsWith('<')

  // Split HTML into paragraph-level chunks so we can intercalate images
  const splitHTMLIntoParagraphs = (html: string): string[] => {
    // Split on </p>, </h2>, </h3>, </blockquote> closing tags, keeping the tag
    const chunks = html.split(/(?<=<\/(?:p|h2|h3|blockquote|li|ul|ol)>)/i).filter(Boolean)
    return chunks
  }

  const renderContent = () => {
    if (isHTML) {
      const chunks = splitHTMLIntoParagraphs(post.content)
      const positions = getImagePositions(chunks.length, allImages.length)

      const elements: React.ReactNode[] = []

      chunks.forEach((chunk, i) => {
        elements.push(
          <span key={`chunk-${i}`} dangerouslySetInnerHTML={{ __html: chunk }} />
        )

        const imgIdx = positions.indexOf(i)
        if (imgIdx !== -1 && allImages[imgIdx]) {
          elements.push(
            <img
              key={`img-${imgIdx}`}
              src={allImages[imgIdx]}
              alt={`${post.title} - imagen ${imgIdx + 1}`}
              className={`blog-inline-image${imgIdx % 2 === 0 ? '' : ' blog-inline-image--left'}`}
            />
          )
        }
      })

      return (
        <div className="blog-post-content prose-blog">
          {elements}
        </div>
      )
    }

    // Plain-text renderer
    const paragraphs = post.content.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
    const positions = getImagePositions(paragraphs.length, allImages.length)
    const elements: React.ReactNode[] = []

    paragraphs.forEach((para, i) => {
      const imgIdx = positions.indexOf(i)

      if (para.startsWith('## ')) {
        elements.push(
          <h2 key={`h-${i}`} className="font-serif text-xl text-primary mt-10 mb-4">
            {para.slice(3)}
          </h2>
        )
      } else if (para.startsWith('> ')) {
        elements.push(
          <blockquote key={`bq-${i}`} className="border-l-2 border-accent pl-6 my-8 italic text-muted-foreground">
            {para.slice(2)}
          </blockquote>
        )
      } else {
        elements.push(
          <p key={`p-${i}`} className="mb-5 text-justify leading-[1.85] text-foreground">
            {para}
          </p>
        )
      }

      if (imgIdx !== -1 && allImages[imgIdx]) {
        elements.push(
          <img
            key={`img-${imgIdx}`}
            src={allImages[imgIdx]}
            alt={`${post.title} - imagen ${imgIdx + 1}`}
            className={`blog-inline-image${imgIdx % 2 === 0 ? '' : ' blog-inline-image--left'}`}
          />
        )
      }
    })

    return (
      <div className="blog-post-content">
        {elements}
      </div>
    )
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

        {/* Content with intercalated images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[15px]"
        >
          {renderContent()}
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

