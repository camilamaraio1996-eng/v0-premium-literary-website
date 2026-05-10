'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Fragment {
  id: string
  title: string
  chapter_number: number | null
  content: string
  sort_order: number
}

interface BookFragmentsProps {
  fragments: Fragment[]
}

export function BookFragments({ fragments }: BookFragmentsProps) {
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
    <section className="py-24 lg:py-32 bg-secondary/20">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#958568] block mb-3">
            Primeras Páginas
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl text-primary">
            Fragmentos
          </h2>
          <div className="mt-5 w-10 h-px bg-accent mx-auto" />
        </motion.div>

        {/* Accordion fragments */}
        <div className="divide-y divide-border">
          {fragments.map((fragment, index) => {
            const isOpen = openId === fragment.id
            return (
              <motion.div
                key={fragment.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : fragment.id)}
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
                        dangerouslySetInnerHTML={{ __html: fragment.content }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
