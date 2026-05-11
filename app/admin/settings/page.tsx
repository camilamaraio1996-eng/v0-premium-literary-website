import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/admin-nav'
import { AdminSettingsForm } from '@/components/admin/admin-settings-form'

async function getSettings() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')

  const settings: Record<string, string> = {}
  data?.forEach(({ key, value }) => {
    settings[key] = value || ''
  })
  return settings
}

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const settings = await getSettings()

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={user} />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="font-serif text-3xl text-primary mb-8">Configuración del Sitio</h1>
        <AdminSettingsForm settings={settings} />
      </main>
    </div>
  )
}
