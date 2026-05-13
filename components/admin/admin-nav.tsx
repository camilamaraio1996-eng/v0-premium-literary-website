'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Settings, LayoutDashboard, FileText, BookOpen, Mail, Users, LogOut, Home, Heart, FileJson, Menu, X } from 'lucide-react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }
  
  return (
    <>
      <header className="border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="font-serif text-lg text-primary whitespace-nowrap">
                Admin
              </Link>
              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors whitespace-nowrap',
                        isActive
                          ? 'bg-secondary text-primary'
                          : 'text-muted-foreground hover:text-primary hover:bg-secondary/50'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden xl:inline">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Ver Sitio</span>
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground hidden md:block max-w-[200px] truncate">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:flex">
                <LogOut className="w-4 h-4" />
              </Button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-primary hover:text-accent transition-colors"
                aria-label="Menú"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-card/50">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                    isActive
                      ? 'bg-secondary text-primary'
                      : 'text-muted-foreground hover:text-primary hover:bg-secondary/50'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-border mt-2 space-y-2">
              <Button asChild variant="ghost" size="sm" className="w-full justify-start sm:hidden">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Home className="w-4 h-4 mr-2" />
                  Ver Sitio
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start sm:hidden"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
              <div className="text-xs text-muted-foreground px-3 py-2">
                {user.email}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
