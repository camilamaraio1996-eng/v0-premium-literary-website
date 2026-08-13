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
            <div className="block after:content-[''] after:clear-both after:table">
              <a
                href={podcastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative float-left mr-6 mb-4 md:mr-8 md:mb-6 w-40 sm:w-48 md:w-1/2 lg:w-2/5 aspect-square bg-muted overflow-hidden rounded-xl border border-border hover:border-accent transition-all duration-300 shadow-sm hover:shadow-md"
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
                    <PlayCircle className="w-10 h-10 md:w-16 md:h-16 text-muted-foreground opacity-50" />
                  </div>
                )}
                
                {/* Overlay oscuro sutil al pasar el mouse */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                
                {/* Botón siempre visible abajo a la derecha */}
                <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 flex items-center gap-1.5 md:gap-2 bg-white/95 backdrop-blur-sm text-black px-2.5 py-1 md:px-5 md:py-2.5 rounded-full shadow-xl border border-black/10 group-hover:bg-accent group-hover:text-accent-foreground group-hover:scale-105 transition-all duration-300 z-10">
                  <span className="text-[9px] md:text-sm font-bold tracking-wide uppercase">
                    Toca y escuchá
                  </span>
                  <PlayCircle className="w-3 h-3 md:w-5 md:h-5" />
                </div>
              </a>
              
              <div className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {podcastDescription && (
                  <div 
                    className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-accent prose-headings:font-serif [&>p]:mb-6 [&>p:has(br)]:h-6"
                    dangerouslySetInnerHTML={{ __html: podcastDescription }} 
                  />
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
