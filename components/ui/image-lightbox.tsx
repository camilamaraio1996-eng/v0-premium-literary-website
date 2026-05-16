'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageLightboxProps {
  imageUrl: string | null
  alt: string
  children: React.ReactNode
}

export function ImageLightbox({ imageUrl, alt, children }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  if (!imageUrl) {
    return <>{children}</>
  }

  return (
    <>
      {/* Trigger - Wraps children with pointer and very subtle hover */}
      <div
        ref={triggerRef}
        className="cursor-pointer group transition-opacity duration-300 hover:opacity-90"
        onClick={() => {
          setImageLoaded(false)
          setIsOpen(true)
        }}
        role="button"
        tabIndex={0}
        aria-label={`Ampliar imagen: ${alt}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setImageLoaded(false)
            setIsOpen(true)
          }
        }}
      >
        {/* Subtle scale on hover */}
        <div className="transition-transform duration-400 group-hover:scale-[1.01]">
          {children}
        </div>
      </div>

      {/* Premium Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with warm editorial overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-0 z-50 pointer-events-auto"
              onClick={() => setIsOpen(false)}
              style={{
                backgroundColor: 'rgba(20, 16, 14, 0.55)',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
              }}
            >
              {/* Modal content - Click stop propagation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.23, 1, 0.320, 1], // custom cubic-bezier for smooth elegant feel
                  }}
                  className="relative w-full h-full max-w-2xl max-h-[95vh] pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button - Minimalista */}
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                    onClick={() => setIsOpen(false)}
                    className="absolute -top-16 sm:top-6 right-0 sm:right-6 p-2 text-foreground/40 hover:text-foreground/70 transition-colors duration-200 z-10 group"
                    aria-label="Cerrar"
                  >
                    <X
                      size={24}
                      strokeWidth={1.5}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </motion.button>

                  {/* Image Container - Premium styling */}
                  <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
                    {/* Soft shadow and warm border aesthetic */}
                    <div
                      className="relative w-full h-full"
                      style={{
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.1)',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.02)',
                      }}
                    >
                      <Image
                        src={imageUrl}
                        alt={alt}
                        fill
                        className="object-contain"
                        quality={95}
                        priority
                        sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), 900px"
                        onLoad={() => setImageLoaded(true)}
                      />

                      {/* Loading state - elegant fade */}
                      <AnimatePresence>
                        {!imageLoaded && (
                          <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/10 flex items-center justify-center"
                          >
                            <div className="w-8 h-8 border border-foreground/10 rounded-full animate-spin" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
