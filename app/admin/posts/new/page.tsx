'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft } from 'lucide-react'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function NewPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('reflexion')
  const [readingTime, setReadingTime] = useState(5)
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const supabase = createClient()
    const slug = generateSlug(title)
    
    const { error: insertError } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        content,
        excerpt: excerpt || null,
        image_url: imageUrl || null,
        category,
        reading_time: readingTime,
        published,
      })
    
    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }
    
    router.push('/admin/posts')
    router.refresh()
  }
  
  return (
    <div>
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/posts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </Button>
        <h1 className="font-serif text-3xl text-primary">Nueva Entrada</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="El título de tu entrada"
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="excerpt">Extracto</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Un breve resumen de la entrada..."
            rows={2}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="imageUrl">URL de imagen (opcional)</Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Pega la URL pública de una imagen para mostrar en la entrada.</p>
        </div>
        
        <div>
          <Label htmlFor="content">Contenido</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe tu entrada aquí... Usa ## para títulos y > para citas."
            rows={15}
            required
            className="mt-1 font-mono text-sm"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Categoría</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="reflexion">Reflexión</option>
              <option value="proceso">Proceso</option>
              <option value="fragmentos">Fragmentos</option>
              <option value="fotos">Fotos</option>
            </select>
          </div>
          <div>
            <Label htmlFor="readingTime">Tiempo de lectura (min)</Label>
            <Input
              id="readingTime"
              type="number"
              value={readingTime}
              onChange={(e) => setReadingTime(parseInt(e.target.value) || 5)}
              min={1}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            id="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor="published">Publicar inmediatamente</Label>
        </div>
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Entrada'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/posts">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
