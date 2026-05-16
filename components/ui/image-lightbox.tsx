'use client'

import { useState, useEffect } from 'react'
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
      {/* Trigger - Wraps children with pointer and hover effects */}
      <div
        className="cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Ampliar imagen: ${alt}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(true)
          }
        }}
      >
        {children}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-2xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-12 right-0 sm:top-4 sm:right-4 p-2 text-white/60 hover:text-white transition-colors z-10"
                aria-label="Cerrar"
              >
                <X size={28} />
              </button>

              {/* Image Container */}
              <div className="relative w-full h-auto rounded-lg overflow-hidden shadow-2xl bg-black/10">
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={imageUrl}
                    alt={alt}
                    fill
                    className="object-contain"
                    quality={90}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 600px"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
