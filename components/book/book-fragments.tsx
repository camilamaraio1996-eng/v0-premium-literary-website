'use client'

import { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import DOMPurify from 'isomorphic-dompurify'
import type { BookFragment } from '@/types/book'

interface BookFragmentsProps {
  fragments: BookFragment[]
}

// Memoized fragment item to prevent unnecessary re-renders
const FragmentItem = memo(function FragmentItem({
  fragment,
  index,
  isOpen,
  onToggle,
}: {
  fragment: BookFragment
  index: number
  isOpen: boolean
  onToggle: (id: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <button
        onClick={() => onToggle(fragment.id)}
        className="w-full flex items-center justify-between py-6 text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-5">
          <span className="text-xs text-muted-foreground tabular-nums w-5 shrink-0">
            {String(fragment.chapter_number ?? index + 1).padStart(2, '0')}
          </span>
          <span className={cn(
            'font-serif text-base text-primary transition-colors',
            isOpen ? 'text-accent' : 'group-hover:text-accent'
          )}>
            {fragment.title}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div
              className="pb-8 pl-10 prose-blog text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(fragment.content, {
                  ALLOWED_TAGS: ['p', 'strong', 'em', 'br', 'a'],
                  ALLOWED_ATTR: ['href', 'target', 'rel'],
                }),
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

export const BookFragments = memo(function BookFragments({ fragments }: BookFragmentsProps) {
  const [openId, setOpenId] = useState<string | null>(
    fragments.length > 0 ? fragments[0].id : null
  )

  if (fragments.length === 0) {
    return (
      <section className="py-24 lg:py-32 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <BookOpen className="w-10 h-10 text-accent/50 mx-auto mb-6" />
          <p className="text-muted-foreground text-sm uppercase tracking-widest">
            Fragmentos próximamente
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 lg:py-32 bg-secondary/20" id="fragmentos">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#958568] block mb-3">
            Un libro de relatos
          </span>
          <span className="text-xs uppercase tracking-[0.25em] text-[#958568] block">
            Frangmentos
          </span>
        </motion.div>

        {/* Accordion fragments */}
        <div className="divide-y divide-border">
          {fragments.map((fragment, index) => (
            <FragmentItem
              key={fragment.id}
              fragment={fragment}
              index={index}
              isOpen={openId === fragment.id}
              onToggle={(id) => setOpenId(openId === id ? null : id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
})
