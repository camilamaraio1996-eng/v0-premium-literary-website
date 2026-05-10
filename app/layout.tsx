import type { Metadata, Viewport } from 'next'
import { Julius_Sans_One, Archivo_Narrow } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const juliusSansOne = Julius_Sans_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-julius',
  display: 'swap',
})

const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'El Libro de los Sueños',
    template: '%s | El Libro de los Sueños',
  },
  description: 'Una exploración íntima de los sueños, la memoria y las emociones.',
  keywords: ['novela', 'literatura', 'sueños', 'ficción literaria'],
  authors: [{ name: 'Autora' }],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    title: 'El Libro de los Sueños',
    description: 'Una exploración íntima de los sueños, la memoria y las emociones.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#5e376d',
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
    <html
      lang="es"
      className={`${juliusSansOne.variable} ${archivoNarrow.variable} bg-background`}
    >
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
