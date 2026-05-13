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
        <p className="text-muted-foreground mb-4">No hay recomendaciones todavía.</p>
        <Button asChild>
          <Link href="/admin/recommendations/new">Crear Primera Recomendación</Link>
        </Button>
      </div>
    )
  }

  return (
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
  )
}
