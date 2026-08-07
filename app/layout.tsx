import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
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
    default: 'Camila Maraio',
    template: '%s | Camila Maraio',
  },
  description: 'Una exploración íntima de los sueños, la memoria y las emociones.',
  keywords: ['novela', 'literatura', 'sueños', 'ficción literaria'],
  authors: [{ name: 'Camila Maraio' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/camila-logo.png',
    shortcut: '/camila-logo.png',
    apple: '/camila-logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    title: 'Camila Maraio',
    description: 'Una exploración íntima de los sueños, la memoria y las emociones.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#f2ede6',
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
      <head>
        {/* Meta Pixel Code */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '807404378885132');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=807404378885132&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
