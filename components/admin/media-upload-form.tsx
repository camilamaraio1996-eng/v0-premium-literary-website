'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X, Copy, Check, Play } from 'lucide-react'
import Image from 'next/image'

interface MediaUploadFormProps {
  onCoverChange: (url: string) => void
  onVideoChange: (url: string) => void
  currentCoverUrl?: string | null
  currentVideoUrl?: string | null
}

export function MediaUploadForm({
  onCoverChange,
  onVideoChange,
  currentCoverUrl,
  currentVideoUrl,
}: MediaUploadFormProps) {
  const [coverUrl, setCoverUrl] = useState(currentCoverUrl || '')
  const [videoUrl, setVideoUrl] = useState(currentVideoUrl || '')
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url')
  const [copiedCover, setCopiedCover] = useState(false)
  const [copiedVideo, setCopiedVideo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCoverUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setCoverUrl(url)
    onCoverChange(url)
  }

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setVideoUrl(url)
    onVideoChange(url)
  }

  const copyCoverUrl = () => {
    if (coverUrl) {
      navigator.clipboard.writeText(coverUrl)
      setCopiedCover(true)
      setTimeout(() => setCopiedCover(false), 2000)
    }
  }

  const copyVideoUrl = () => {
    if (videoUrl) {
      navigator.clipboard.writeText(videoUrl)
      setCopiedVideo(true)
      setTimeout(() => setCopiedVideo(false), 2000)
    }
  }

  const clearCover = () => {
    setCoverUrl('')
    onCoverChange('')
  }

  const clearVideo = () => {
    setVideoUrl('')
    onVideoChange('')
  }

  return (
    <div className="space-y-6">
      {/* Cover Image Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Portada del Libro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sube una imagen para la portada del libro. Recomendado: 400x600px
          </p>

          <div className="space-y-3">
            <Label>URL de la Imagen</Label>
            <div className="flex gap-2">
              <Input
                value={coverUrl}
                onChange={handleCoverUrlChange}
                placeholder="https://ejemplo.com/portada.jpg"
                type="url"
              />
              {coverUrl && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyCoverUrl}
                    title="Copiar URL"
                  >
                    {copiedCover ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={clearCover}
                    className="text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Preview */}
          {coverUrl && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Vista Previa:</p>
              <div className="relative w-32 h-48 bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={coverUrl}
                  alt="Portada previa"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement
                    img.style.display = 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-3">
              💡 Consejos:
              <br />• Usa Vercel Blob, Cloudinary, o un storage en la nube
              <br />• Asegúrate que la URL sea accesible públicamente
              <br />• Los formatos recomendados son JPG o PNG
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Video Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Video del Libro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Agrega un video de YouTube, Vimeo o URL directa para presentar el libro.
          </p>

          <div className="space-y-3">
            <Label>URL del Video</Label>
            <Input
              value={videoUrl}
              onChange={handleVideoUrlChange}
              placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
              type="url"
            />
          </div>

          {/* Supported formats info */}
          <div className="bg-accent/5 p-3 rounded-lg space-y-2">
            <p className="text-sm font-medium">Formatos Soportados:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✓ YouTube: youtube.com/watch?v=... o youtu.be/...</li>
              <li>✓ Vimeo: vimeo.com/... o player.vimeo.com/video/...</li>
              <li>✓ URL directa: video.mp4, .webm, etc.</li>
            </ul>
          </div>

          {videoUrl && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Vista Previa:</p>
              <div className="relative w-full bg-muted rounded-lg overflow-hidden aspect-video border border-border">
                {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={
                      videoUrl.includes('youtu.be/')
                        ? `https://www.youtube.com/embed/${videoUrl.split('youtu.be/')[1].split('?')[0]}`
                        : videoUrl.includes('youtube.com/embed/')
                          ? videoUrl
                          : `https://www.youtube.com/embed/${videoUrl.split('v=')[1].split('&')[0]}`
                    }
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : videoUrl.includes('vimeo.com') ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${videoUrl.split('/').pop()?.split('?')[0]}`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={videoUrl} className="w-full h-full object-cover" controls />
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearVideo}
                className="text-destructive"
              >
                <X className="w-4 h-4 mr-2" />
                Eliminar Video
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
