'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUploadField } from '@/components/admin/file-upload-field'
import { BookHero } from '@/components/book/book-hero'
import { BookFragments } from '@/components/book/book-fragments'
import { updateBookInfo } from '@/app/admin/actions'

interface BookInfo {
  id: string
  title: string
  subtitle?: string | null
  author_name?: string | null
  cover_image_url?: string | null
  description?: string | null
  video_url?: string | null
}

interface Fragment {
  id: string
  title: string
  chapter_number?: number | null
  description?: string | null
  content: string
  sort_order: number
  published: boolean
}

interface LibroEditorProps {
  book: BookInfo
  fragments: Fragment[]
}

export function LibroEditor({ book, fragments }: LibroEditorProps) {
  const [formData, setFormData] = useState(book)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const isValid = () => {
    return (
      formData.title?.trim().length >= 3 &&
      formData.description?.trim().length >= 20 &&
      formData.description?.trim().length <= 1000
    )
  }

  const getValidationErrors = () => {
    const errors: string[] = []
    if (!formData.title?.trim() || formData.title.trim().length < 3) {
      errors.push('Título mínimo 3 caracteres')
    }
    if (!formData.description?.trim() || formData.description.trim().length < 20) {
      errors.push('Sinopsis mínimo 20 caracteres')
    }
    if (formData.description && formData.description.trim().length > 1000) {
      errors.push('Sinopsis máximo 1000 caracteres')
    }
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const result = await updateBookInfo(formData)
      if (result.success) {
        setMessage('Libro actualizado correctamente')
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setMessage(`Error: ${result.message}`)
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Live Preview */}
      <div className="lg:sticky lg:top-20 h-fit">
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <div className="border rounded-lg overflow-hidden bg-background">
              <BookHero
                coverImage={formData.cover_image_url}
                bookTitle={formData.title}
              />

              {formData.video_url && (
                <div className="border-t">
                  <BookVideo videoUrl={formData.video_url} />
                </div>
              )}

              {formData.description && (
                <div className="border-t py-16 px-6">
                  <BookDetails description={formData.description} />
                </div>
              )}

              {fragments && fragments.length > 0 && (
                <div className="border-t py-16">
                  <BookFragments fragments={fragments} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Portada y Título */}
        <Card>
          <CardHeader>
            <CardTitle>Portada del Libro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUploadField
              label="Imagen de Portada"
              bucketName="book-images"
              value={formData.cover_image_url || ''}
              onChange={(url) => setFormData({ ...formData, cover_image_url: url })}
              accept="image/jpeg,image/png,image/webp"
              maxSize={5 * 1024 * 1024}
              helpText="Sube una imagen JPG, PNG o WebP. Máximo 5MB."
            />

            <div>
              <label className="text-sm font-medium mb-2 block">Título del Libro</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="El Libro de los Sueños"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Subtítulo (Opcional)</label>
              <Input
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Un viaje por la memoria"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Nombre del Autor</label>
              <Input
                value={formData.author_name || ''}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="Camila Maraio"
              />
            </div>
          </CardContent>
        </Card>

        {/* Descripción y Sinopsis */}
        <Card>
          <CardHeader>
            <CardTitle>Sinopsis del Libro</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Escribe la sinopsis que aparecerá en la sección de "SINOPSIS" de la página del libro. 
              Esta es la descripción que los lectores verán para decidir si les interesa el libro.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-sm font-medium block">Sinopsis (Requerido)</label>
                <span className="text-xs text-muted-foreground">
                  {formData.description?.length || 0} / 1000 caracteres
                </span>
              </div>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="En una ciudad sin nombre, un hombre comienza a soñar recuerdos que no le pertenecen. En sus sueños, revive historias olvidadas que lo persiguen durante el día. Una exploración íntima de los territorios donde la vigilia y el sueño se entrelazan..."
                rows={8}
                maxLength={1000}
                className={formData.description && formData.description.length < 20 ? 'border-red-500' : ''}
              />
              {formData.description && formData.description.length < 20 && (
                <p className="text-xs text-red-600 mt-1">La sinopsis debe tener al menos 20 caracteres</p>
              )}
            </div>

            {/* Vista previa de cómo se verá la sinopsis */}
            {formData.description && (
              <div className="p-4 rounded-lg bg-card/50 border border-border">
                <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3 block">
                  Vista Previa
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {formData.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video */}
        <Card>
          <CardHeader>
            <CardTitle>Video del Libro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUploadField
              label="URL o Archivo de Video"
              bucketName="book-videos"
              value={formData.video_url || ''}
              onChange={(url) => setFormData({ ...formData, video_url: url })}
              accept="video/mp4,video/webm,video/ogg"
              maxSize={50 * 1024 * 1024}
              helpText="Sube un video MP4, WebM u OGG. Máximo 50MB."
            />
          </CardContent>
        </Card>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.startsWith('Error')
                ? 'bg-red-500/10 text-red-700'
                : 'bg-green-500/10 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isLoading || !isValid()} 
          className="w-full" 
          size="lg"
          title={!isValid() ? `Errores: ${getValidationErrors().join(', ')}` : ''}
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </form>
    </div>
  )
}
