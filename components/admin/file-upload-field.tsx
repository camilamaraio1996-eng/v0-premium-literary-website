'use client'

import { useState, useRef } from 'react'
import { Upload, X, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

interface FileUploadFieldProps {
  label: string
  value?: string | null
  onChange: (url: string) => void
  type?: 'image' | 'video'
  description?: string
  recommendedSize?: string
  accept?: string
}

export function FileUploadField({
  label,
  value,
  onChange,
  type = 'image',
  description,
  recommendedSize,
  accept = type === 'image' ? 'image/jpeg,image/png,image/webp' : 'video/mp4,video/webm,video/ogg',
}: FileUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError('')
    setUploadProgress(0)

    try {
      // Validar tamaño
      const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024 // 5MB para imágenes, 50MB para videos
      if (file.size > maxSize) {
        throw new Error(`Archivo debe ser menor a ${maxSize / 1024 / 1024}MB`)
      }

      // Validar tipo
      if (type === 'image' && !file.type.startsWith('image/')) {
        throw new Error('Por favor sube una imagen válida')
      }
      if (type === 'video' && !file.type.startsWith('video/')) {
        throw new Error('Por favor sube un video válido')
      }

      const supabase = createClient()

      // Crear nombre único
      const fileExt = file.name.split('.').pop()
      const fileName = `${type}-${uuidv4()}.${fileExt}`
      const bucketName = type === 'image' ? 'book-images' : 'book-videos'

      console.log('[v0] Subiendo a Supabase Storage:', { bucket: bucketName, file: fileName, size: file.size })

      // Subir a Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('[v0] Error de upload:', uploadError)
        throw new Error(uploadError.message || 'Error al subir archivo')
      }

      console.log('[v0] Upload exitoso:', data)
      setUploadProgress(100)

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName)

      const publicUrl = publicUrlData.publicUrl

      if (!publicUrl) {
        throw new Error('No se pudo generar la URL pública')
      }

      console.log('[v0] URL pública:', publicUrl)

      // Llamar onChange con la nueva URL
      onChange(publicUrl)

      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      console.error('[v0] Error:', err)
      setError(err.message || 'Error desconocido')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleCopyUrl = () => {
    if (value) {
      navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">{label}</label>
        {description && <p className="text-xs text-muted-foreground mb-2">{description}</p>}
        {recommendedSize && (
          <p className="text-xs text-muted-foreground mb-2">Recomendado: {recommendedSize}</p>
        )}
      </div>

      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Pega la URL pública del ${type === 'image' ? 'imagen' : 'video'}...`}
          className="flex-1"
        />
        {value && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCopyUrl}
            className="gap-1"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        )}
        {value && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onChange('')}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* File Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="gap-2 w-full"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? `Subiendo ${uploadProgress}%...` : `Subir ${type === 'image' ? 'Imagen' : 'Video'}`}
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
        <div className="p-3 bg-red-500/10 text-red-700 text-sm rounded-lg border border-red-200">
          <p className="font-medium">Error al subir:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Success Message */}
      {!isUploading && !error && value && (
        <div className="p-3 bg-green-500/10 text-green-700 text-sm rounded-lg border border-green-200">
          ✓ {type === 'image' ? 'Imagen' : 'Video'} cargado exitosamente
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-4">
          <p className="text-xs font-medium mb-2">Vista previa:</p>
          {type === 'image' ? (
            <div className="relative w-full max-h-64 bg-muted rounded-lg overflow-hidden border border-border">
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <video
              src={value}
              controls
              className="w-full max-h-64 bg-muted rounded-lg border border-border"
            />
          )}
        </div>
      )}
    </div>
  )
}
