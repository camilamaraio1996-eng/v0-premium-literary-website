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

interface Post {
  id: string
  title: string
  slug: string
  category: string
  published: boolean
  created_at: string
}

interface PostsTableProps {
  posts: Post[]
}

export function PostsTable({ posts }: PostsTableProps) {
  const [localPosts, setLocalPosts] = useState(posts)
  const router = useRouter()
  
  const togglePublished = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('blog_posts')
      .update({ published: !currentStatus })
      .eq('id', id)
    
    if (!error) {
      setLocalPosts(prev => 
        prev.map(p => p.id === id ? { ...p, published: !currentStatus } : p)
      )
    }
  }
  
  const deletePost = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta entrada?')) return
    
    const supabase = createClient()
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
    
    if (!error) {
      setLocalPosts(prev => prev.filter(p => p.id !== id))
      router.refresh()
    }
  }
  
  if (localPosts.length === 0) {
    return (
      <div className="text-center py-12 bg-card/50 rounded-lg border border-border">
        <p className="text-muted-foreground mb-4">No hay entradas todavía.</p>
        <Button asChild>
          <Link href="/admin/posts/new">Crear Primera Entrada</Link>
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
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localPosts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>
                <Badge variant="secondary">{post.category}</Badge>
              </TableCell>
              <TableCell>
                {post.published ? (
                  <Badge variant="default">Publicado</Badge>
                ) : (
                  <Badge variant="outline">Borrador</Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(post.created_at), 'd MMM yyyy', { locale: es })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublished(post.id, post.published)}
                    title={post.published ? 'Despublicar' : 'Publicar'}
                  >
                    {post.published ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/posts/${post.id}`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePost(post.id)}
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
