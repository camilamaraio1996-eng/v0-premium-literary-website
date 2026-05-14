export function RecommendationsHero() {
  return (
    <section className="pt-16 pb-12 lg:pt-20 lg:pb-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Eyebrow */}
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#958568]/70 mb-6 block font-mono">
          Comunidad lectora
        </span>

        {/* Title + rule */}
        <div className="flex items-baseline gap-6 mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl text-primary shrink-0">
            Recomendaciones
          </h1>
          <div className="h-px flex-1 bg-border/60" aria-hidden="true" />
        </div>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-foreground/60 leading-relaxed max-w-md">
          Libros que mejoraron mis días — una selección personal de lecturas que volvería a empezar.
        </p>
      </div>
    </section>
  )
}
