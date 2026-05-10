import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'El Libro de los Sueños | Una novela sobre emociones y memoria',
    template: '%s | El Libro de los Sueños',
  },
  description: 'Una experiencia literaria inmersiva. Reserva tu copia en preventa y accede a fragmentos exclusivos de esta novela que explora los territorios de los sueños y las emociones.',
  keywords: ['novela', 'literatura', 'sueños', 'emociones', 'preventa', 'libro', 'escritor'],
  authors: [{ name: 'Autor' }],
  creator: 'Autor',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    title: 'El Libro de los Sueños',
    description: 'Una experiencia literaria inmersiva sobre sueños y emociones.',
    siteName: 'El Libro de los Sueños',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Libro de los Sueños',
    description: 'Una experiencia literaria inmersiva sobre sueños y emociones.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
