import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/admin-nav'
import { PodcastSettingsForm } from '@/components/admin/podcasts/podcast-settings-form'
import { getSiteSettings } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export default async function AdminPodcastsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const settings = await getSiteSettings()

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={user} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-primary mb-8">Podcast Destacado</h1>
        <p className="text-muted-foreground mb-8">
          Configura el acceso directo a tu podcast. Esto actualizará la página pública de Podcasts con un único episodio o canal destacado.
        </p>
        <PodcastSettingsForm settings={settings} />
      </main>
    </div>
  )
}
