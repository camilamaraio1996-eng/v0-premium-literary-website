'use server'

import { createClient } from '@supabase/supabase-js'

export async function createAdminUser() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return {
      error: 'Missing environment variables',
    }
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  const email = 'admin@ejemplo.com'
  const password = 'Admin123456!'

  try {
    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const userExists = existingUser?.users?.some((u) => u.email === email)

    if (userExists) {
      return {
        success: true,
        message: 'Usuario admin ya existe',
        email,
      }
    }

    // Crear nuevo usuario
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        is_admin: true,
      },
    })

    if (error) {
      return {
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Usuario admin creado exitosamente',
      email,
      password,
    }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Error desconocido',
    }
  }
}
