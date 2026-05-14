'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileUploadField } from '@/components/admin/file-upload-field'
import { SmartTextarea } from '@/components/admin/smart-input'
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
      setError('Por favor completa los campos requeridos (Título y Descripción)')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      const payload = {
        title: title.trim(),
        author: author?.trim() || null,
        description: description.trim(),
        image_url: imageUrl?.trim() || null,
        published: false,
        created_at: new Date().toISOString(),
      }

      const { error: err } = await supabase
        .from('recommendations')
        .insert([payload])
        .select()

      if (err) {
        throw new Error(err.message)
      }

      router.push('/admin/recommendations')
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear la recomendación'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9 sm:h-10 sm:w-10">
            <Link href="/admin/recommendations">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </Button>
          <h1 className="font-serif text-2xl sm:text-3xl text-primary">Nueva Recomendación</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card/50 p-4 sm:p-6 rounded-lg border border-border">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="title" className="text-sm sm:text-base">Título del Libro *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del libro"
              className="mt-1 text-base"
              required
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
            <Label htmlFor="imageUrl" className="text-sm sm:text-base">Imagen de portada (opcional)</Label>
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

          <div className="flex gap-3 pt-4 flex-col sm:flex-row">
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Recomendación'
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
