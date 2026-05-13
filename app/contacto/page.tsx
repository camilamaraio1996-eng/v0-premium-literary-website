import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ContactHero } from '@/components/contacto/contact-hero'
import { ContactForm } from '@/components/contacto/contact-form'
import { getNavigationData } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Ponte en contacto con Camila Maraio. Consultas, colaboraciones y mensajes.',
}

export default async function ContactoPage() {
  const { navItems, siteTitle } = await getNavigationData()

  return (
    <>
      <Navigation navItems={navItems} siteTitle={siteTitle} />
      <main className="pt-20">
        <ContactHero />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
