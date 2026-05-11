'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUploadField } from '@/components/admin/file-upload-field'
import { BookHero } from '@/components/book/book-hero'
import { BookVideo } from '@/components/book/book-video'
import { BookDetails } from '@/components/book/book-details'
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
  description?: string
  content?: string
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
                buyUrl={formData.subtitle ? 'https://tienda.ejemplo.com' : null}
                buyLabel="Comprar Ahora"
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

              {fragments.length > 0 && (
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
              type="image"
              value={formData.cover_image_url || ''}
              onChange={(url) => setFormData({ ...formData, cover_image_url: url })}
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

        {/* Descripción */}
        <Card>
          <CardHeader>
            <CardTitle>Descripción del Libro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Descripción Completa</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el libro aquí..."
                rows={6}
              />
            </div>
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
              type="video"
              value={formData.video_url || ''}
              onChange={(url) => setFormData({ ...formData, video_url: url })}
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

        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </form>
    </div>
  )
}
