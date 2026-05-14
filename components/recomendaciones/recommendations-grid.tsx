import Image from 'next/image'
import { BookOpen } from 'lucide-react'

interface Recommendation {
  id: string
  title: string
  author: string | null
  description: string | null
  image_url: string | null
  genre: string | null
}

function BookCover({ imageUrl, title, mobile }: { imageUrl: string | null; title: string; mobile?: boolean }) {
  const sizeClass = mobile
    ? 'w-20 aspect-[3/4]'
    : 'w-28 md:w-32 aspect-[3/4]'
  const sizes = mobile
    ? '80px'
    : '(max-width: 768px) 112px, 128px'

  return (
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
}

export function RecommendationsGrid({
  recommendations,
}: {
  recommendations: Recommendation[]
}) {
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
        <div className="divide-y divide-border/60">
          {recommendations.map((rec, i) => (
            <article
              key={rec.id}
              className="group py-8 sm:py-10 first:pt-0 animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
              style={{ animationDelay: `${Math.min(i * 60, 300)}ms`, animationDuration: '400ms' }}
            >
              {/* Mobile layout: small cover left + meta right, then full description below */}
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
              {/* Mobile: full description below the cover+title row */}
              {rec.description && (
                <p className="sm:hidden text-sm text-foreground/65 leading-relaxed text-pretty">
                  {rec.description}
                </p>
              )}

              {/* Desktop layout: cover left + all text right, side by side */}
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
            {recommendations.length}{' '}
            {recommendations.length === 1 ? 'título seleccionado' : 'títulos seleccionados'}
          </p>
        </div>
      </div>
    </section>
  )
}
