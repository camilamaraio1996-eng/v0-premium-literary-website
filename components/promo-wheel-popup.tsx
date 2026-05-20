'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Copy, Check, RotateCcw, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import confetti from 'canvas-confetti'

const DISCOUNT_CODE = '536V72'
const WIN_PROBABILITY = 0.6
const POPUP_DELAY_MS = 1000
const STORAGE_PLAYED_KEY = 'roulettePlayed'
const STORAGE_RESULT_KEY = 'rouletteResult'
const STORAGE_CLOSED_KEY = 'rouletteClosed'
const HOURS_24 = 24 * 60 * 60 * 1000

const SEGMENTS = [
  { label: '20% OFF', isWin: true },
  { label: 'SEGUÍ\nPARTICIPANDO', isWin: false },
  { label: '20% OFF', isWin: true },
  { label: 'SEGUÍ\nPARTICIPANDO', isWin: false },
  { label: '20% OFF', isWin: true },
  { label: '20% OFF', isWin: true },
]

const SEGMENT_ANGLE = 360 / SEGMENTS.length
const WHEEL_COLORS = ['#7f2764', '#6c6823', '#7f2764', '#6c6823', '#7f2764', '#8a3070']

function fireConfetti() {
  const count = 120
  const defaults = { startVelocity: 28, spread: 90, ticks: 80, zIndex: 10000 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  confetti({ ...defaults, particleCount: count * 0.4, origin: { x: randomInRange(0.1, 0.3), y: 0.55 }, colors: ['#7f2764', '#f2ede6', '#6c6823', '#d3b1c2', '#a87890'] })
  confetti({ ...defaults, particleCount: count * 0.4, origin: { x: randomInRange(0.7, 0.9), y: 0.55 }, colors: ['#7f2764', '#f2ede6', '#6c6823', '#d3b1c2', '#a87890'] })
  confetti({ ...defaults, particleCount: count * 0.2, origin: { x: 0.5, y: 0.5 }, colors: ['#f2ede6', '#d3b1c2'] })
}

export function PromoWheelPopup() {
  const pathname = usePathname()
  const isOnLibroPage = pathname === '/libro'
  
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [hasWon, setHasWon] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)
  const spinLockRef = useRef(false)

  // Initialize state on mount and when page changes
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle route changes - close popup if we leave /libro
  useEffect(() => {
    if (!isOnLibroPage && isOpen) {
      setIsOpen(false)
    }
  }, [isOnLibroPage, isOpen])

  // Initialize popup only when on /libro page
  useEffect(() => {
    if (!isMounted || !isOnLibroPage) return

    try {
      const alreadyPlayed = localStorage.getItem(STORAGE_PLAYED_KEY)

      if (alreadyPlayed) {
        setHasPlayed(true)
        const result = localStorage.getItem(STORAGE_RESULT_KEY)
        setHasWon(result === 'true')
      }
    } catch {
      // localStorage unavailable
    }

    const timer = setTimeout(() => {
      // Only open if not already played and still on /libro page
      try {
        const alreadyPlayed = localStorage.getItem(STORAGE_PLAYED_KEY)
        if (!alreadyPlayed) {
          setIsOpen(true)
        }
      } catch {
        // localStorage unavailable
      }
    }, POPUP_DELAY_MS)

    return () => clearTimeout(timer)
  }, [isOnLibroPage, isMounted])

  // Lock/unlock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    if (isSpinning) return
    setIsOpen(false)
  }, [isSpinning])

  const handleSpin = useCallback(() => {
    if (spinLockRef.current || isSpinning || hasPlayed) return
    
    spinLockRef.current = true
    setIsSpinning(true)
    setShowResult(false)

    const isWin = Math.random() < WIN_PROBABILITY
    const targetSegment = isWin ? Math.floor(Math.random() * 4) * 2 : [1, 3][Math.floor(Math.random() * 2)]
    const baseRotation = targetSegment * SEGMENT_ANGLE
    const spins = 5 + Math.random() * 2
    const finalRotation = spins * 360 + baseRotation
    const randomOffset = (Math.random() - 0.5) * (SEGMENT_ANGLE * 0.6)
    const adjustedRotation = finalRotation + randomOffset

    setRotation(adjustedRotation)

    setTimeout(() => {
      setIsSpinning(false)
      setHasWon(isWin)
      setShowResult(true)

      try {
        localStorage.setItem(STORAGE_PLAYED_KEY, 'true')
        localStorage.setItem(STORAGE_RESULT_KEY, isWin ? 'true' : 'false')
      } catch {
        // localStorage unavailable
      }

      setHasPlayed(true)

      if (isWin) {
        setTimeout(() => {
          fireConfetti()
        }, 300)
      }

      spinLockRef.current = false
    }, 4200)
  }, [isSpinning, hasPlayed])

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(DISCOUNT_CODE).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.22)] border border-border/40"
          >
            {/* Close button - sticky */}
            <button
              onClick={handleClose}
              disabled={isSpinning}
              className="sticky top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-20 ml-auto"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-4 sm:px-6 pt-2 pb-4 sm:pt-3 sm:pb-5">
              {/* Header */}
              <div className="text-center mb-3 sm:mb-4">
                <div className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 mb-2">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <h2 className="font-serif text-lg sm:text-xl text-primary mb-1.5 sm:mb-2 text-balance leading-snug">
                  Ganá un descuento para comprar el libro
                </h2>
                <p className="text-muted-foreground text-[11px] sm:text-xs leading-tight max-w-[260px] sm:max-w-[280px] mx-auto">
                  Probá suerte girando la ruleta y descubrí si desbloqueás un descuento exclusivo.
                </p>
              </div>

              {/* Already played state */}
              {hasPlayed && !isSpinning && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-2 text-center"
                >
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                    Ya utilizaste tu oportunidad
                  </p>
                </motion.div>
              )}

              {/* Wheel - fixed compact size */}
              <div className="relative flex flex-col items-center">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 -mt-0.5">
                  <div
                    className="w-0 h-0 drop-shadow-md"
                    style={{
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '14px solid #7f2764',
                    }}
                  />
                </div>

                {/* Wheel - always 220px */}
                <div className="relative w-[220px] h-[220px] mx-auto">
                  <motion.div
                    ref={wheelRef}
                    className="w-full h-full rounded-full border-[3px] border-primary/25 shadow-lg overflow-hidden relative flex items-center justify-center"
                    style={{
                      background: `conic-gradient(${WHEEL_COLORS.map((c, i) => `${c} ${i * SEGMENT_ANGLE}deg ${(i + 1) * SEGMENT_ANGLE}deg`).join(', ')})`,
                      filter: hasWon === true ? 'drop-shadow(0 0 12px rgba(127,39,100,0.5))' : undefined,
                    }}
                    animate={{ rotate: rotation }}
                    transition={{
                      duration: isSpinning ? 4.2 : 0,
                      ease: [0.15, 0.85, 0.25, 1],
                    }}
                  >
                    {/* Text labels */}
                    {SEGMENTS.map((segment, index) => {
                      const sliceAngle = SEGMENT_ANGLE
                      const midAngle = index * sliceAngle + sliceAngle / 2
                      const isParticipando = segment.label.includes('PARTICIPANDO')

                      return (
                        <div
                          key={`text-${index}`}
                          className="absolute w-full h-full flex items-center justify-center pointer-events-none"
                          style={{
                            transform: `rotate(${midAngle}deg)`,
                          }}
                        >
                          <span
                            className="font-bold text-white/95 uppercase text-center absolute"
                            style={{
                              fontSize: isParticipando ? '9px' : '11px',
                              top: '15%',
                              transform: 'translateX(-50%)',
                              left: '50%',
                              lineHeight: '1.15',
                              whiteSpace: 'pre-line',
                              letterSpacing: isParticipando ? '0.3px' : '0.5px',
                              maxWidth: '50px',
                            }}
                          >
                            {segment.label}
                          </span>
                        </div>
                      )
                    })}

                    {/* Center hub */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background border-[2.5px] border-primary/20 flex items-center justify-center shadow-inner">
                        <Gift className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary/60" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Spin button */}
                <div className="mt-3 sm:mt-4">
                  <Button
                    onClick={handleSpin}
                    disabled={isSpinning || hasPlayed}
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.12em] text-[10px] px-6 py-1.5 sm:px-7 sm:py-2 gap-1.5 shadow-md transition-all h-auto"
                  >
                    <RotateCcw className={`w-3 h-3 ${isSpinning ? 'animate-spin' : ''}`} />
                    <span className="text-[9px] sm:text-[10px]">
                      {isSpinning ? 'Girando...' : hasPlayed ? 'Ya giraste' : 'Girar ruleta'}
                    </span>
                  </Button>
                </div>

                {/* Result */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="mt-2.5 sm:mt-3 w-full px-1"
                    >
                      {hasWon ? (
                        <div className="bg-card border border-primary/15 rounded-lg p-3 sm:p-4 text-center shadow-sm">
                          <div className="flex items-center justify-center gap-1 mb-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            <h3 className="font-serif text-sm sm:text-base text-primary">
                              Felicitaciones!
                            </h3>
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <p className="text-muted-foreground text-[10px] sm:text-xs mb-2">
                            Ganaste un{' '}
                            <span className="font-bold text-primary">20% de descuento</span> para
                            comprar el libro.
                          </p>
                          <div className="bg-muted/50 rounded-md p-2 sm:p-2.5 mb-1">
                            <p className="text-[8px] text-muted-foreground uppercase tracking-[0.15em] mb-0.5">
                              Tu codigo de descuento
                            </p>
                            <p className="font-mono text-lg sm:text-xl text-primary font-bold tracking-[0.25em]">
                              {DISCOUNT_CODE}
                            </p>
                          </div>
                          <p className="text-[8px] text-muted-foreground mb-2">
                            Ingresa el codigo al finalizar la compra.
                          </p>
                          <Button
                            onClick={handleCopyCode}
                            variant="outline"
                            size="sm"
                            className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-wider text-[8px] gap-1 transition-all h-7"
                          >
                            {copied ? (
                              <>
                                <Check className="w-2.5 h-2.5" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="w-2.5 h-2.5" />
                                Copiar
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-card border border-border/60 rounded-lg p-3 sm:p-4 text-center">
                          <h3 className="font-serif text-xs sm:text-sm text-primary mb-0.5">
                            Esta vez no salio.
                          </h3>
                          <p className="text-muted-foreground text-[9px] sm:text-xs">
                            Segui explorando la pagina.
                          </p>
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
