'use client'

import { useState, useRef } from 'react'
import { Upload, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface BlogImageUploadFieldProps {
  label: string
  value?: string[] | null
  onChange: (urls: string[]) => void
  bucketName?: 'blog-images'
  accept?: string
  maxSize?: number
  helpText?: string
}

export function BlogImageUploadField({
  label,
  value = [],
  onChange,
  bucketName = 'blog-images',
  accept = 'image/jpeg,image/png,image/webp',
  maxSize = 5 * 1024 * 1024,
  helpText,
}: BlogImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const images = value || []
  const maxImages = 3

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    console.log('[v0] Files selected:', { count: files.length, images: Array.from(files).map(f => f.name) })

    for (const file of Array.from(files)) {
      if (images.length >= maxImages) {
        setError(`Máximo ${maxImages} imágenes permitidas`)
        console.warn('[v0] Max images reached')
        break
      }

      console.log('[v0] Starting upload for file:', { name: file.name, size: file.size, type: file.type })

      setIsUploading(true)
      setError('')
      setUploadProgress(0)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucketName', bucketName)

        setUploadProgress(30)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        console.log('[v0] Upload response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }))
          console.error('[v0] Upload failed:', errorData)
          setError(errorData?.message || `Error al subir`)
          setIsUploading(false)
          continue
        }

        const result = await response.json()
        console.log('[v0] Upload result:', { success: result.success, url: result.url, fileName: result.fileName })

        if (!result.success) {
          console.error('[v0] Upload not successful:', result.message)
          setError(result.message || 'Error al subir imagen')
          setIsUploading(false)
          continue
        }

        setUploadProgress(100)
        const newImages = [...images, result.url]
        console.log('[v0] Images updated:', { count: newImages.length, urls: newImages })
        onChange(newImages)

        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (err: any) {
        console.error('[v0] Upload exception:', err)
        setError(err?.message || 'Error al subir')
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    }
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">{label}</label>
        {helpText && <p className="text-xs text-muted-foreground mb-2">{helpText}</p>}
        <p className="text-xs text-muted-foreground mb-2">
          {images.length} / {maxImages} imágenes — La primera imagen será la principal
        </p>
      </div>

      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading || images.length >= maxImages}
          multiple
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || images.length >= maxImages}
          className="gap-2 w-full"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? `Subiendo ${uploadProgress}%...` : `Subir Imagen${images.length < maxImages ? 's' : ''}`}
        </Button>
      </div>

      {/* Progress Bar */}
      {isUploading && uploadProgress > 0 && (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error:</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Preview - Labeled */}
      {images.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-3">Imágenes cargadas:</p>
          <div className="space-y-2">
            {images.map((url, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-lg border border-border/40 hover:border-border/60 transition-colors">
                {/* Thumbnail */}
                <div className="relative w-16 h-20 flex-shrink-0 bg-muted rounded overflow-hidden border border-border/30">
                  <Image
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 py-1">
                  <p className="text-sm font-medium text-primary">
                    {index === 0 ? 'Imagen Principal' : `Imagen Adicional ${index}`}
                  </p>
                  <p className="text-xs text-muted-foreground truncate break-all">{url}</p>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="mt-1 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                  title="Eliminar imagen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
