'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { ImageLightbox } from '@/components/ui/image-lightbox'

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

// ── Genre Filter Bar ─────────────────────────────────────────────────────────

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

  const all = ['Todos', ...genres]

  return (
    <div className="relative mb-10 lg:mb-12">
      {/* Horizontal scroll container */}
      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        style={{ WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        role="list"
        aria-label="Filtrar por género"
      >
        {all.map((g) => {
          const isActive = active === g
          return (
            <button
              key={g}
              role="listitem"
              onClick={() => onChange(g)}
              aria-pressed={isActive}
              className={[
                'relative flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] tracking-[0.2em] uppercase font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                isActive
                  ? 'bg-primary text-background shadow-sm'
                  : 'bg-transparent text-foreground/50 border border-border/60 hover:border-primary/40 hover:text-primary',
              ].join(' ')}
            >
              {g}
            </button>
          )
        })}
      </div>
      {/* Right fade mask for overflow hint */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-1 w-10 bg-gradient-to-l from-background to-transparent"
        aria-hidden="true"
      />
    </div>
  )
}

// ── Main Grid ────────────────────────────────────────────────────────────────

export function RecommendationsGrid({ recommendations }: { recommendations: Recommendation[] }) {
  const [activeGenre, setActiveGenre] = useState('Todos')

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

  if (recommendations.length === 0) {
    return (
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground tracking-wide">
            No hay recomendaciones publicadas todavía.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="pb-24 lg:pb-32">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">

        {/* Genre filter bar */}
        <GenreFilter
          genres={genres}
          active={activeGenre}
          onChange={(g) => setActiveGenre(g)}
        />

        {/* Empty state for filtered genre */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-foreground/40 tracking-wide leading-relaxed">
              No hay recomendaciones disponibles<br />
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
            <div className="divide-y divide-border/60">
              {filtered.map((rec, i) => (
                <article
                  key={rec.id}
                  className="group py-8 sm:py-10 first:pt-0"
                  style={{
                    animation: 'fadeSlideIn 350ms ease both',
                    animationDelay: `${Math.min(i * 45, 250)}ms`,
                  }}
                >
                  {/* Mobile */}
                  <div className="flex gap-4 mb-4 sm:hidden">
                    <BookCover imageUrl={rec.image_url} title={rec.title} mobile />
                    <div className="flex flex-col justify-start min-w-0 flex-1 pt-1">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#958568]/60 mb-2 font-mono">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-serif text-base text-primary leading-snug mb-1 text-pretty">
                        {rec.title}
                      </h3>
                      {rec.author && (
                        <p className="text-[11px] tracking-wide text-[#958568] font-medium uppercase">
                          {rec.author}
                        </p>
                      )}
                      {rec.genre && (
                        <span className="mt-1.5 inline-block text-[10px] tracking-[0.15em] uppercase bg-secondary/60 text-foreground/50 px-1.5 py-0.5 rounded-sm">
                          {rec.genre}
                        </span>
                      )}
                    </div>
                  </div>
                  {rec.description && (
                    <p className="sm:hidden text-sm text-foreground/65 leading-relaxed text-pretty">
                      {rec.description}
                    </p>
                  )}

                  {/* Desktop */}
                  <div className="hidden sm:flex gap-8">
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
                        <p className="text-sm text-foreground/65 leading-relaxed line-clamp-4 text-pretty">
                          {rec.description}
                        </p>
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
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
