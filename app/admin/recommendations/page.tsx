import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/admin-nav'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
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
  const supabase = await createClient()
  const { data: recs } = await supabase
    .from('recommendations')
    .select('*')
    .order('sort_order', { ascending: true })
  return recs || []
}

export default async function AdminRecommendationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/admin/login')
  }
  
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
                    <TableCell className="text-muted-foreground">
                      {format(new Date(rec.created_at), 'd MMM yyyy', { locale: es })}
                    </TableCell>
                    <TableCell className="text-right">
                      <form
                        action={async () => {
                          'use server'
                          await deleteRecommendation(rec.id)
                        }}
                        className="inline"
                      >
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-700 text-sm font-medium inline-flex items-center gap-1"
                          onClick={(e) => {
                            if (!confirm('¿Eliminar esta recomendación?')) {
                              e.preventDefault()
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
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
}
