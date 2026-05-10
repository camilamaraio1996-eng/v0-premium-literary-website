'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'

interface Post {
  title: string
  content: string
  category: string
  reading_time: number
  created_at: string
}

interface PostContentProps {
  post: Post
}

export function PostContent({ post }: PostContentProps) {
  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let currentParagraph: string[] = []
    let inBlockquote = false
    
    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={elements.length} className="mb-6 leading-relaxed">
            {currentParagraph.join(' ')}
          </p>
        )
        currentParagraph = []
      }
    }
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      if (trimmedLine === '') {
        flushParagraph()
        return
      }
      
      if (trimmedLine.startsWith('## ')) {
        flushParagraph()
        elements.push(
          <h2 key={index} className="font-serif text-2xl text-primary mt-12 mb-6">
            {trimmedLine.slice(3)}
          </h2>
        )
        return
      }
      
      if (trimmedLine.startsWith('> ')) {
        flushParagraph()
        if (!inBlockquote) {
          inBlockquote = true
        }
        elements.push(
          <blockquote key={index} className="border-l-2 border-accent pl-6 my-8 italic text-muted-foreground">
            {trimmedLine.slice(2)}
          </blockquote>
        )
        inBlockquote = false
        return
      }
      
      currentParagraph.push(trimmedLine)
    })
    
    flushParagraph()
    return elements
  }
  
  return (
    <article className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Button asChild variant="ghost" size="sm">
            <Link href="/diario" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al diario
            </Link>
          </Button>
        </motion.div>
        
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-sm uppercase tracking-wider text-accent mb-4 block">
            {post.category}
          </span>
          <h1 className="font-serif text-4xl lg:text-5xl text-primary mb-6 leading-tight text-balance">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(post.created_at), "d 'de' MMMM, yyyy", { locale: es })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.reading_time} min de lectura
            </span>
          </div>
        </motion.header>
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose-literary text-foreground/90 text-lg"
        >
          {renderContent(post.content)}
        </motion.div>
        
        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 pt-12 border-t border-border"
        >
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              ¿Te ha gustado esta reflexión?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild>
                <Link href="/preventa">
                  Reservar el Libro
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/diario">
                  Más Entradas
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </article>
  )
}
