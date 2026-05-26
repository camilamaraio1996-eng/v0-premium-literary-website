'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { FileUploadField } from '@/components/admin/file-upload-field'
import { SmartTextarea } from '@/components/admin/smart-input'
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react'

interface Recommendation {
  id: string
  title: string
  author: string
  genre: string
  description: string
  image_url: string
  published: boolean
  sort_order: number | null
  created_at: string
}

export default function EditRecommendationPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  const [rec, setRec] = useState<Recommendation | null>(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [published, setPublished] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Fetch recommendation on mount
  useEffect(() => {
    if (!id) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const fetchRec = async () => {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('recommendations')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      const safe: Recommendation = {
        id: String(data.id ?? ''),
        title: String(data.title ?? ''),
        author: String(data.author ?? ''),
        genre: String(data.genre ?? ''),
        description: String(data.description ?? ''),
        image_url: String(data.image_url ?? ''),
        published: Boolean(data.published),
        sort_order: data.sort_order ?? null,
        created_at: String(data.created_at ?? ''),
      }

      setRec(safe)
      setTitle(safe.title)
      setAuthor(safe.author)
      setGenre(safe.genre)
      setDescription(safe.description)
      setImageUrl(safe.image_url)
      setPublished(safe.published)
      setLoading(false)
    }

    fetchRec()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      setError('El título y la descripción son obligatorios.')
      return
    }

    setError('')
    setSaving(true)
    setSuccess(false)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('recommendations')
        .update({
          title: title.trim(),
          author: author.trim() || null,
          genre: genre.trim() || null,
          description: description.trim(),
          image_url: imageUrl.trim() || null,
          published,
        })
        .eq('id', id)

      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }

      setSuccess(true)
      setSaving(false)

      setTimeout(() => {
        router.push('/admin/recommendations')
        router.refresh()
      }, 1200)
    } catch (err: any) {
      setError(err?.message || 'Error desconocido al guardar.')
      setSaving(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Not found state
  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/admin/recommendations">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Biblioteca
            </Link>
          </Button>
          <div className="bg-card/50 border border-border rounded-lg p-6 sm:p-8 text-center">
            <p className="font-serif text-xl text-primary mb-2">Libro no encontrado</p>
            <p className="text-muted-foreground text-sm">
              No existe ningún libro con el ID proporcionado.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9 sm:h-10 sm:w-10">
            <Link href="/admin/recommendations">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </Button>
          <h1 className="font-serif text-2xl sm:text-3xl text-primary">Editar Libro</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-card/50 p-4 sm:p-6 rounded-lg border border-border"
        >
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Cambios guardados correctamente. Redirigiendo...
            </div>
          )}

          <div>
            <Label htmlFor="title" className="text-sm sm:text-base">Título del Libro *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del libro"
              required
              className="mt-1 text-base"
            />
          </div>

          <div>
            <Label htmlFor="author" className="text-sm sm:text-base">Autor</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nombre del autor"
              className="mt-1 text-base"
            />
          </div>

          <div>
            <Label htmlFor="genre" className="text-sm sm:text-base">Género / Categoría</Label>
            <Input
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="ej. Novela, Ensayo, Poesía..."
              className="mt-1 text-base"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm sm:text-base">Descripción *</Label>
            <SmartTextarea
              id="description"
              value={description}
              onChange={setDescription}
              placeholder="¿Por qué recomendamos este libro?"
              rows={6}
              showQuality
              showIssues
              className="mt-1 text-base"
            />
          </div>

          <div>
            <Label htmlFor="imageUrl" className="text-sm sm:text-base">Imagen de portada</Label>
            <FileUploadField
              label="Subir imagen de portada"
              value={imageUrl}
              onChange={setImageUrl}
              bucketName="recommendation-covers"
              accept="image/jpeg,image/png,image/webp"
              maxSize={5 * 1024 * 1024}
              helpText="PNG, JPG o WebP. Máximo 5MB. Mínimo recomendado 800x400px"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published" className="cursor-pointer text-sm sm:text-base">
              {published ? 'Publicada' : 'Borrador'}
            </Label>
          </div>

          <div className="flex gap-3 pt-4 flex-col sm:flex-row">
            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/admin/recommendations">
                Cancelar
              </Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
