'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'

interface Recommendation {
  id: string
  title: string
  author: string | null
  published: boolean
  created_at: string
}

interface RecommendationsTableProps {
  recommendations: Recommendation[]
}

export function RecommendationsTable({ recommendations }: RecommendationsTableProps) {
  const [items, setItems] = useState(recommendations)
  const router = useRouter()

  const togglePublished = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('recommendations')
      .update({ published: !currentStatus })
      .eq('id', id)

    if (!error) {
      setItems(prev =>
        prev.map(r => r.id === id ? { ...r, published: !currentStatus } : r)
      )
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('¿Eliminar esta recomendación?')) return

    const supabase = createClient()
    const { error } = await supabase
      .from('recommendations')
      .delete()
      .eq('id', id)

    if (!error) {
      setItems(prev => prev.filter(r => r.id !== id))
      router.refresh()
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-card/50 rounded-lg border border-border">
        <p className="text-muted-foreground mb-4">No hay libros en la biblioteca todavía.</p>
        <Button asChild>
          <Link href="/admin/recommendations/new">Agregar Primer Libro</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-card/50 rounded-lg border border-border overflow-hidden">
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
            {items.map((rec) => (
              <TableRow key={rec.id}>
                <TableCell className="font-medium">{rec.title}</TableCell>
                <TableCell>{rec.author || '-'}</TableCell>
                <TableCell>
                  <Badge variant={rec.published ? 'default' : 'secondary'}>
                    {rec.published ? 'Publicada' : 'Borrador'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(rec.created_at), 'd MMM yyyy', { locale: es })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublished(rec.id, rec.published)}
                      title={rec.published ? 'Despublicar' : 'Publicar'}
                    >
                      {rec.published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/recommendations/${rec.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(rec.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {items.map((rec) => (
          <div
            key={rec.id}
            className="bg-card/50 rounded-lg border border-border p-4 space-y-3"
          >
            <div className="flex flex-col gap-2">
              <h3 className="font-medium text-primary line-clamp-2">{rec.title}</h3>
              <div className="flex flex-wrap items-center gap-2">
                {rec.author && (
                  <span className="text-sm text-muted-foreground truncate">
                    {rec.author}
                  </span>
                )}
                <Badge variant={rec.published ? 'default' : 'secondary'} className="text-xs">
                  {rec.published ? 'Publicada' : 'Borrador'}
                </Badge>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {format(new Date(rec.created_at), 'd MMM yyyy', { locale: es })}
            </div>

            <div className="flex gap-2 pt-2 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePublished(rec.id, rec.published)}
                title={rec.published ? 'Despublicar' : 'Publicar'}
                className="flex-1"
              >
                {rec.published ? (
                  <EyeOff className="w-4 h-4 mr-2" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                <span className="text-xs">{rec.published ? 'Ocultar' : 'Mostrar'}</span>
              </Button>
              <Button asChild variant="ghost" size="sm" className="flex-1">
                <Link href={`/admin/recommendations/${rec.id}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  <span className="text-xs">Editar</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteItem(rec.id)}
                className="flex-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span className="text-xs">Eliminar</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
