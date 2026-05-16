'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
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

// Wheel colors alternating primary / accent
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
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [hasWon, setHasWon] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)
  const [rotation, setRotation] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)
  const spinLock = useRef(false)

  useEffect(() => {
    try {
      // Check if already played
      const alreadyPlayed = localStorage.getItem(STORAGE_PLAYED_KEY)
      if (alreadyPlayed) {
        const result = localStorage.getItem(STORAGE_RESULT_KEY)
        setHasPlayed(true)
        setHasWon(result === 'won')
        setShowResult(true)
        // Still show popup so they can see their result
        const timer = setTimeout(() => setIsOpen(true), POPUP_DELAY_MS)
        return () => clearTimeout(timer)
      }

      // Check if closed without playing (24h cooldown)
      const closedAt = localStorage.getItem(STORAGE_CLOSED_KEY)
      if (closedAt) {
        const elapsed = Date.now() - parseInt(closedAt, 10)
        if (elapsed < HOURS_24) return
        // 24h passed, remove the flag and show again
        localStorage.removeItem(STORAGE_CLOSED_KEY)
      }

      const timer = setTimeout(() => setIsOpen(true), POPUP_DELAY_MS)
      return () => clearTimeout(timer)
    } catch {
      // localStorage unavailable
      const timer = setTimeout(() => setIsOpen(true), POPUP_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [])

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

    // If they close without playing, record timestamp for 24h cooldown
    if (!hasPlayed) {
      try {
        localStorage.setItem(STORAGE_CLOSED_KEY, String(Date.now()))
      } catch {
        // unavailable
      }
    }
  }, [isSpinning, hasPlayed])

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSpinning) handleClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, isSpinning, handleClose])

  const handleSpin = useCallback(() => {
    if (isSpinning || spinLock.current || hasPlayed) return
    spinLock.current = true
    setIsSpinning(true)
    setShowResult(false)

    const wins = Math.random() < WIN_PROBABILITY

    const winningIndices = SEGMENTS.map((s, i) => (s.isWin ? i : -1)).filter((i) => i !== -1)
    const losingIndices = SEGMENTS.map((s, i) => (!s.isWin ? i : -1)).filter((i) => i !== -1)
    const targetIndices = wins ? winningIndices : losingIndices
    const targetIndex = targetIndices[Math.floor(Math.random() * targetIndices.length)]

    const fullRotations = 4 + Math.floor(Math.random() * 3) // 4–6 full turns
    const segmentCenter = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
    const targetRotation = fullRotations * 360 + (360 - segmentCenter + 90)

    setRotation((prev) => prev + targetRotation)

    const spinDuration = 3500 + Math.random() * 1000

    setTimeout(() => {
      setIsSpinning(false)
      spinLock.current = false
      setHasWon(wins)
      setHasPlayed(true)
      setShowResult(true)

      const result = wins ? 'won' : 'lost'
      try {
        localStorage.setItem(STORAGE_PLAYED_KEY, 'true')
        localStorage.setItem(STORAGE_RESULT_KEY, result)
      } catch {
        // unavailable
      }

      if (wins) {
        setTimeout(() => fireConfetti(), 300)
      }
    }, spinDuration)
  }, [isSpinning, hasPlayed])

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE)
    } catch {
      const el = document.createElement('textarea')
      el.value = DISCOUNT_CODE
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSpinning) handleClose()
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-foreground/45 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[420px] max-h-[90vh] sm:max-h-[92vh] overflow-y-auto bg-background rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.22)] border border-border/40"
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

            <div className="px-4 sm:px-6 pt-3 pb-6 sm:pt-4 sm:pb-7">
              {/* Header */}
              <div className="text-center mb-4 sm:mb-5">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 mb-2.5 sm:mb-3">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-primary mb-2 sm:mb-2.5 text-balance leading-snug">
                  Ganá un descuento para comprar el libro
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-[280px] sm:max-w-[300px] mx-auto">
                  Probá suerte girando la ruleta y descubrí si desbloqueás un descuento exclusivo.
                </p>
              </div>

              {/* Already played state */}
              {hasPlayed && !isSpinning && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 text-center"
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Ya utilizaste tu oportunidad
                  </p>
                </motion.div>
              )}

              {/* Wheel - shrinks after spin */}
              <div className="relative flex flex-col items-center">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 -mt-0.5">
                  <div
                    className="w-0 h-0 drop-shadow-md"
                    style={{
                      borderLeft: '9px solid transparent',
                      borderRight: '9px solid transparent',
                      borderTop: '16px solid #7f2764',
                    }}
                  />
                </div>

                {/* Wheel container */}
                <motion.div
                  className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto"
                  animate={{ scale: showResult ? 0.65 : 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
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
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background border-[2.5px] border-primary/20 flex items-center justify-center shadow-inner">
                        <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-primary/60" />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Spin button */}
                <div className="mt-4 sm:mt-5">
                  <Button
                    onClick={handleSpin}
                    disabled={isSpinning || hasPlayed}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.12em] text-xs px-8 gap-2 shadow-md transition-all"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
                    {isSpinning ? 'Girando...' : hasPlayed ? 'Ya giraste' : 'Girar ruleta'}
                  </Button>
                </div>

                {/* Result */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="mt-3 sm:mt-4 w-full"
                    >
                      {hasWon ? (
                        <div className="bg-card border border-primary/15 rounded-lg p-4 sm:p-5 text-center shadow-sm">
                          <div className="flex items-center justify-center gap-1.5 mb-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <h3 className="font-serif text-base sm:text-lg text-primary">
                              Felicitaciones!
                            </h3>
                            <Sparkles className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-muted-foreground text-xs sm:text-sm mb-3">
                            Ganaste un{' '}
                            <span className="font-bold text-primary">20% de descuento</span> para
                            comprar el libro.
                          </p>
                          <div className="bg-muted/50 rounded-lg p-2.5 sm:p-3 mb-1">
                            <p className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-[0.2em] mb-1">
                              Tu codigo de descuento
                            </p>
                            <p className="font-mono text-xl sm:text-2xl text-primary font-bold tracking-[0.3em]">
                              {DISCOUNT_CODE}
                            </p>
                          </div>
                          <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-2.5">
                            Ingresa el codigo al finalizar la compra.
                          </p>
                          <Button
                            onClick={handleCopyCode}
                            variant="outline"
                            size="sm"
                            className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-wider text-[9px] sm:text-[10px] gap-1 transition-all h-8"
                          >
                            {copied ? (
                              <>
                                <Check className="w-3 h-3" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copiar
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-5 text-center">
                          <h3 className="font-serif text-sm sm:text-base text-primary mb-1">
                            Esta vez no salio.
                          </h3>
                          <p className="text-muted-foreground text-xs sm:text-sm">
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
