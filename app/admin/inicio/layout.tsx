import { getSiteSettings } from '@/lib/cms'
import InicioEditor from './page'

export const metadata = {
  title: 'Editar Página de Inicio - Admin',
}

export default async function AdminInicioPage() {
  const settings = await getSiteSettings()
  
  return <InicioEditor settings={settings} />
}
