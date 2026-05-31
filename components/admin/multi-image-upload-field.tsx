'use client'

import { useState, useRef } from 'react'
import { Upload, X, AlertCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

interface MultiImageUploadFieldProps {
  label: string
  value?: string[] | null
  onChange: (urls: string[]) => void
  bucketName?: 'book-images' | 'book-videos' | 'blog-images'
  accept?: string
  maxSize?: number
  helpText?: string
  maxImages?: number
}

export function MultiImageUploadField({
  label,
  value = [],
  onChange,
  bucketName = 'blog-images',
  accept = 'image/jpeg,image/png,image/webp',
  maxSize = 5 * 1024 * 1024,
  helpText,
  maxImages = 10,
}: MultiImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const images = value || []

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      if (images.length >= maxImages) {
        setError(`Máximo ${maxImages} imágenes permitidas`)
        break
      }

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

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }))
          setError(errorData?.message || `Error al subir`)
          setIsUploading(false)
          continue
        }

        const result = await response.json()
        if (!result.success) {
          setError(result.message || 'Error al subir imagen')
          setIsUploading(false)
          continue
        }

        setUploadProgress(100)
        onChange([...images, result.url])

        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (err: any) {
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
          {images.length} / {maxImages} imágenes
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
          {isUploading ? `Subiendo ${uploadProgress}%...` : `Agregar Imagen${images.length < maxImages ? 's' : ''}`}
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

      {/* Image Gallery Preview - Thumbnails */}
      {images.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-3">Miniaturas de imágenes cargadas:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden border border-border/60 shadow-sm">
                  <Image
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-destructive/90"
                  title="Eliminar imagen"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
