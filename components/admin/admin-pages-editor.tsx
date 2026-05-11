'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Trash2, Plus } from 'lucide-react'

interface PageSection {
  id: string
  page_slug: string
  section_key: string
  title?: string
  description?: string
  content?: string
  image_url?: string
  sort_order: number
}

const PAGES = [
  { slug: 'inicio', label: 'Inicio' },
  { slug: 'autor', label: 'Autora' },
]

export function AdminPagesEditor({ sections: initialSections }: { sections: Record<string, any[]> }) {
  const [sections, setSections] = useState(initialSections)
  const [selectedPage, setSelectedPage] = useState(PAGES[0].slug)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const pageSections = sections[selectedPage] || []

  const handleSectionChange = (sectionId: string, field: string, value: any) => {
    setSections({
      ...sections,
      [selectedPage]: pageSections.map((s) =>
        s.id === sectionId ? { ...s, [field]: value } : s
      ),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      for (const section of pageSections) {
        const { error } = await supabase
          .from('page_sections')
          .update({
            title: section.title,
            description: section.description,
            content: section.content,
            image_url: section.image_url,
            sort_order: section.sort_order,
          })
          .eq('id', section.id)

        if (error) throw error
      }
      setMessage('✓ Página actualizada correctamente')
    } catch (err: any) {
      setMessage(`✗ Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (sectionId: string) => {
    try {
      await supabase
        .from('page_sections')
        .delete()
        .eq('id', sectionId)
      
      setSections({
        ...sections,
        [selectedPage]: pageSections.filter((s) => s.id !== sectionId),
      })
      setMessage('✓ Sección eliminada')
    } catch (err: any) {
      setMessage(`✗ Error: ${err.message}`)
    }
  }

  return (
    <div>
      <Tabs value={selectedPage} onValueChange={setSelectedPage} className="mb-6">
        <TabsList>
          {PAGES.map((page) => (
            <TabsTrigger key={page.slug} value={page.slug}>
              {page.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-6">
        {pageSections.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">No hay secciones para esta página aún.</p>
            </CardContent>
          </Card>
        ) : (
          pageSections.map((section, idx) => (
            <Card key={section.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg">{section.section_key}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(section.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={section.title || ''}
                    onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                    placeholder="Título de la sección"
                  />
                </div>

                <div>
                  <Label>Descripción</Label>
                  <Textarea
                    value={section.description || ''}
                    onChange={(e) => handleSectionChange(section.id, 'description', e.target.value)}
                    placeholder="Descripción breve"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Contenido</Label>
                  <Textarea
                    value={section.content || ''}
                    onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                    placeholder="Contenido principal"
                    rows={6}
                  />
                </div>

                <div>
                  <Label>URL de Imagen</Label>
                  <Input
                    value={section.image_url || ''}
                    onChange={(e) => handleSectionChange(section.id, 'image_url', e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {message && (
          <div className="p-3 rounded-lg text-sm bg-accent/10 text-accent">
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
