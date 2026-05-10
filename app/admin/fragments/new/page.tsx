'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft } from 'lucide-react'

export default function NewFragmentPage() {
  const [title, setTitle] = useState('')
  const [chapterNumber, setChapterNumber] = useState<number | ''>('')
  const [content, setContent] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const supabase = createClient()
    
    const { error: insertError } = await supabase
      .from('book_fragments')
      .insert({
        title,
        chapter_number: chapterNumber || null,
        content,
        sort_order: sortOrder,
        published,
      })
    
    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }
    
    router.push('/admin/fragments')
    router.refresh()
  }
  
  return (
    <div>
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/fragments">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </Button>
        <h1 className="font-serif text-3xl text-primary">Nuevo Fragmento</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="El título del fragmento"
            required
            className="mt-1"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="chapterNumber">Número de Capítulo</Label>
            <Input
              id="chapterNumber"
              type="number"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(e.target.value ? parseInt(e.target.value) : '')}
              placeholder="1"
              min={1}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="sortOrder">Orden de Visualización</Label>
            <Input
              id="sortOrder"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              min={0}
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="content">Contenido</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="El texto del fragmento..."
            rows={15}
            required
            className="mt-1 font-serif"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            id="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor="published">Publicar inmediatamente</Label>
        </div>
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Fragmento'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/fragments">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
