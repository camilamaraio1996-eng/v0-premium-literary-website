import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { getNavigationData, getSiteSettings } from '@/lib/cms'
import Image from 'next/image'
import { PlayCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export const metadata: Metadata = {
  title: 'Podcasts',
  description: 'Escucha el episodio de podcast destacado.',
  openGraph: {
    title: 'Podcasts',
    description: 'Escucha el episodio de podcast destacado.',
  },
}

export default async function PodcastsPage() {
  const { navItems, siteTitle } = await getNavigationData()
  const settings = await getSiteSettings()

  const podcastUrl = settings['podcast_url']
  const podcastTitle = settings['podcast_title'] || 'PODCAST'
  const podcastSubtitle = settings['podcast_subtitle'] || 'Un espacio para escuchar, reflexionar y compartir ideas a través de la voz.'
  const podcastImage = settings['podcast_image']
  const podcastDescription = settings['podcast_description']

  return (
    <>
      <Navigation navItems={navItems} siteTitle={siteTitle} />
      <main className="pt-24 sm:pt-36 lg:pt-44 pb-24 min-h-screen bg-background">
        {/* Encabezado al estilo de la home */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 w-full pb-8">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-primary mb-4 text-balance leading-tight uppercase tracking-[0.02em] sm:tracking-tight whitespace-nowrap text-left">
            {podcastTitle}
          </h1>
          
          <p className="font-sans text-muted-foreground text-sm max-w-2xl text-left mb-6">
            {podcastSubtitle}
          </p>
          
          <div className="w-full h-px bg-border/50 mb-12" />
        </section>

        {/* Contenido del Podcast */}
        <section className="max-w-6xl mx-auto px-4 md:px-6">
          {!podcastUrl ? (
            <div className="text-left text-muted-foreground py-10">
              <p>Próximamente nuevos episodios.</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <a
                href={podcastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full md:w-1/2 lg:w-2/5 aspect-square bg-muted overflow-hidden rounded-xl border border-border hover:border-accent transition-all duration-300 shadow-sm hover:shadow-md flex-shrink-0"
              >
                {podcastImage ? (
                  <Image
                    src={podcastImage}
                    alt={podcastTitle}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                    <PlayCircle className="w-16 h-16 text-muted-foreground opacity-50" />
                  </div>
                )}
                
                {/* Overlay oscuro y botón */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                  <PlayCircle className="w-16 h-16 text-white" />
                  <span className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium tracking-wide uppercase shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Toca y escuchá
                  </span>
                </div>
              </a>
              
              <div className="w-full md:w-1/2 lg:w-3/5">
                {podcastDescription && (
                  <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                    {podcastDescription}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
