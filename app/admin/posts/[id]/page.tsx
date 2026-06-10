'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Loader, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { BlogImageUploadField } from '@/components/admin/blog-image-upload-field'
import { SmartInput, SmartTextarea } from '@/components/admin/smart-input'
import { RichEditor } from '@/components/admin/rich-editor'
import { syncBlogPostToGoogleDrive } from '@/app/admin/actions'

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
  images?: string[] | null
  reading_time: number
  published: boolean
  created_at: string
  updated_at: string
  google_doc_id?: string | null
  google_doc_url?: string | null
  sync_status?: string | null
  synced_at?: string | null
}

export default function EditPostPage() {
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [readingTime, setReadingTime] = useState(5)
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
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
      
      // Load images: prefer new `images` column, fall back to legacy `image_url`
      const loadedImages: string[] =
        data.images && Array.isArray(data.images) && data.images.length > 0
          ? data.images
          : data.image_url
          ? [data.image_url]
          : []
      setImages(loadedImages)
      
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
          cover_image: images.length > 0 ? images[0] : null,
          image_url: images.length > 0 ? images[0] : null,
          images: images,
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

      // Sincronizar con Drive automáticamente al guardar si está publicada
      if (published) {
        setSyncing(true)
        try {
          await syncBlogPostToGoogleDrive(postId)
        } catch (syncErr: any) {
          // No bloquear el guardado si falla Drive
          console.error('Drive sync error:', syncErr)
        }
        setSyncing(false)
      }

      router.push('/admin/posts')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
      setSaving(false)
    }
  }

  const handleSyncToGoogleDrive = async () => {
    setSyncing(true)
    setError('')
    try {
      const result = await syncBlogPostToGoogleDrive(postId)
      if (!result.success) {
        setError(result.message)
        return
      }
      // Recargar datos del post para mostrar estado actualizado
      const supabase = createClient()
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single()
      if (data) setPost(data as BlogPost)
    } catch (err: any) {
      setError(`Error sincronizando: ${err.message}`)
    } finally {
      setSyncing(false)
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
          <Label htmlFor="published">Publicar</Label>
        </div>

        {/* Google Drive Sync */}
        <div className={`p-4 rounded-lg border ${
          post?.sync_status === 'synced'
            ? 'bg-green-50 border-green-200'
            : post?.sync_status === 'error'
            ? 'bg-red-50 border-red-200'
            : 'bg-muted/40 border-border'
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {post?.sync_status === 'synced' ? (
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              ) : post?.sync_status === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {post?.sync_status === 'synced'
                    ? 'Sincronizado con Google Drive'
                    : post?.sync_status === 'error'
                    ? 'Error al sincronizar'
                    : 'No sincronizado aun'}
                </p>
                {post?.synced_at && (
                  <p className="text-xs text-muted-foreground">
                    Ultima sync: {new Date(post.synced_at).toLocaleString('es-AR')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {post?.google_doc_url && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(post.google_doc_url!, '_blank')}
                  className="gap-1.5 text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Abrir en Drive
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSyncToGoogleDrive}
                disabled={syncing}
                className="text-xs"
              >
                {syncing ? 'Sincronizando...' : post?.google_doc_id ? 'Actualizar en Drive' : 'Sincronizar con Drive'}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={saving || syncing}>
            {saving ? 'Guardando...' : syncing ? 'Sincronizando con Drive...' : 'Guardar Cambios'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/posts">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
