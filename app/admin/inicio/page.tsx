'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUploadField } from '@/components/admin/file-upload-field'
import { HeroSection } from '@/components/home/hero-section'
import { BookVideo } from '@/components/book/book-video'
import { updateSiteSettings } from '@/app/admin/actions'

interface InicioEditorProps {
  settings: Record<string, string>
}

export default function InicioEditor({ settings }: InicioEditorProps) {
  const [formData, setFormData] = useState(settings)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const result = await updateSiteSettings(formData)
      if (result.success) {
        setMessage('Página de inicio actualizada correctamente')
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
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-background">
              <HeroSection
                eyebrow={formData['hero_eyebrow'] || 'Una novela de'}
                title={formData['hero_title']}
                description={formData['hero_description']}
                imageUrl={formData['home_hero_image_url']}
                imageAlt={formData['home_hero_image_alt']}
                ctaPrimaryLabel={formData['hero_cta_primary_label']}
                ctaPrimaryHref={formData['hero_cta_primary_href']}
                ctaSecondaryLabel={formData['hero_cta_secondary_label']}
                ctaSecondaryHref={formData['hero_cta_secondary_href']}
                videoUrl={formData['home_video_url']}
                buyUrl={formData['home_buy_url']}
                buyLabel={formData['home_buy_label']}
              />

              {formData['home_video_url'] && (
                <div className="border-t">
                  <BookVideo videoUrl={formData['home_video_url']} title={formData['home_video_section_title']} />
                </div>
              )}

              {formData['home_buy_url'] && (
                <div className="border-t py-16 px-6 text-center">
                  <a
                    href={formData['home_buy_url']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-3 bg-primary text-primary-foreground uppercase text-xs tracking-[0.15em] hover:bg-accent transition-colors"
                  >
                    {formData['home_buy_label'] || 'Comprar el Libro'}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Sección Hero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Eyebrow (Subtítulo pequeño)</label>
              <Input
                value={formData['hero_eyebrow'] || ''}
                onChange={(e) => setFormData({ ...formData, 'hero_eyebrow': e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Título Principal</label>
              <Textarea
                value={formData['hero_title'] || ''}
                onChange={(e) => setFormData({ ...formData, 'hero_title': e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Descripción</label>
              <Textarea
                value={formData['hero_description'] || ''}
                onChange={(e) => setFormData({ ...formData, 'hero_description': e.target.value })}
                rows={3}
              />
            </div>

            <FileUploadField
              label="Imagen del Hero"
              type="image"
              value={formData['home_hero_image_url'] || ''}
              onChange={(url) => setFormData({ ...formData, 'home_hero_image_url': url })}
            />

            <div>
              <label className="text-sm font-medium mb-2 block">Alt Text de Imagen</label>
              <Input
                value={formData['home_hero_image_alt'] || ''}
                onChange={(e) => setFormData({ ...formData, 'home_hero_image_alt': e.target.value })}
                placeholder="Descripción de la imagen para accesibilidad"
              />
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Botones de Llamada a la Acción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Botón Principal - Texto</label>
              <Input
                value={formData['hero_cta_primary_label'] || ''}
                onChange={(e) => setFormData({ ...formData, 'hero_cta_primary_label': e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Botón Principal - URL</label>
              <Input
                value={formData['hero_cta_primary_href'] || ''}
                onChange={(e) => setFormData({ ...formData, 'hero_cta_primary_href': e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Botón Secundario - Texto</label>
              <Input
                value={formData['hero_cta_secondary_label'] || ''}
                onChange={(e) => setFormData({ ...formData, 'hero_cta_secondary_label': e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Botón Secundario - URL</label>
              <Input
                value={formData['hero_cta_secondary_href'] || ''}
                onChange={(e) => setFormData({ ...formData, 'hero_cta_secondary_href': e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Video Section */}
        <Card>
          <CardHeader>
            <CardTitle>Sección de Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Título de la Sección</label>
              <Input
                value={formData['home_video_section_title'] || ''}
                onChange={(e) => setFormData({ ...formData, 'home_video_section_title': e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Descripción del Video</label>
              <Textarea
                value={formData['home_video_description'] || ''}
                onChange={(e) => setFormData({ ...formData, 'home_video_description': e.target.value })}
                rows={2}
              />
            </div>

            <FileUploadField
              label="URL o Archivo del Video"
              type="video"
              value={formData['home_video_url'] || ''}
              onChange={(url) => setFormData({ ...formData, 'home_video_url': url })}
            />
          </CardContent>
        </Card>

        {/* Buy Section */}
        <Card>
          <CardHeader>
            <CardTitle>Sección de Compra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Texto del Botón de Compra</label>
              <Input
                value={formData['home_buy_label'] || ''}
                onChange={(e) => setFormData({ ...formData, 'home_buy_label': e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">URL de Compra</label>
              <Input
                value={formData['home_buy_url'] || ''}
                onChange={(e) => setFormData({ ...formData, 'home_buy_url': e.target.value })}
                placeholder="https://tienda.com/comprar"
              />
            </div>
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
