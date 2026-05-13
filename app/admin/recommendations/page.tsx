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

interface RecommendationData {
  id: string
  title: string
  author: string | null
  description: string
  published: boolean
  created_at: string
}

async function getRecommendations(): Promise<RecommendationData[]> {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('No authenticated user')
    }

    // Query a Supabase
    const { data: recs, error: queryError } = await supabase
      .from('recommendations')
      .select('id, title, author, description, published, created_at')
      .order('created_at', { ascending: false })

    if (queryError) {
      throw new Error(`Supabase error: ${queryError.message}`)
    }

    // Validar y transformar datos - SIN CREAR NUEVAS INSTANCIAS
    if (!recs || !Array.isArray(recs)) {
      console.error('[v0-admin] Invalid data format from Supabase:', typeof recs)
      return []
    }

    return recs.map(rec => ({
      id: String(rec.id || ''),
      title: String(rec.title || 'Sin título'),
      author: rec.author ? String(rec.author) : null,
      description: String(rec.description || ''),
      published: Boolean(rec.published),
      created_at: String(rec.created_at || ''),
    }))
  } catch (error) {
    console.error('[v0-admin] Error fetching recommendations:', {
      error: error instanceof Error ? error.message : String(error),
      type: error instanceof Error ? error.constructor.name : typeof error,
    })
    throw error
  }
}

function formatDate(dateString: string): string {
  try {
    // Parse como timestamp y luego format - TODO COMO STRINGS, sin Date objects
    const timestamp = new Date(dateString).getTime()
    if (isNaN(timestamp)) {
      return 'Fecha inválida'
    }
    return format(timestamp, 'd MMM yyyy', { locale: es })
  } catch (err) {
    console.error('[v0-admin] Date format error:', dateString, err)
    return 'Fecha no disponible'
  }
}

export default async function AdminRecommendationsPage() {
  try {
    const supabase = await createClient()

    // Obtener usuario
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/admin/login')
    }

    // Obtener recomendaciones - este puede fallar
    let recommendations: RecommendationData[] = []
    try {
      recommendations = await getRecommendations()
    } catch (error) {
      console.error('[v0-admin-page] Failed to fetch recommendations:', error)
      // Mostrar página vacía en vez de crashear
      recommendations = []
    }

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
              <p className="text-xs text-muted-foreground/60 mt-2">
                Crea la primera recomendación para comenzar.
              </p>
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
                  {recommendations.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell className="font-medium">{rec.title}</TableCell>
                      <TableCell>{rec.author || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={rec.published ? 'default' : 'secondary'}>
                          {rec.published ? 'Publicada' : 'Borrador'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(rec.created_at)}
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </div>
    )
  } catch (error) {
    console.error('[v0-admin-page] Critical page error:', error)
    throw error
  }
}
