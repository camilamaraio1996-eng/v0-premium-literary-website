'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Copy, Check, RotateCcw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const DISCOUNT_CODE = '536V72'
const WIN_PROBABILITY = 0.6
const POPUP_DELAY_MS = 1500 // Show after 1.5 seconds
const STORAGE_KEY = 'promo_wheel_won'

const SEGMENTS = [
  { label: '20% OFF', isWin: true },
  { label: 'Seguí\nparticipando', isWin: false },
  { label: '20% OFF', isWin: true },
  { label: 'Seguí\nparticipando', isWin: false },
  { label: '20% OFF', isWin: true },
  { label: '20% OFF', isWin: true },
]

const SEGMENT_ANGLE = 360 / SEGMENTS.length

export function PromoWheelPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [hasWon, setHasWon] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)
  const [rotation, setRotation] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)

  // Show popup after delay, unless user already won
  useEffect(() => {
    try {
      const alreadyWon = sessionStorage.getItem(STORAGE_KEY)
      if (alreadyWon) return
    } catch {
      // sessionStorage unavailable
    }

    const timer = setTimeout(() => {
      setIsOpen(true)
      document.body.style.overflow = 'hidden'
    }, POPUP_DELAY_MS)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }, [])

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSpinning) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, isSpinning, handleClose])

  const handleSpin = useCallback(() => {
    if (isSpinning || hasWon === true) return

    setIsSpinning(true)
    setShowResult(false)
    setHasWon(null)

    const wins = Math.random() < WIN_PROBABILITY

    const winningIndices = SEGMENTS.map((s, i) => (s.isWin ? i : -1)).filter((i) => i !== -1)
    const losingIndices = SEGMENTS.map((s, i) => (!s.isWin ? i : -1)).filter((i) => i !== -1)

    const targetIndices = wins ? winningIndices : losingIndices
    const targetIndex = targetIndices[Math.floor(Math.random() * targetIndices.length)]

    const fullRotations = 4 + Math.floor(Math.random() * 3)
    const segmentCenter = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
    const targetRotation = fullRotations * 360 + (360 - segmentCenter + 90)

    setRotation((prev) => prev + targetRotation)

    const spinDuration = 3500 + Math.random() * 1000
    setTimeout(() => {
      setIsSpinning(false)
      setHasWon(wins)
      setShowResult(true)

      if (wins) {
        try {
          sessionStorage.setItem(STORAGE_KEY, 'true')
        } catch {
          // sessionStorage unavailable
        }
      }
    }, spinDuration)
  }, [isSpinning, hasWon])

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = DISCOUNT_CODE
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  const handleRetry = useCallback(() => {
    setShowResult(false)
    setHasWon(null)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSpinning) handleClose()
          }}
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-background rounded-xl shadow-2xl border border-border/50"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              disabled={isSpinning}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 pt-8 pb-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Gift className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-primary mb-3 text-balance">
                  Gana un descuento para comprar el libro
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  Girando la ruleta podes desbloquear un descuento exclusivo para usar en tu compra.
                </p>
              </div>

              {/* Wheel */}
              <div className="relative flex flex-col items-center">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 -mt-1">
                  <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[18px] border-l-transparent border-r-transparent border-t-primary drop-shadow-md" />
                </div>

                {/* Wheel circle */}
                <div className="relative w-56 h-56 sm:w-64 sm:h-64">
                  <motion.div
                    ref={wheelRef}
                    className="w-full h-full rounded-full shadow-xl overflow-hidden border-[3px] border-primary/20"
                    style={{
                      background: `conic-gradient(
                        from 0deg,
                        #7f2764 0deg 60deg,
                        #6c6823 60deg 120deg,
                        #7f2764 120deg 180deg,
                        #6c6823 180deg 240deg,
                        #7f2764 240deg 300deg,
                        #7f2764 300deg 360deg
                      )`,
                    }}
                    animate={{ rotate: rotation }}
                    transition={{
                      duration: isSpinning ? 4 : 0,
                      ease: [0.2, 0.8, 0.3, 1],
                    }}
                  >
                    {/* Segment Labels */}
                    {SEGMENTS.map((segment, index) => {
                      const angle = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
                      return (
                        <div
                          key={index}
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ transform: `rotate(${angle}deg)` }}
                        >
                          <span
                            className="absolute text-[9px] sm:text-[11px] font-bold text-white/90 uppercase tracking-wide text-center whitespace-pre-line leading-tight"
                            style={{ transform: 'translateY(-75px)' }}
                          >
                            {segment.label}
                          </span>
                        </div>
                      )
                    })}

                    {/* Center circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-background border-[3px] border-primary/25 flex items-center justify-center shadow-inner">
                        <Gift className="w-5 h-5 text-primary/70" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Spin Button */}
                <div className="mt-6">
                  <Button
                    onClick={handleSpin}
                    disabled={isSpinning || hasWon === true}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-[0.15em] text-xs px-10 gap-2 transition-all shadow-lg"
                  >
                    <RotateCcw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                    {isSpinning ? 'Girando...' : 'Girar ruleta'}
                  </Button>
                </div>

                {/* Result */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 16, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.35 }}
                      className="mt-6 w-full"
                    >
                      {hasWon ? (
                        <div className="bg-card border border-accent/20 rounded-lg p-5 text-center">
                          <h3 className="font-serif text-lg text-primary mb-2">
                            Felicitaciones!
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            Ganaste un{' '}
                            <span className="font-bold text-accent">20% de descuento</span> para
                            comprar el libro.
                          </p>
                          <div className="bg-muted/40 rounded-md p-3 mb-4">
                            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest">
                              Tu codigo de descuento
                            </p>
                            <p className="font-mono text-xl text-primary font-bold tracking-[0.2em]">
                              {DISCOUNT_CODE}
                            </p>
                          </div>
                          <p className="text-[11px] text-muted-foreground mb-3">
                            Usa el codigo al final de la compra
                          </p>
                          <Button
                            onClick={handleCopyCode}
                            variant="outline"
                            size="sm"
                            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground uppercase tracking-wider text-xs gap-2"
                          >
                            {copied ? (
                              <>
                                <Check className="w-3 h-3" />
                                Codigo copiado
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copiar codigo
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-card border border-border rounded-lg p-5 text-center">
                          <h3 className="font-serif text-lg text-primary mb-2">
                            Esta vez no salio
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            No te desanimes! Segui participando.
                          </p>
                          <Button
                            onClick={handleRetry}
                            variant="outline"
                            size="sm"
                            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-wider text-xs gap-2"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Intentar de nuevo
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
