'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { Trash2, Plus } from 'lucide-react'

interface Fragment {
  id: string
  sort_order: number
  title: string
  description: string
  content: string | null
  image_url: string | null
}

export function AdminFragmentsForm({ fragments: initialFragments }: { fragments: Fragment[] }) {
  const [fragments, setFragments] = useState(initialFragments)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

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
      for (const fragment of fragments) {
        const { error } = await supabase
          .from('book_fragments')
          .update({
            title: fragment.title,
            description: fragment.description,
            content: fragment.content,
            image_url: fragment.image_url,
            sort_order: fragment.sort_order,
          })
          .eq('id', fragment.id)

        if (error) throw error
      }
      setMessage('✓ Fragmentos actualizados correctamente')
    } catch (err: any) {
      setMessage(`✗ Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('book_fragments').delete().eq('id', id)
      setFragments(fragments.filter((f) => f.id !== id))
      setMessage('✓ Fragmento eliminado')
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
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(fragment.id)}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Orden</Label>
                <Input
                  type="number"
                  value={fragment.sort_order}
                  onChange={(e) =>
                    handleChange(fragment.id, 'sort_order', parseInt(e.target.value))
                  }
                />
              </div>
              <div>
                <Label>Título</Label>
                <Input
                  value={fragment.title}
                  onChange={(e) => handleChange(fragment.id, 'title', e.target.value)}
                  placeholder="Título del fragmento"
                />
              </div>
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea
                value={fragment.description}
                onChange={(e) => handleChange(fragment.id, 'description', e.target.value)}
                placeholder="Descripción breve"
                rows={2}
              />
            </div>

            <div>
              <Label>Contenido Completo</Label>
              <Textarea
                value={fragment.content || ''}
                onChange={(e) => handleChange(fragment.id, 'content', e.target.value)}
                placeholder="Texto completo del fragmento"
                rows={6}
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
        <div className="p-3 rounded-lg text-sm bg-accent/10 text-accent">
          {message}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? 'Guardando...' : 'Guardar todos los Fragmentos'}
      </Button>
    </div>
  )
}
