'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function RecommendationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log completo del error
    const errorDetails = {
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      digest: error?.digest || 'No digest',
      timestamp: new Date().toISOString(),
      isDev: process.env.NODE_ENV === 'development',
    }
    
    console.error('[v0-recommendations-error] Error boundary caught:', errorDetails)
    
    // En desarrollo, mostrar detalles completos
    if (process.env.NODE_ENV === 'development') {
      console.group('📋 Detailed Error Information')
      console.error('Message:', errorDetails.message)
      console.error('Stack:', errorDetails.stack)
      console.error('Digest:', errorDetails.digest)
      console.groupEnd()
    }
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-card/50 border border-border rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>

          <h1 className="font-serif text-2xl text-primary mb-2">
            Error al cargar Recomendaciones
          </h1>

          <p className="text-muted-foreground text-sm mb-6">
            Hubo un problema al intentar cargar la página de recomendaciones.
          </p>

          <div className="bg-destructive/5 border border-destructive/20 rounded p-4 mb-6 text-left">
            <p className="text-xs font-mono text-destructive/80 break-words">
              {error?.message || 'Error desconocido'}
            </p>
            {error?.digest && (
              <p className="text-xs text-muted-foreground mt-2 break-all">
                Código: {error.digest}
              </p>
            )}
            {process.env.NODE_ENV === 'development' && error?.stack && (
              <details className="mt-4">
                <summary className="text-xs font-medium cursor-pointer text-muted-foreground hover:text-foreground">
                  Stack trace (desarrollo)
                </summary>
                <pre className="text-xs mt-2 bg-background/50 p-2 rounded overflow-auto max-h-40">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>

          <div className="flex gap-3 flex-col sm:flex-row">
            <Button
              onClick={reset}
              className="flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Intentar de nuevo
            </Button>
            <Button variant="outline" asChild className="flex items-center justify-center gap-2">
              <Link href="/admin">
                <Home className="w-4 h-4" />
                Volver al Dashboard
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground/60 mt-6">
            Si el problema persiste, contacta al soporte técnico.
          </p>
        </div>
      </div>
    </div>
  )
}
