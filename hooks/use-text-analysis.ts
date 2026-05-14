'use client'

import { useMemo } from 'react'

export type TextQuality = 'empty' | 'poor' | 'fair' | 'good' | 'excellent'

export interface TextAnalysis {
  wordCount: number
  charCount: number
  sentenceCount: number
  avgWordsPerSentence: number
  quality: TextQuality
  qualityScore: number // 0–100
  issues: TextIssue[]
}

export interface TextIssue {
  type: 'all_caps' | 'no_punctuation' | 'double_space' | 'too_short' | 'very_long_sentence' | 'repeated_words' | 'aggressive_tone'
  message: string
  severity: 'warning' | 'suggestion'
}

const AGGRESSIVE_WORDS = ['odio', 'estúpido', 'idiota', 'imbécil', 'maldito', 'horrible', 'pésimo', 'basura']

function detectIssues(text: string): TextIssue[] {
  const issues: TextIssue[] = []
  if (!text || text.trim().length === 0) return issues

  // All caps detection (more than 50% uppercase letters in words)
  const words = text.trim().split(/\s+/)
  const upperWords = words.filter(w => w.length > 2 && w === w.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(w))
  if (upperWords.length > words.length * 0.4) {
    issues.push({
      type: 'all_caps',
      message: 'Hay muchas palabras en mayúsculas. Considera usar mayúsculas normales.',
      severity: 'warning',
    })
  }

  // Double space
  if (/  +/.test(text)) {
    issues.push({
      type: 'double_space',
      message: 'Se detectaron espacios dobles en el texto.',
      severity: 'suggestion',
    })
  }

  // No punctuation in long text
  if (text.length > 80 && !/[.!?]/.test(text)) {
    issues.push({
      type: 'no_punctuation',
      message: 'El texto es largo pero no tiene puntuación. Considera agregar puntos o signos.',
      severity: 'warning',
    })
  }

  // Very long sentences (more than 40 words)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > 40)
  if (longSentences.length > 0) {
    issues.push({
      type: 'very_long_sentence',
      message: 'Hay oraciones muy largas. Considera dividirlas en párrafos más cortos.',
      severity: 'suggestion',
    })
  }

  // Repeated adjacent words
  const wordList = text.toLowerCase().split(/\s+/)
  for (let i = 0; i < wordList.length - 1; i++) {
    if (wordList[i].length > 3 && wordList[i] === wordList[i + 1]) {
      issues.push({
        type: 'repeated_words',
        message: `La palabra "${wordList[i]}" aparece repetida consecutivamente.`,
        severity: 'warning',
      })
      break
    }
  }

  // Aggressive tone
  const lowerText = text.toLowerCase()
  const foundAggressive = AGGRESSIVE_WORDS.filter(w => lowerText.includes(w))
  if (foundAggressive.length > 0) {
    issues.push({
      type: 'aggressive_tone',
      message: 'Se detectó lenguaje agresivo. Considera un tono más neutro.',
      severity: 'warning',
    })
  }

  return issues
}

function calcQuality(text: string, wordCount: number, issues: TextIssue[]): { quality: TextQuality; score: number } {
  if (!text || wordCount === 0) return { quality: 'empty', score: 0 }
  if (wordCount < 3) return { quality: 'poor', score: 10 }

  let score = 50

  // Word count bonus
  if (wordCount >= 10) score += 15
  if (wordCount >= 30) score += 10
  if (wordCount >= 100) score += 5

  // Has punctuation bonus
  if (/[.!?,;:]/.test(text)) score += 10

  // Has paragraph breaks bonus
  if (/\n/.test(text)) score += 5

  // Issue penalties
  const warnings = issues.filter(i => i.severity === 'warning').length
  const suggestions = issues.filter(i => i.severity === 'suggestion').length
  score -= warnings * 12
  score -= suggestions * 5

  // Starts with capital bonus
  if (/^[A-ZÁÉÍÓÚÑ]/.test(text.trim())) score += 5

  score = Math.max(0, Math.min(100, score))

  let quality: TextQuality
  if (score < 20) quality = 'poor'
  else if (score < 45) quality = 'fair'
  else if (score < 70) quality = 'good'
  else quality = 'excellent'

  return { quality, score }
}

export function useTextAnalysis(text: string): TextAnalysis {
  return useMemo(() => {
    const trimmed = text?.trim() ?? ''
    if (!trimmed) {
      return {
        wordCount: 0,
        charCount: 0,
        sentenceCount: 0,
        avgWordsPerSentence: 0,
        quality: 'empty',
        qualityScore: 0,
        issues: [],
      }
    }

    const words = trimmed.split(/\s+/).filter(Boolean)
    const wordCount = words.length
    const charCount = trimmed.length
    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const sentenceCount = sentences.length
    const avgWordsPerSentence = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0

    const issues = detectIssues(trimmed)
    const { quality, score } = calcQuality(trimmed, wordCount, issues)

    return {
      wordCount,
      charCount,
      sentenceCount,
      avgWordsPerSentence,
      quality,
      qualityScore: score,
      issues,
    }
  }, [text])
}

export const QUALITY_CONFIG: Record<TextQuality, { label: string; color: string; bg: string; bar: string }> = {
  empty:     { label: 'Vacío',     color: 'text-muted-foreground', bg: 'bg-muted/40',        bar: 'bg-muted' },
  poor:      { label: 'Pobre',     color: 'text-destructive',      bg: 'bg-destructive/10',  bar: 'bg-destructive' },
  fair:      { label: 'Aceptable', color: 'text-amber-600',        bg: 'bg-amber-50',        bar: 'bg-amber-400' },
  good:      { label: 'Bueno',     color: 'text-emerald-600',      bg: 'bg-emerald-50',      bar: 'bg-emerald-500' },
  excellent: { label: 'Excelente', color: 'text-primary',          bg: 'bg-primary/5',       bar: 'bg-primary' },
}
