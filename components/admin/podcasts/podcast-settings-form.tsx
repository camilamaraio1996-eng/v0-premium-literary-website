'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichEditor } from '@/components/admin/rich-editor'
import { FileUploadField } from '@/components/admin/file-upload-field'
import { updateSiteSettings } from '@/app/admin/actions'

export function PodcastSettingsForm({ settings }: { settings: Record<string, string> }) {
  const [formData, setFormData] = useState(settings)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const set = (key: string) => (val: string) => setFormData((prev) => ({ ...prev, [key]: val }))
  const get = (key: string, fallback = '') => formData[key] ?? fallback

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    try {
      const result = await updateSiteSettings(formData)
      if (result.success) {
        setMessage('Podcast guardado correctamente')
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
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
      
      <div>
        <Label htmlFor="podcast_title" className="mb-1 block">Título del Podcast (Ej: PODCAST)</Label>
        <Input
          id="podcast_title"
          value={get('podcast_title')}
          onChange={(e) => set('podcast_title')(e.target.value)}
          placeholder="PODCAST"
        />
      </div>

      <div>
        <Label htmlFor="podcast_subtitle" className="mb-1 block">Subtítulo (Aparece debajo del título)</Label>
        <Input
          id="podcast_subtitle"
          value={get('podcast_subtitle')}
          onChange={(e) => set('podcast_subtitle')(e.target.value)}
          placeholder="Un espacio para escuchar..."
        />
      </div>

      <div>
        <Label htmlFor="podcast_url" className="mb-1 block">Enlace (URL de Spotify, YouTube, etc.)</Label>
        <Input
          id="podcast_url"
          value={get('podcast_url')}
          onChange={(e) => set('podcast_url')(e.target.value)}
          placeholder="https://open.spotify.com/..."
        />
      </div>

      <FileUploadField
        label="Portada del Podcast"
        value={get('podcast_image')}
        onChange={set('podcast_image')}
        bucketName="book-images"
        helpText="Recomendado: Imagen cuadrada de alta calidad."
      />

      <div>
        <Label className="mb-1 block">Descripción del Podcast</Label>
        <RichEditor
          value={get('podcast_description')}
          onChange={set('podcast_description')}
          placeholder="En este episodio hablamos sobre..."
          minHeight={300}
        />
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.startsWith('Error') ? 'bg-red-500/10 text-red-700' : 'bg-green-500/10 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <Button type="submit" disabled={isLoading} size="lg" className="w-full">
        {isLoading ? 'Guardando...' : 'Guardar Podcast'}
      </Button>
    </form>
  )
}
