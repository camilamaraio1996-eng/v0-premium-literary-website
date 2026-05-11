'use client'

import { useState, useRef } from 'react'
import { Upload, X, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al subir archivo')
      }

      const data = await response.json()
      onChange(data.url)
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
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
          {isUploading ? 'Subiendo...' : `Subir ${type === 'image' ? 'Imagen' : 'Video'}`}
        </Button>
      </div>

      {/* Preview */}
      {value && (
        <div className="mt-4">
          <p className="text-xs font-medium mb-2">Vista previa:</p>
          {type === 'image' ? (
            <div className="relative w-full max-h-64 bg-muted rounded-lg overflow-hidden">
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                crossOrigin="anonymous"
              />
            </div>
          ) : (
            <video
              src={value}
              controls
              className="w-full max-h-64 bg-muted rounded-lg"
            />
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}
