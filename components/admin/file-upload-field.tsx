'use client'

import { useState, useRef } from 'react'
import { Upload, X, Copy, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { uploadFileAction } from '@/app/admin/upload-action'

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
    if (!file) {
      console.log('[v0 UPLOAD-UI] No file selected')
      return
    }

    setIsUploading(true)
    setError('')
    setUploadProgress(0)

    try {
      console.log('[v0 UPLOAD-UI] File selected, preparing upload:', {
        name: file.name,
        size: file.size,
        type: file.type,
        bucket: bucketName,
      })

      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucketName', bucketName)

      console.log('[v0 UPLOAD-UI] FormData created, calling API route...')
      
      // Simulated progress
      setUploadProgress(30)

      // Call API route with FormData
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
      })

      console.log('[v0 UPLOAD-UI] API response received:', {
        status: response.status,
        ok: response.ok,
      })

      if (!response.ok) {
        let errorData: any
        try {
          errorData = await response.json()
          console.error('[v0 UPLOAD-UI] API error response:', errorData)
        } catch (parseError) {
          console.error('[v0 UPLOAD-UI] Could not parse error response')
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` }
        }
        
        setError(errorData?.message || `Upload error: ${response.status}`)
        setIsUploading(false)
        return
      }

      let result
      try {
        result = await response.json()
        console.log('[v0 UPLOAD-UI] API JSON parsed:', {
          success: result.success,
          message: result.message,
          url: result.url ? result.url.substring(0, 50) + '...' : 'N/A',
        })
      } catch (parseError) {
        console.error('[v0 UPLOAD-UI] Failed to parse JSON response:', parseError)
        setError('Response JSON inválido del servidor')
        setIsUploading(false)
        return
      }

      if (!result.success) {
        setError(result.message || 'Error desconocido al subir archivo')
        console.error('[v0 UPLOAD-UI] Upload failed:', result.message)
        setIsUploading(false)
        return
      }

      setUploadProgress(100)

      if (!result.url) {
        setError('No se recibió URL de la respuesta del servidor')
        setIsUploading(false)
        return
      }

      console.log('[v0 UPLOAD-UI] Upload successful! URL:', result.url)
      onChange(result.url)

      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      console.error('[v0 UPLOAD-UI] CRITICAL ERROR:', {
        message: err?.message,
        code: err?.code,
        stack: err?.stack,
        name: err?.name,
      })
      setError(
        err?.message || 'Error crítico al subir archivo. Revisa la consola.'
      )
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

      {/* Error Message - Enhanced */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Error al subir archivo:</p>
              <p className="text-red-600">{error}</p>
              <p className="text-xs text-red-500 mt-2 opacity-75">
                Revisa la consola del navegador (F12) para más detalles
              </p>
            </div>
          </div>
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
