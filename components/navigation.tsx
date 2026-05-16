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
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: Stacked layout */}
        <div className="lg:hidden">
          <div className="flex items-center justify-center pt-3 pb-2 sm:pt-4 sm:pb-3">
            <Link 
              href="/" 
              className="hover:opacity-75 transition-opacity"
            >
              <span className="font-serif text-sm sm:text-base tracking-wider text-primary">
                {siteTitle}
              </span>
            </Link>
          </div>
          
          {/* Mobile Navigation Links - Wrapped with proper spacing */}
          <div className="flex flex-wrap justify-center gap-x-2 sm:gap-x-3 gap-y-1.5 pb-2 sm:pb-3 px-2">
            {navItems.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-[10px] sm:text-xs tracking-[0.1em] uppercase link-underline transition-colors whitespace-nowrap',
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
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

          <div className="flex items-center gap-8">
            {navItems.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm tracking-wider uppercase link-underline transition-colors',
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
