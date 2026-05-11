'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { updateSiteSettings } from '@/app/admin/actions'

interface SiteSettings {
  [key: string]: string
}

export function AdminSettingsForm({ settings }: { settings: SiteSettings }) {
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
        setMessage('✓ Configuración actualizada correctamente')
        // Refresh page to show updated data
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setMessage(`✗ Error: ${result.message}`)
      }
    } catch (err: any) {
      setMessage(`✗ Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración del Sitio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="site_title">Título del Sitio</Label>
            <Input
              id="site_title"
              value={formData.site_title || ''}
              onChange={(e) =>
                setFormData({ ...formData, site_title: e.target.value })
              }
              placeholder="El Libro de los Sueños"
            />
          </div>

          <div>
            <Label htmlFor="site_description">Descripción del Sitio</Label>
            <Textarea
              id="site_description"
              value={formData.site_description || ''}
              onChange={(e) =>
                setFormData({ ...formData, site_description: e.target.value })
              }
              placeholder="Descripción para SEO"
              rows={3}
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Menús de Navegación</h3>
            {['inicio', 'libro', 'diario', 'recomendaciones', 'autor', 'contacto'].map(
              (menu) => (
                <div key={menu} className="mb-4">
                  <Label htmlFor={`nav_${menu}`}>
                    {menu.charAt(0).toUpperCase() + menu.slice(1)}
                  </Label>
                  <Input
                    id={`nav_${menu}`}
                    value={formData[`nav_${menu}`] || menu.charAt(0).toUpperCase() + menu.slice(1)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`nav_${menu}`]: e.target.value,
                      })
                    }
                  />
                </div>
              )
            )}
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('✓') 
                ? 'bg-green-500/10 text-green-700' 
                : 'bg-red-500/10 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
