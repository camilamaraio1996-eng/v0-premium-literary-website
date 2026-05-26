import { redirect } from 'next/navigation'

// Redirect permanente 301: /biblioteca → /recomendaciones
// Garantiza compatibilidad con links existentes en cualquier dirección
export default function BibliotecaRedirectPage() {
  redirect('/recomendaciones')
}
