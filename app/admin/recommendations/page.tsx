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
  
  async function deleteRecommendation(id: string) {
    'use server'
    const supabase = await createClient()
    await supabase.from('recommendations').delete().eq('id', id)
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRecommendation(rec.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Eliminar
                      </Button>
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
