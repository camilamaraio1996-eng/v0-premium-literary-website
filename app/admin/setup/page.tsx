'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [credentials, setCredentials] = useState<{
    email: string
    password: string
  } | null>(null)
  const [error, setError] = useState('')

  const handleCreateAdmin = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      setCredentials({
        email: data.email,
        password: data.password,
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-primary mb-2">
            Camila Maraio
          </h1>
          <p className="text-sm text-muted-foreground">
            Configuración del Panel Admin
          </p>
        </div>

        {!success ? (
          <div className="bg-card rounded-lg p-8 border border-border">
            <h2 className="font-serif text-xl text-primary mb-4">
              Crear Usuario Admin
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Haz clic para crear automáticamente un usuario administrador con
              credenciales de prueba.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              onClick={handleCreateAdmin}
              disabled={loading}
              className="w-full"
            >
              {loading
                ? 'Creando usuario...'
                : 'Crear Usuario Admin'}
            </Button>

            <div className="mt-6 text-center">
              <Link
                href="/admin/login"
                className="text-sm text-primary hover:underline"
              >
                Ir al login
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg p-8 border border-border">
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              ✅ Usuario admin creado exitosamente
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs uppercase tracking-wide text-muted-foreground block mb-2">
                  Email
                </label>
                <div className="bg-secondary/20 border border-border rounded px-3 py-2 font-mono text-sm">
                  {credentials?.email}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-muted-foreground block mb-2">
                  Contraseña
                </label>
                <div className="bg-secondary/20 border border-border rounded px-3 py-2 font-mono text-sm">
                  {credentials?.password}
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-6">
              Guarda estas credenciales en un lugar seguro. Puedes cambiar la
              contraseña después de iniciar sesión.
            </p>

            <Button
              asChild
              className="w-full"
            >
              <Link href="/admin/login">
                Ir a Login
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
