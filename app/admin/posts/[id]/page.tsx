'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Loader } from 'lucide-react'
import { FileUploadField } from '@/components/admin/file-upload-field'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  image_url: string | null
  category: string
  reading_time: number
  published: boolean
  created_at: string
  updated_at: string
}

export default function EditPostPage() {
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('reflexion')
  const [readingTime, setReadingTime] = useState(5)
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  
  useEffect(() => {
    const fetchPost = async () => {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single()
      
      if (fetchError || !data) {
        setError('No se encontró la entrada')
        setLoading(false)
        return
      }
      
      setPost(data as BlogPost)
      setTitle(data.title)
      setContent(data.content)
      setExcerpt(data.excerpt || '')
      setImageUrl(data.image_url || '')
      setCategory(data.category)
      setReadingTime(data.reading_time)
      setPublished(data.published)
      setLoading(false)
    }
    
    fetchPost()
  }, [postId])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    
    try {
      const supabase = createClient()
      const newSlug = generateSlug(title)
      
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title,
          slug: newSlug,
          content,
          excerpt: excerpt || null,
          image_url: imageUrl || null,
          category,
          reading_time: readingTime,
          published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId)
      
      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }
      
      router.push('/admin/posts')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
      setSaving(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    )
  }
  
  if (error && !post) {
    return (
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/posts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </Button>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
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
        <h1 className="font-serif text-3xl text-primary">Editar Entrada</h1>
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
          <FileUploadField
            label="Imagen de la Entrada"
            value={imageUrl}
            onChange={setImageUrl}
            fileType="image"
            accept="image/jpeg,image/png,image/webp"
            maxSize={5 * 1024 * 1024}
            helpText="Sube una imagen JPG, PNG o WebP. Máximo 5MB. Puedes también pegar una URL directamente en el campo de texto."
          />
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
          <Label htmlFor="published">Publicar</Label>
        </div>
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        
        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/posts">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
