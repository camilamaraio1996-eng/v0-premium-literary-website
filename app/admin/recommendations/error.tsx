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
    // Loguear error para debugging
    console.error('[v0-admin-error] Recommendations page error:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    })
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
            <p className="text-xs font-mono text-destructive/80">
              {error?.message || 'Error desconocido'}
            </p>
            {error?.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Código: {error.digest}
              </p>
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
