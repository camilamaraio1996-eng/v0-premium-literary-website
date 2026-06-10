'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft } from 'lucide-react'
import { BlogImageUploadField } from '@/components/admin/blog-image-upload-field'
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

export default function NewPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [readingTime, setReadingTime] = useState(5)
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const slug = generateSlug(title)

      console.log('[v0] Creating new post with images:', {
        imagesCount: images.length,
        images: images,
        title,
      })

      // Prepare payload - save all images to the images column
      const payload = {
        title,
        slug,
        content,
        image_url: images.length > 0 ? images[0] : null, // Legacy: keep first image in image_url
        images: images.length > 0 ? images : [], // New: save all images in images column
        reading_time: readingTime,
        published,
      }

      console.log('[v0] Payload before insert:', payload)

      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert(payload)

      if (insertError) {
        console.error('[v0] Insert error:', insertError)
        setError(insertError.message)
        setLoading(false)
        return
      }

      console.log('[v0] Post created successfully')
      router.push('/admin/posts')
      router.refresh()
    } catch (err: any) {
      console.error('[v0] Unexpected error:', err)
      setError(err.message || 'Error desconocido')
      setLoading(false)
    }
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
          <BlogImageUploadField
            label="Imágenes de la Entrada"
            value={images}
            onChange={setImages}
            bucketName="blog-images"
            accept="image/jpeg,image/png,image/webp"
            maxSize={5 * 1024 * 1024}
            helpText="Subí hasta 3 imágenes. Solo la primera se guardará como imagen principal de la entrada. Las adicionales pueden servir para el contenido del texto."
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
