'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Recommendation {
  id: string
  title: string
  author: string | null
  description: string | null
  image_url: string | null
  genre: string | null
}

// ── Book Cover ───────────────────────────────────────────────────────────────

function BookCover({ imageUrl, title, mobile }: { imageUrl: string | null; title: string; mobile?: boolean }) {
  const sizeClass = mobile ? 'w-20 aspect-[3/4]' : 'w-28 md:w-32 aspect-[3/4]'
  const sizes = mobile ? '80px' : '(max-width: 768px) 112px, 128px'

  const bookCoverContent = (
    <div className={`relative flex-shrink-0 ${sizeClass} rounded-sm overflow-hidden bg-secondary/40 shadow-[0_2px_8px_rgba(0,0,0,0.07)]`}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`Portada de ${title}`}
          fill
          sizes={sizes}
          className="object-cover"
          loading="lazy"
          quality={60}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary/60">
          <BookOpen className="w-6 h-6 text-primary/30" strokeWidth={1} />
        </div>
      )}
    </div>
  )

  if (!imageUrl) {
    return bookCoverContent
  }

  return (
    <ImageLightbox imageUrl={imageUrl} alt={`Portada de ${title}`}>
      {bookCoverContent}
    </ImageLightbox>
  )
}

// ── Genre Dropdown Filter ───────────────────────────────────────────────────

