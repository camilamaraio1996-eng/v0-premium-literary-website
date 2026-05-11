'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload } from 'lucide-react'
import Image from 'next/image'

interface BookInfo {
  id: string
  title: string
  subtitle: string | null
  author_name: string | null
  cover_image_url: string | null
  description: string | null
}

export function AdminBookForm({ book }: { book: BookInfo }) {
  const [formData, setFormData] = useState(book)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('book_info')
        .update(formData)
        .eq('id', book.id)

      if (error) throw error
      setMessage('✓ Libro actualizado correctamente')
    } catch (err: any) {
      setMessage(`✗ Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Libro</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del libro"
              rows={6}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">URL de Portada</label>
            <Input
              value={formData.cover_image_url || ''}
              onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
              placeholder="https://ejemplo.com/portada.jpg"
            />
            {formData.cover_image_url && (
              <div className="mt-4 relative w-32 h-48 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={formData.cover_image_url}
                  alt="Portada"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {message && (
            <div className="p-3 rounded-lg text-sm bg-accent/10 text-accent">
              {message}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
