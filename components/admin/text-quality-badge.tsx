'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { type TextAnalysis, QUALITY_CONFIG } from '@/hooks/use-text-analysis'
import { cn } from '@/lib/utils'
import { AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react'

interface TextQualityBadgeProps {
  analysis: TextAnalysis
  showDetails?: boolean
  className?: string
}

export function TextQualityBadge({ analysis, showDetails = false, className }: TextQualityBadgeProps) {
  const config = QUALITY_CONFIG[analysis.quality]

  if (analysis.quality === 'empty') return null

  return (
    <div className={cn('space-y-2', className)}>
      {/* Stats row */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-muted-foreground">
          {analysis.wordCount} {analysis.wordCount === 1 ? 'palabra' : 'palabras'}
        </span>
        <span className="text-xs text-muted-foreground">·</span>
        <span className="text-xs text-muted-foreground">
          {analysis.charCount} caracteres
        </span>
        {analysis.sentenceCount > 0 && (
          <>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {analysis.sentenceCount} {analysis.sentenceCount === 1 ? 'oración' : 'oraciones'}
            </span>
          </>
        )}

        {/* Quality badge */}
        <motion.div
          key={analysis.quality}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'ml-auto flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
            config.bg,
            config.color
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
          {config.label}
        </motion.div>
      </div>

      {/* Quality bar */}
      <div className="h-0.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', config.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${analysis.qualityScore}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Issues */}
      <AnimatePresence>
        {showDetails && analysis.issues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5 overflow-hidden"
          >
            {analysis.issues.map((issue, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'flex items-start gap-2 px-3 py-2 rounded-md text-xs',
                  issue.severity === 'warning'
                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                    : 'bg-muted/60 text-muted-foreground'
                )}
              >
                {issue.severity === 'warning' ? (
                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                ) : (
                  <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                )}
                {issue.message}
              </motion.div>
            ))}
          </motion.div>
        )}

        {showDetails && analysis.issues.length === 0 && analysis.quality !== 'empty' && analysis.wordCount >= 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs bg-emerald-50 text-emerald-700 border border-emerald-100"
          >
            <CheckCircle className="w-3 h-3 flex-shrink-0" />
            El texto se ve bien. Sin sugerencias de mejora.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
