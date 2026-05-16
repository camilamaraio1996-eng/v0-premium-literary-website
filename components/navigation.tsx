'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NavigationProps {
  navItems?: Array<{ href: string; label: string }>
  siteTitle?: string
}

const defaultNavLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/libro', label: 'El Libro' },
  { href: '/diario', label: 'Blog' },
  { href: '/recomendaciones', label: 'Recomendaciones' },
  { href: '/autor', label: 'Autora' },
]

export function Navigation({ navItems = defaultNavLinks, siteTitle = 'Camila Maraio' }: NavigationProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Mobile: Single line layout */}
        <div className="lg:hidden">
          <div className="flex items-center justify-center pt-3 pb-2">
            <Link 
              href="/" 
              className="hover:opacity-75 transition-opacity"
            >
              <span className="font-serif text-sm tracking-wider text-primary">
                {siteTitle}
              </span>
            </Link>
          </div>
          
          {/* Mobile Navigation Links - single line with elegant separators */}
          <nav className="flex items-center justify-center flex-nowrap gap-1 sm:gap-1.5 pb-2 px-1">
            {navItems.map((link, index) => (
              <React.Fragment key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'text-[9px] sm:text-[10px] tracking-[0.05em] uppercase transition-colors duration-300 hover:text-primary whitespace-nowrap',
                    pathname === link.href
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
                {index < navItems.length - 1 && (
                  <span className="text-muted-foreground/30 text-[8px] mx-0.5">—</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Desktop: Horizontal layout */}
        <div className="hidden lg:flex items-center justify-between pt-6 pb-4">
          <Link 
            href="/" 
            className="hover:opacity-75 transition-opacity"
          >
            <span className="font-serif text-lg tracking-wide text-primary">
              {siteTitle}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((link, index) => (
              <React.Fragment key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'text-sm tracking-wider uppercase transition-all duration-300 whitespace-nowrap',
                    pathname === link.href
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
                {index < navItems.length - 1 && (
                  <span className="text-muted-foreground/25 text-xs mx-2">—</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
