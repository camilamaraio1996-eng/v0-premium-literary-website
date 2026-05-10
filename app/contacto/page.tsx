import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ContactHero } from '@/components/contacto/contact-hero'
import { ContactForm } from '@/components/contacto/contact-form'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Ponte en contacto con el autor de El Libro de los Sueños. Consultas, colaboraciones y mensajes.',
}

export default function ContactoPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <ContactHero />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
