'use client'

interface BookVideoProps {
  videoUrl?: string | null
  title?: string
}

export function BookVideo({ videoUrl, title = 'Presentación del Libro' }: BookVideoProps) {
  if (!videoUrl) return null

  // Detectar tipo de video (YouTube, Vimeo, o URL directa)
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
  const isVimeo = videoUrl.includes('vimeo.com')

  let embedUrl = videoUrl
  let embedType = 'custom'

  if (isYouTube) {
    embedType = 'youtube'
    // Convertir URLs de YouTube a embed format
    if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1].split('?')[0]
      embedUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1].split('&')[0]
      embedUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (videoUrl.includes('youtube.com/embed/')) {
      embedUrl = videoUrl
    }
  } else if (isVimeo) {
    embedType = 'vimeo'
    // Convertir URLs de Vimeo a embed format
    const videoId = videoUrl.split('/').pop()?.split('?')[0]
    if (videoId) {
      embedUrl = `https://player.vimeo.com/video/${videoId}`
    }
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Línea divisoria superior */}
        <div className="flex justify-center mb-12">
          <div className="w-10 h-px bg-accent" />
        </div>

        {/* Video Container */}
        <div className="relative bg-muted rounded-lg overflow-hidden aspect-video shadow-lg border border-border">
          {embedType === 'youtube' || embedType === 'vimeo' ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={embedUrl}
              className="w-full h-full object-cover"
              controls
              controlsList="nodownload"
            />
          )}
        </div>

        {/* Caption */}
        <p className="text-sm text-muted-foreground text-center mt-6 font-serif">{title}</p>

        {/* Línea divisoria inferior */}
        <div className="flex justify-center mt-12">
          <div className="w-10 h-px bg-accent" />
        </div>
      </div>
    </section>
  )
}

