'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { SmartTextarea } from './smart-input'
import Image from 'next/image'
import { Trash2, Plus } from 'lucide-react'
import { updateFragments, deleteFragment, createFragment } from '@/app/admin/actions'

interface Fragment {
  id: string
  sort_order: number
  title: string
  chapter_number: number | null
  content: string
  image_url: string | null
  published: boolean
}

export function AdminFragmentsForm({ fragments: initialFragments }: { fragments: Fragment[] }) {
  const [fragments, setFragments] = useState(initialFragments)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (id: string, field: string, value: any) => {
    setFragments(fragments.map((f) =>
      f.id === id ? { ...f, [field]: value } : f
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const result = await updateFragments(fragments)
      if (result.success) {
        setMessage('✓ Fragmentos actualizados correctamente')
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

  const handleCreate = async () => {
    try {
      const result = await createFragment()
      if (result.success && result.fragment) {
        setFragments([...fragments, result.fragment as Fragment])
        setMessage('✓ Fragmento creado. Rellena los campos y guarda.')
      } else {
        setMessage(`✗ Error: ${result.message}`)
      }
    } catch (err: any) {
      setMessage(`✗ Error: ${err.message}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este fragmento?')) return

    try {
      const result = await deleteFragment(id)
      if (result.success) {
        setFragments(fragments.filter((f) => f.id !== id))
        setMessage('✓ Fragmento eliminado correctamente')
      } else {
        setMessage(`✗ Error: ${result.message}`)
      }
    } catch (err: any) {
      setMessage(`✗ Error: ${err.message}`)
    }
  }

  return (
    <div className="space-y-6">
      {fragments.map((fragment, idx) => (
        <Card key={fragment.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">Fragmento {idx + 1}</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(fragment.id)}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Orden</Label>
                <Input
                  type="number"
                  value={fragment.sort_order ?? 0}
                  onChange={(e) =>
                    handleChange(fragment.id, 'sort_order', parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <Label>Número de Capítulo</Label>
                <Input
                  type="number"
                  value={fragment.chapter_number ?? ''}
                  onChange={(e) =>
                    handleChange(
                      fragment.id,
                      'chapter_number',
                      e.target.value === '' ? null : parseInt(e.target.value)
                    )
                  }
                  placeholder="Ej. 1"
                />
              </div>
              <div className="flex flex-col justify-end gap-1">
                <Label>Publicado</Label>
                <div className="flex items-center gap-2 h-10">
                  <input
                    type="checkbox"
                    id={`published-${fragment.id}`}
                    checked={fragment.published ?? false}
                    onChange={(e) =>
                      handleChange(fragment.id, 'published', e.target.checked)
                    }
                    className="w-4 h-4 accent-primary"
                  />
                  <label
                    htmlFor={`published-${fragment.id}`}
                    className="text-sm text-muted-foreground"
                  >
                    {fragment.published ? 'Visible en el sitio' : 'Oculto'}
                  </label>
                </div>
              </div>
            </div>

            <div>
              <Label>Título</Label>
              <Input
                value={fragment.title}
                onChange={(e) => handleChange(fragment.id, 'title', e.target.value)}
                placeholder="Título del fragmento"
              />
            </div>

            <div>
              <Label>Contenido</Label>
              <SmartTextarea
                value={fragment.content ?? ''}
                onChange={(v) => handleChange(fragment.id, 'content', v)}
                placeholder="Texto del fragmento..."
                rows={8}
                showQuality
                showIssues
              />
            </div>

            <div>
              <Label>URL de Imagen</Label>
              <Input
                value={fragment.image_url || ''}
                onChange={(e) => handleChange(fragment.id, 'image_url', e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {fragment.image_url && (
                <div className="mt-2 relative w-40 h-48 bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={fragment.image_url}
                    alt={fragment.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.includes('✓') 
            ? 'bg-green-500/10 text-green-700' 
            : 'bg-red-500/10 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={handleCreate}
          variant="outline"
          className="flex-1"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Fragmento
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1"
          size="lg"
        >
          {isLoading ? 'Guardando...' : 'Guardar todos los Fragmentos'}
        </Button>
      </div>
    </div>
  )
}
