'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Copy, Check, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const DISCOUNT_CODE = '536V72'
const WIN_PROBABILITY = 0.6

// Wheel segments - visual representation
const SEGMENTS = [
  { label: '20% OFF', isWin: true },
  { label: 'Seguí\nparticipando', isWin: false },
  { label: '20% OFF', isWin: true },
  { label: 'Seguí\nparticipando', isWin: false },
  { label: '20% OFF', isWin: true },
  { label: '20% OFF', isWin: true },
]

const SEGMENT_ANGLE = 360 / SEGMENTS.length // 60 degrees each

export function DiscountWheel() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [hasWon, setHasWon] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)
  const [rotation, setRotation] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)

  const handleSpin = useCallback(() => {
    if (isSpinning || hasWon === true) return

    setIsSpinning(true)
    setShowResult(false)
    setHasWon(null)

    // Determine result based on probability
    const wins = Math.random() < WIN_PROBABILITY

    // Calculate target rotation
    // Find a segment index that matches our result
    const winningIndices = SEGMENTS.map((s, i) => s.isWin ? i : -1).filter(i => i !== -1)
    const losingIndices = SEGMENTS.map((s, i) => !s.isWin ? i : -1).filter(i => i !== -1)
    
    const targetIndices = wins ? winningIndices : losingIndices
    const targetIndex = targetIndices[Math.floor(Math.random() * targetIndices.length)]
    
    // Calculate rotation to land on target segment
    // Add multiple full rotations (4-6) for dramatic effect
    const fullRotations = 4 + Math.floor(Math.random() * 3)
    const segmentCenter = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
    // The wheel rotates clockwise, pointer is at top, so we need to adjust
    const targetRotation = fullRotations * 360 + (360 - segmentCenter + 90)
    
    setRotation(prev => prev + targetRotation)

    // Show result after spin completes (3.5-4.5 seconds)
    const spinDuration = 3500 + Math.random() * 1000
    setTimeout(() => {
      setIsSpinning(false)
      setHasWon(wins)
      setShowResult(true)
    }, spinDuration)
  }, [isSpinning, hasWon])

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
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
    <section className="py-16 lg:py-20 bg-card/50">
      <div className="max-w-xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl text-primary mb-3">
            Ganá un descuento
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Girá la ruleta y conseguí un descuento exclusivo para comprar el libro
          </p>
        </motion.div>

        {/* Wheel Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex flex-col items-center"
        >
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 -mt-1">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-primary drop-shadow-md" />
          </div>

          {/* Wheel */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            <motion.div
              ref={wheelRef}
              className="w-full h-full rounded-full shadow-xl overflow-hidden border-4 border-primary/20"
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
                    style={{
                      transform: `rotate(${angle}deg)`,
                    }}
                  >
                    <span
                      className="absolute text-[10px] sm:text-xs font-bold text-white uppercase tracking-wide text-center whitespace-pre-line leading-tight"
                      style={{
                        transform: `translateY(-85px) sm:translateY(-95px)`,
                      }}
                    >
                      {segment.label}
                    </span>
                  </div>
                )
              })}
              
              {/* Center circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-background border-4 border-primary/30 flex items-center justify-center shadow-inner">
                  <span className="text-primary font-serif text-xs sm:text-sm text-center leading-tight">
                    GIRÁ
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Spin Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-8"
          >
            <Button
              onClick={handleSpin}
              disabled={isSpinning || hasWon === true}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.15em] text-xs px-10 gap-2 transition-all"
            >
              <RotateCcw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              {isSpinning ? 'Girando...' : 'Girar ruleta'}
            </Button>
          </motion.div>

          {/* Result Card */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="mt-8 w-full max-w-sm"
              >
                {hasWon ? (
                  <div className="bg-background border border-accent/30 rounded-lg p-6 text-center shadow-lg">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                      <Gift className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-serif text-xl text-primary mb-2">
                      ¡Felicitaciones!
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Ganaste un <span className="font-bold text-accent">20% de descuento</span> para comprar el libro.
                    </p>
                    <div className="bg-muted/50 rounded-md p-4 mb-4">
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                        Tu código de descuento
                      </p>
                      <p className="font-mono text-2xl text-primary font-bold tracking-widest">
                        {DISCOUNT_CODE}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      Usá el código al final de la compra
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
                          Código copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copiar código
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-background border border-border rounded-lg p-6 text-center shadow-lg">
                    <h3 className="font-serif text-xl text-primary mb-2">
                      Esta vez no salió
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      ¡No te desanimes! Seguí participando.
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
        </motion.div>
      </div>
    </section>
  )
}
