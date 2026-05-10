import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PreventaHero } from '@/components/preventa/preventa-hero'
import { PreventaForm } from '@/components/preventa/preventa-form'
import { PreventaBenefits } from '@/components/preventa/preventa-benefits'

export const metadata: Metadata = {
  title: 'Preventa',
  description: 'Reserva tu copia de El Libro de los Sueños. Accede a contenido exclusivo, dedicatoria personalizada y envío prioritario.',
}

export default function PreventaPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <PreventaHero />
        <PreventaBenefits />
        <PreventaForm />
      </main>
      <Footer />
    </>
  )
}
