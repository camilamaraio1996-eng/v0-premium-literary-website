'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { Loader2, ChevronLeft } from 'lucide-react'

export default function NewRecommendationPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      setError('Completa los campos requeridos')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error: err } = await supabase.from('recommendations').insert({
        title,
        author: author || null,
        description,
        image_url: imageUrl || null,
      })

      if (err) throw err

      router.push('/admin/recommendations')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/recommendations">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="font-serif text-3xl text-primary">Nueva Recomendación</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card/50 p-6 rounded-lg border border-border">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="title">Título del Libro *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del libro"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="author">Autor</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nombre del autor"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿Por qué recomendamos este libro?"
              rows={5}
              className="mt-1"
              required
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
            <p className="text-xs text-muted-foreground mt-1">Pega la URL pública de la portada del libro.</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Guardando...' : 'Crear Recomendación'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/recommendations">Cancelar</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
