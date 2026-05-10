'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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

interface Fragment {
  id: string
  title: string
  chapter_number: number | null
  published: boolean
  sort_order: number
}

interface FragmentsTableProps {
  fragments: Fragment[]
}

export function FragmentsTable({ fragments }: FragmentsTableProps) {
  const [localFragments, setLocalFragments] = useState(fragments)
  const router = useRouter()
  
  const togglePublished = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('book_fragments')
      .update({ published: !currentStatus })
      .eq('id', id)
    
    if (!error) {
      setLocalFragments(prev => 
        prev.map(f => f.id === id ? { ...f, published: !currentStatus } : f)
      )
    }
  }
  
  const deleteFragment = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este fragmento?')) return
    
    const supabase = createClient()
    const { error } = await supabase
      .from('book_fragments')
      .delete()
      .eq('id', id)
    
    if (!error) {
      setLocalFragments(prev => prev.filter(f => f.id !== id))
      router.refresh()
    }
  }
  
  if (localFragments.length === 0) {
    return (
      <div className="text-center py-12 bg-card/50 rounded-lg border border-border">
        <p className="text-muted-foreground mb-4">No hay fragmentos todavía.</p>
        <Button asChild>
          <Link href="/admin/fragments/new">Crear Primer Fragmento</Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="bg-card/50 rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Orden</TableHead>
            <TableHead className="w-24">Capítulo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localFragments.map((fragment) => (
            <TableRow key={fragment.id}>
              <TableCell className="font-mono text-sm text-muted-foreground">
                {fragment.sort_order}
              </TableCell>
              <TableCell>
                {fragment.chapter_number ? (
                  <Badge variant="outline">
                    Cap. {String(fragment.chapter_number).padStart(2, '0')}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="font-medium">{fragment.title}</TableCell>
              <TableCell>
                {fragment.published ? (
                  <Badge variant="default">Publicado</Badge>
                ) : (
                  <Badge variant="outline">Borrador</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublished(fragment.id, fragment.published)}
                    title={fragment.published ? 'Despublicar' : 'Publicar'}
                  >
                    {fragment.published ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/fragments/${fragment.id}`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteFragment(fragment.id)}
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
