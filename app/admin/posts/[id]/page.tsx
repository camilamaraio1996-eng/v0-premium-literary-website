'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Loader } from 'lucide-react'
import { FileUploadField } from '@/components/admin/file-upload-field'
import { MultiImageUploadField } from '@/components/admin/multi-image-upload-field'
import { SmartInput, SmartTextarea } from '@/components/admin/smart-input'
import { RichEditor } from '@/components/admin/rich-editor'

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
  image_url: string | null
  gallery_images: string[] | null
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
  const [imageUrl, setImageUrl] = useState('')
  const [galleryImages, setGalleryImages] = useState<string[]>([])
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
      setImageUrl(data.image_url || '')
      setGalleryImages(data.gallery_images || [])
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
          image_url: imageUrl || null,
          gallery_images: galleryImages.length > 0 ? galleryImages : null,
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
          <SmartInput
            id="title"
            value={title}
            onChange={setTitle}
            placeholder="El título de tu entrada"
            required
            className="mt-1"
          />
        </div>

        <div>
          <FileUploadField
            label="Imagen Principal de la Entrada"
            bucketName="blog-images"
            value={imageUrl}
            onChange={setImageUrl}
            accept="image/jpeg,image/png,image/webp"
            maxSize={5 * 1024 * 1024}
            helpText="Sube una imagen JPG, PNG o WebP. Máximo 5MB. (Opcional)"
          />
        </div>

        <div>
          <Label htmlFor="content" className="mb-2 block">Contenido</Label>
          <RichEditor
            value={content}
            onChange={setContent}
            placeholder="Escribe tu entrada aquí..."
            minHeight={320}
            showQuality
            showWordCount
          />
        </div>

        <div>
          <MultiImageUploadField
            label="Galería de Imágenes"
            value={galleryImages}
            onChange={setGalleryImages}
            bucketName="blog-images"
            accept="image/jpeg,image/png,image/webp"
            maxSize={5 * 1024 * 1024}
            maxImages={10}
            helpText="Sube múltiples imágenes para mostrar como galería debajo del contenido."
          />
        </div>

        <div>
          <Label htmlFor="readingTime">Tiempo de lectura (min)</Label>
          <SmartInput
            id="readingTime"
            value={String(readingTime)}
            onChange={(v) => setReadingTime(parseInt(v) || 5)}
            className="mt-1"
          />
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
