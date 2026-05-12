"use client"

import { useState } from "react"
import { Play } from "lucide-react"

export function PremiumYoutubePlayer() {
  const [started, setStarted] = useState(false)

  const youtubeId = "qXAKNC4rXF0"

  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&controls=1&iv_load_policy=3&loop=1&playlist=${youtubeId}`

  return (
    <section className="relative w-full py-12 px-4 overflow-hidden bg-background">
      <div className="relative max-w-3xl mx-auto">
        {/* Video container with premium frame */}
        <div className="relative rounded-2xl p-1 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/30 shadow-2xl">
          {/* Inner container */}
          <div className="relative rounded-xl overflow-hidden bg-background border border-border">
            {/* Video aspect ratio wrapper */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              {!started && (
                <button
                  onClick={() => setStarted(true)}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-br from-primary/40 via-primary/20 to-background/60 text-foreground transition duration-500 hover:from-primary/50 hover:via-primary/30 cursor-pointer group"
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20 border border-accent/40 backdrop-blur-sm shadow-lg transition duration-300 group-hover:bg-accent/30">
                    <Play className="h-9 w-9 fill-accent text-accent" />
                  </span>

                  <span className="mt-6 text-sm uppercase tracking-[0.2em] text-foreground">
                    Reproducir
                  </span>
                </button>
              )}

              {started && (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={embedUrl}
                  title="Presentación - Lo real y lo otro"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
