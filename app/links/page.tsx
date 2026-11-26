import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowUpRight, BookOpen, Mic, NotebookPen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Links',
  description: 'WhatsApp, diario, libro y podcast de Camila Maraio.',
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" />
    </svg>
  )
}

const links = [
  {
    label: 'WhatsApp',
    sub: 'Escribime directo',
    href: 'https://wa.me/5491162752386?text=Hola%20Cami%2C%20te%20escribo%20por%20tu%20tarjeta',
    Icon: WhatsAppIcon,
    external: true,
  },
  {
    label: 'Mi diario',
    sub: 'El blog',
    href: '/diario',
    Icon: NotebookPen,
    external: false,
  },
  {
    label: 'Lo real y lo otro',
    sub: 'Mi libro · Editorial Orsai',
    href: 'https://tienda.orsai.org/products/lo-real-y-lo-otro',
    Icon: BookOpen,
    external: true,
  },
  {
    label: 'En voz alta',
    sub: 'El podcast en Spotify',
    href: 'https://open.spotify.com/show/03465oO2jq1qgS0Aj4m6lj',
    Icon: Mic,
    external: true,
  },
]

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex justify-center px-5 pt-14 pb-10">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full border border-border bg-card">
          <Image
            src="/logo-cm.png"
            alt="Camila Maraio"
            width={600}
            height={384}
            className="h-auto w-14"
            priority
          />
        </div>

        <h1 className="sr-only">Camila Maraio</h1>

        <nav className="mt-8 flex flex-col gap-3">
          {links.map(({ label, sub, href, Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-primary"
            >
              <span className="grid h-11 w-11 flex-none place-items-center rounded-lg bg-background text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block text-base font-medium">{label}</span>
                <span className="block text-sm text-muted-foreground">{sub}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" />
            </a>
          ))}
        </nav>

        <a href="/" className="mt-10 inline-block text-sm text-muted-foreground hover:text-primary">
          camilamaraio.com
        </a>
      </div>
    </main>
  )
}
