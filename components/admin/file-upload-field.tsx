'use client'

import { useState, useRef } from 'react'
import { Upload, X, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { uploadFile } from '@/app/admin/actions'

interface FileUploadFieldProps {
  label: string
  value?: string | null
  onChange: (url: string) => void
  bucketName?: 'book-images' | 'book-videos' | 'blog-images'
  accept?: string
  maxSize?: number
  helpText?: string
}

export function FileUploadField({
  label,
  value,
  onChange,
  bucketName = 'book-images',
  accept = 'image/jpeg,image/png,image/webp',
  maxSize = 5 * 1024 * 1024,
  helpText,
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
      console.log('[v0] Uploading file:', { name: file.name, size: file.size, type: file.type })
      
      // Call server action to upload
      const result = await uploadFile(file, bucketName)

      if (!result.success) {
        setError(result.message)
        setIsUploading(false)
        return
      }

      console.log('[v0] Upload successful, URL:', result.url)
      setUploadProgress(100)
      onChange(result.url!)

      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      console.error('[v0] Upload error:', err)
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

  const isImage = bucketName !== 'book-videos'

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">{label}</label>
        {helpText && <p className="text-xs text-muted-foreground mb-2">{helpText}</p>}
      </div>

      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Pega la URL pública...`}
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
          {isUploading ? `Subiendo ${uploadProgress}%...` : `Subir ${isImage ? 'Imagen' : 'Video'}`}
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
          ✓ {isImage ? 'Imagen' : 'Video'} cargado exitosamente
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-4">
          <p className="text-xs font-medium mb-2">Vista previa:</p>
          {isImage ? (
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