function GenreFilter({
  genres,
  active,
  onChange,
}: {
  genres: string[]
  active: string
  onChange: (g: string) => void
}) {
  if (genres.length === 0) return null

  const options = ['Todos', ...genres]

  return (
    <div className="mb-10 lg:mb-12 flex flex-col justify-center lg:justify-start">
      {/* Genre Label */}
      <label className="mb-3 text-xs tracking-[0.15em] uppercase font-medium text-foreground/60">
        Género
      </label>
      
      {/* Genre Selector */}
      <div className="w-full sm:w-auto lg:w-full">
        <Select value={active} onValueChange={onChange}>
          <SelectTrigger className="w-full sm:w-64 lg:max-w-sm justify-between px-5 py-2.5 rounded-md border border-border/60 bg-transparent text-sm font-medium tracking-wide text-foreground/80 hover:border-primary/40 hover:text-primary data-[state=open]:border-primary/60 data-[state=open]:text-primary transition-colors duration-200">
            <SelectValue placeholder="Todos los géneros" />
          </SelectTrigger>
          <SelectContent align="start" className="min-w-[240px] rounded-md border border-border/60 bg-background shadow-md">
            {options.map((option) => (
              <SelectItem
                key={option}
                value={option}
                className="cursor-pointer text-sm font-medium tracking-wide uppercase text-foreground/70 hover:text-primary hover:bg-secondary/40 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary focus-visible:bg-secondary/40 focus-visible:text-primary transition-colors duration-150"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// ── Main Grid ────────────────────────────────────────────────────────────────

export function RecommendationsGrid({ recommendations }: { recommendations: Recommendation[] }) {
  const [activeGenre, setActiveGenre] = useState('Todos')
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({})

  // Derive unique genres from data — order by first appearance
  const genres = useMemo(() => {
    const seen = new Set<string>()
    const result: string[] = []
    for (const rec of recommendations) {
      if (rec.genre && !seen.has(rec.genre)) {
        seen.add(rec.genre)
        result.push(rec.genre)
      }
    }
    return result
  }, [recommendations])

  // Filter list
  const filtered = useMemo(
    () =>
      activeGenre === 'Todos'
        ? recommendations
        : recommendations.filter((r) => r.genre === activeGenre),
    [recommendations, activeGenre]
  )

  const toggleBook = (id: string) => {
    setExpandedBooks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (recommendations.length === 0) {
    return (
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground tracking-wide">
            No hay libros en la biblioteca todavía.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-6 sm:pt-0 pb-24 lg:pb-32">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">

        {/* Genre filter dropdown */}
        <GenreFilter
          genres={genres}
          active={activeGenre}
          onChange={(g) => setActiveGenre(g)}
        />

        {/* Empty state for filtered genre */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-foreground/40 tracking-wide leading-relaxed">
              No hay libros en la BIBLIOTECA disponibles<br />
              para este género todavía.
            </p>
            <button
              onClick={() => setActiveGenre('Todos')}
              className="mt-6 text-[11px] tracking-[0.2em] uppercase text-primary/70 hover:text-primary transition-colors duration-150 underline underline-offset-4"
            >
              Ver todas
            </button>
          </div>
        ) : (
          <>
            {/* Mobile: Grid of 2 columns */}
            <div className="grid grid-cols-2 gap-4 sm:hidden mb-12">
              {filtered.map((rec, i) => (
                <article
                  key={rec.id}
                  className="group"
                  style={{
                    animation: 'fadeSlideIn 350ms ease both',
                    animationDelay: `${Math.min(i * 45, 250)}ms`,
                  }}
                >
                  <div className="flex flex-col h-full">
                    {/* Book Cover */}
                    <div className="mb-2">
                      <BookCover imageUrl={rec.image_url} title={rec.title} mobile />
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col justify-start flex-1 min-w-0">
                      {/* Number */}
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#958568]/60 mb-1 font-mono">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      
                      {/* Title */}
                      <h3 className="font-serif text-sm text-primary leading-snug mb-0.5 text-pretty line-clamp-2">
                        {rec.title}
                      </h3>
                      
                      {/* Author */}
                      {rec.author && (
                        <p className="text-[10px] tracking-wide text-[#958568] font-medium uppercase line-clamp-1">
                          {rec.author}
                        </p>
                      )}
                      
                      {/* Genre */}
                      {rec.genre && (
                        <span className="mt-1 inline-block text-[9px] tracking-[0.15em] uppercase bg-secondary/60 text-foreground/50 px-1 py-0.5 rounded-sm w-fit">
                          {rec.genre}
                        </span>
                      )}
                      
                      {/* Description with expand/collapse */}
                      {rec.description && (
                        <div className="mt-1">
                          <p className={`text-[11px] text-foreground/60 leading-tight ${
                            expandedBooks[rec.id] ? 'book-description-expanded' : 'book-description-collapsed'
                          }`}>
                            {rec.description}
                          </p>
                          <button
                            onClick={() => toggleBook(rec.id)}
                            className="mt-1.5 text-[10px] tracking-[0.08em] uppercase font-medium text-primary/70 hover:text-primary transition-colors duration-150 hover:underline"
                          >
                            {expandedBooks[rec.id] ? 'Ver menos' : 'Ver más'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop: Vertical list */}
            <div className="hidden sm:block divide-y divide-border/60">
              {filtered.map((rec, i) => (
                <article
                  key={rec.id}
                  className="group py-8 sm:py-10 first:pt-0"
                  style={{
                    animation: 'fadeSlideIn 350ms ease both',
                    animationDelay: `${Math.min(i * 45, 250)}ms`,
                  }}
                >
                  {/* Desktop layout */}
                  <div className="flex gap-8">
                    <BookCover imageUrl={rec.image_url} title={rec.title} />
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#958568]/60 mb-2 font-mono">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-serif text-xl text-primary leading-snug mb-1 text-pretty">
                        {rec.title}
                      </h3>
                      {rec.author && (
                        <p className="text-xs tracking-wide text-[#958568] font-medium uppercase">
                          {rec.author}
                        </p>
                      )}
                      {rec.genre && (
                        <span className="mt-1.5 mb-3 inline-block text-[10px] tracking-[0.15em] uppercase bg-secondary/60 text-foreground/50 px-1.5 py-0.5 rounded-sm">
                          {rec.genre}
                        </span>
                      )}
                      {!rec.genre && rec.author && <div className="mb-3" />}
                      {rec.description && (
                        <div>
                          <p className={`text-sm text-foreground/65 leading-relaxed text-pretty ${
                            expandedBooks[rec.id] ? 'book-description-expanded' : 'book-description-collapsed-desktop'
                          }`}>
                            {rec.description}
                          </p>
                          <button
                            onClick={() => toggleBook(rec.id)}
                            className="mt-2 text-[10px] tracking-[0.08em] uppercase font-medium text-primary/70 hover:text-primary transition-colors duration-150 hover:underline"
                          >
                            {expandedBooks[rec.id] ? 'Ver menos' : 'Ver más'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border/40">
              <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground/50 text-center">
                {filtered.length}{' '}
                {filtered.length === 1 ? 'título seleccionado' : 'títulos seleccionados'}
                {activeGenre !== 'Todos' && (
                  <> &mdash; {activeGenre}</>
                )}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Keyframe for card entry animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
