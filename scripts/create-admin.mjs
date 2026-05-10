#!/usr/bin/env node

/**
 * Script para crear un usuario admin en Supabase
 * Uso: node create-admin.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_KEY) {
  console.error('Error: Falta configurar variables de entorno.')
  console.error('Necesitas:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

async function createAdminUser() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  const email = 'admin@ejemplo.com'
  const password = 'Admin123456' // Cambia esto a una contraseña segura

  console.log(`Creando usuario admin con email: ${email}`)

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        is_admin: true,
      },
    })

    if (error) {
      console.error('Error creando usuario:', error.message)
      process.exit(1)
    }

    console.log('✅ Usuario admin creado exitosamente')
    console.log(`📧 Email: ${email}`)
    console.log(`🔐 Contraseña: ${password}`)
    console.log('\nPuedes cambiar la contraseña en /admin/login')
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  }
}

createAdminUser()
