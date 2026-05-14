'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { SmartTextarea } from './smart-input'
import { updateSiteSettings } from '@/app/admin/actions'

interface SiteSettings {
  [key: string]: string
}

function Field({ label, id, value, onChange, placeholder, type = 'text', hint }: {
  label: string
  id: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  type?: string
  hint?: string
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1 block">{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  )
}

export function AdminSettingsForm({ settings }: { settings: SiteSettings }) {
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
        setMessage('Configuracion actualizada correctamente')
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

      {/* Site general */}
      <Card>
        <CardHeader><CardTitle>General del Sitio</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Titulo del Sitio" id="site_title" value={get('site_title')} onChange={set('site_title')} placeholder="Camila Maraio" />
          <div>
            <Label htmlFor="site_description" className="mb-1 block">Descripcion del Sitio (SEO)</Label>
            <SmartTextarea id="site_description" value={get('site_description')} onChange={set('site_description')} placeholder="Descripcion para SEO" rows={3} showIssues={false} />
          </div>
        </CardContent>
      </Card>

      {/* Hero section */}
      <Card>
        <CardHeader><CardTitle>Pagina de Inicio — Hero</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Texto pequeño encima del titulo" id="hero_eyebrow" value={get('hero_eyebrow', 'Una novela de')} onChange={set('hero_eyebrow')} placeholder="Una novela de" />
          <Field label="Titulo principal" id="hero_title" value={get('hero_title')} onChange={set('hero_title')} placeholder="El Libro de los Sueños" />
          <div>
            <Label htmlFor="hero_description" className="mb-1 block">Descripcion / Bajada</Label>
            <SmartTextarea id="hero_description" value={get('hero_description')} onChange={set('hero_description')} placeholder="Un viaje a traves de..." rows={4} showQuality showIssues />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Boton principal — texto" id="hero_cta_primary_label" value={get('hero_cta_primary_label', 'Descubrir el Libro')} onChange={set('hero_cta_primary_label')} />
            <Field label="Boton principal — destino" id="hero_cta_primary_href" value={get('hero_cta_primary_href', '/libro')} onChange={set('hero_cta_primary_href')} placeholder="/libro" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Boton secundario — texto" id="hero_cta_secondary_label" value={get('hero_cta_secondary_label', 'Ir al Diario')} onChange={set('hero_cta_secondary_label')} />
            <Field label="Boton secundario — destino" id="hero_cta_secondary_href" value={get('hero_cta_secondary_href', '/diario')} onChange={set('hero_cta_secondary_href')} placeholder="/diario" />
          </div>
        </CardContent>
      </Card>

      {/* Home video + buy link */}
      <Card>
        <CardHeader><CardTitle>Pagina de Inicio — Video y Link de Compra</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="URL del Video (aparece sobre el link de compra)"
            id="home_video_url"
            value={get('home_video_url')}
            onChange={set('home_video_url')}
            placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
            hint="Compatible con YouTube, Vimeo o URL directa de video"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="URL del link de compra"
              id="home_buy_url"
              value={get('home_buy_url')}
              onChange={set('home_buy_url')}
              placeholder="https://tienda.orsai.org/..."
              hint="Deja vacio para ocultar el boton"
            />
            <Field label="Texto del boton de compra" id="home_buy_label" value={get('home_buy_label', 'Comprar el Libro')} onChange={set('home_buy_label')} placeholder="Comprar el Libro" />
          </div>
        </CardContent>
      </Card>

      {/* Book page buy link */}
      <Card>
        <CardHeader><CardTitle>Pagina del Libro — Link de Compra</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="URL del link de compra"
              id="book_buy_url"
              value={get('book_buy_url')}
              onChange={set('book_buy_url')}
              placeholder="https://tienda.orsai.org/..."
              hint="Deja vacio para ocultar el boton"
            />
            <Field label="Texto del boton de compra" id="book_buy_label" value={get('book_buy_label', 'Comprar Ahora')} onChange={set('book_buy_label')} placeholder="Comprar Ahora" />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardHeader><CardTitle>Etiquetas de Navegacion</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'nav_inicio', default: 'Inicio' },
            { key: 'nav_libro', default: 'El Libro' },
            { key: 'nav_diario', default: 'Diario' },
            { key: 'nav_recomendaciones', default: 'Recomendaciones' },
            { key: 'nav_autor', default: 'Autora' },
            { key: 'nav_contacto', default: 'Contacto' },
          ].map(({ key, default: def }) => (
            <Field
              key={key}
              label={def}
              id={key}
              value={get(key, def)}
              onChange={set(key)}
              placeholder={def}
            />
          ))}
        </CardContent>
      </Card>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.startsWith('Error') ? 'bg-red-500/10 text-red-700' : 'bg-green-500/10 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <Button type="submit" disabled={isLoading} size="lg" className="w-full">
        {isLoading ? 'Guardando...' : 'Guardar Configuracion'}
      </Button>
    </form>
  )
}
