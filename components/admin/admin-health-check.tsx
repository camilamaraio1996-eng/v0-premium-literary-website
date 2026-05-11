'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'

interface HealthData {
  status: string
  data: {
    settings: any[]
    bookInfo: any[]
    fragmentsCount: number
    lastUpdated: string
  }
  checks: {
    settingsOk: boolean
    bookInfoOk: boolean
    fragmentsOk: boolean
  }
}

export function AdminHealthCheck() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const checkHealth = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/health')
      if (!response.ok) throw new Error('Health check failed')
      
      const data = await response.json()
      setHealth(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Estado del Sistema</CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={checkHealth}
          disabled={isLoading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {isLoading ? 'Verificando...' : 'Verificar'}
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 text-red-700 mb-4">
            Error: {error}
          </div>
        )}

        {health && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  {health.checks.settingsOk ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">Configuración</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {health.data?.settings?.length ?? 0} configuraciones
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  {health.checks.bookInfoOk ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">Libro</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {health.data?.bookInfo?.length ?? 0} entrada
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  {health.checks.fragmentsOk ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">Fragmentos</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {health.data?.fragmentsCount ?? 0} publicados
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted text-xs font-mono text-muted-foreground">
              Última verificación: {health.data?.lastUpdated ? new Date(health.data.lastUpdated).toLocaleTimeString() : '-'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
