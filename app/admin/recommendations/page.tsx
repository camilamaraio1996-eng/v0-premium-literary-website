import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/admin-nav'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { deleteRecommendation } from '@/app/admin/actions'

async function getRecommendations() {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('[v0-admin] Auth error:', userError)
      throw new Error(`Authentication failed: ${userError.message}`)
    }
    if (!user) {
      console.error('[v0-admin] No authenticated user')
      throw new Error('User not authenticated')
    }

    // Ejecutar query
    const { data: recs, error: queryError } = await supabase
      .from('recommendations')
      .select('id, title, author, description, published, created_at')
      .order('created_at', { ascending: false })

    if (queryError) {
      console.error('[v0-admin] Query error:', queryError)
      throw new Error(`Query failed: ${queryError.message}`)
    }

    // Validar que todos los items tienen los campos requeridos
    const validatedRecs = (recs || []).map(rec => ({
      id: rec.id || '',
      title: rec.title || 'Sin título',
      author: rec.author || null,
      published: Boolean(rec.published),
      created_at: rec.created_at || new Date().toISOString(),
    }))

    return validatedRecs
  } catch (error) {
    console.error('[v0-admin] Error in getRecommendations:', error)
    throw error
  }
}

export default async function AdminRecommendationsPage() {
  try {
    const supabase = await createClient()
    
    // Obtener usuario autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('[v0-admin] Auth error on page:', userError)
      throw new Error(`Auth failed: ${userError.message}`)
    }

    if (!user) {
      redirect('/admin/login')
    }

    // Obtener recomendaciones
    const recommendations = await getRecommendations()

    return (
      <div className="min-h-screen bg-background">
        <AdminNav user={user} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-3xl text-primary">Recomendaciones</h1>
            <Button asChild>
              <Link href="/admin/recommendations/new">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Recomendación
              </Link>
            </Button>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-12 bg-card/50 rounded-lg border border-border">
              <p className="text-muted-foreground">No hay recomendaciones todavía.</p>
              <p className="text-xs text-muted-foreground/60 mt-2">Crea la primera recomendación para comenzar.</p>
            </div>
          ) : (
            <div className="bg-card/50 rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendations.map((rec) => {
                    const createdDate = new Date(rec.created_at)
                    const isValidDate = !isNaN(createdDate.getTime())

                    return (
                      <TableRow key={rec.id}>
                        <TableCell className="font-medium">{rec.title}</TableCell>
                        <TableCell>{rec.author || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={rec.published ? 'default' : 'secondary'}>
                            {rec.published ? 'Publicada' : 'Borrador'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {isValidDate
                            ? format(createdDate, 'd MMM yyyy', { locale: es })
                            : 'Fecha inválida'}
                        </TableCell>
                        <TableCell className="text-right">
                          <form action={deleteRecommendation} className="inline">
                            <input type="hidden" name="id" value={rec.id} />
                            <button
                              type="submit"
                              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                              onClick={(e) => {
                                if (!confirm('¿Eliminar esta recomendación?')) {
                                  e.preventDefault()
                                }
                              }}
                            >
                              Eliminar
                            </button>
                          </form>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </div>
    )
  } catch (error) {
    console.error('[v0-admin] Page error:', error)
    throw error
  }
}
