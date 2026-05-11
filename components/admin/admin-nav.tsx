'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Settings, LayoutDashboard, FileText, BookOpen, Mail, Users, LogOut, Home, Heart, FileJson } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/settings', label: 'Configuración', icon: Settings },
  { href: '/admin/book', label: 'Editar Libro', icon: BookOpen },
  { href: '/admin/fragments-edit', label: 'Fragmentos', icon: FileText },
  { href: '/admin/pages', label: 'Páginas', icon: FileJson },
  { href: '/admin/posts', label: 'Entradas', icon: FileText },
  { href: '/admin/recommendations', label: 'Recomendaciones', icon: Heart },
  { href: '/admin/preorders', label: 'Reservas', icon: Users },
  { href: '/admin/messages', label: 'Mensajes', icon: Mail },
]

interface AdminNavProps {
  user: User
}

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }
  
  return (
    <header className="border-b border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-serif text-lg text-primary">
              Admin
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                      isActive
                        ? 'bg-secondary text-primary'
                        : 'text-muted-foreground hover:text-primary hover:bg-secondary/50'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Ver Sitio
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
