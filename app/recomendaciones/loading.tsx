export default function RecomendacionesLoading() {
  return (
    <main className="pt-20">
      {/* Hero skeleton */}
      <section className="pt-16 pb-12 lg:pt-20 lg:pb-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="h-3 w-24 bg-secondary/60 rounded mb-6 animate-pulse" />
          <div className="flex items-baseline gap-6 mb-6">
            <div className="h-7 w-48 bg-secondary/60 rounded animate-pulse shrink-0" />
            <div className="h-px flex-1 bg-border/60" />
          </div>
          <div className="h-4 w-80 bg-secondary/40 rounded animate-pulse" />
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="divide-y divide-border/60">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-6 sm:gap-8 py-10 first:pt-0">
                {/* Cover placeholder */}
                <div className="flex-shrink-0 w-24 sm:w-28 md:w-32 aspect-[3/4] rounded-sm bg-secondary/50 animate-pulse" />
                {/* Text placeholder */}
                <div className="flex flex-col justify-center flex-1 gap-2 min-w-0">
                  <div className="h-2 w-6 bg-secondary/50 rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-secondary/60 rounded animate-pulse" />
                  <div className="h-3 w-1/3 bg-secondary/40 rounded animate-pulse" />
                  <div className="mt-1 space-y-1.5">
                    <div className="h-3 w-full bg-secondary/30 rounded animate-pulse" />
                    <div className="h-3 w-full bg-secondary/30 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-secondary/30 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
