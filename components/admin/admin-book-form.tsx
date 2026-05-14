'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MediaUploadForm } from './media-upload-form'
import { SmartTextarea } from './smart-input'
import { updateBookInfo } from '@/app/admin/actions'

interface BookInfo {
  id: string
  title: string
  subtitle: string | null
  author_name: string | null
  cover_image_url: string | null
  description: string | null
  video_url?: string | null
}

export function AdminBookForm({ book }: { book: BookInfo }) {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Libro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="El Libro de los Sueños"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subtítulo</label>
              <Input
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Subtítulo opcional"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Nombre del Autor</label>
            <Input
              value={formData.author_name || ''}
              onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
              placeholder="Nombre del autor"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Descripción</label>
            <SmartTextarea
              value={formData.description || ''}
              onChange={(v) => setFormData({ ...formData, description: v })}
              placeholder="Descripción del libro"
              rows={6}
              showQuality
              showIssues
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Management */}
      <MediaUploadForm
        currentCoverUrl={formData.cover_image_url}
        currentVideoUrl={formData.video_url}
        onCoverChange={(url) => setFormData({ ...formData, cover_image_url: url })}
        onVideoChange={(url) => setFormData({ ...formData, video_url: url })}
      />

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
  )
}
