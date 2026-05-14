'use client'

import { useState, useCallback, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TextQualityBadge } from './text-quality-badge'
import { useTextAnalysis } from '@/hooks/use-text-analysis'
import { cn } from '@/lib/utils'

interface SmartInputProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
  className?: string
  disabled?: boolean
}

interface SmartTextareaProps extends SmartInputProps {
  rows?: number
  minRows?: number
  showQuality?: boolean
  showIssues?: boolean
}

// Lightweight single-line smart input with spellcheck
export function SmartInput({ id, value, onChange, placeholder, label, required, className, disabled }: SmartInputProps) {
  return (
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      spellCheck
      lang="es"
      autoCorrect="on"
      autoCapitalize="sentences"
      className={cn(
        'transition-all duration-200',
        'focus:ring-2 focus:ring-primary/20 focus:border-primary/60',
        'placeholder:text-muted-foreground/60',
        className
      )}
    />
  )
}

// Smart textarea with quality analysis
export function SmartTextarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
  className,
  disabled,
  showQuality = true,
  showIssues = true,
}: SmartTextareaProps) {
  const [focused, setFocused] = useState(false)
  const [debouncedValue, setDebouncedValue] = useState(value)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const analysis = useTextAnalysis(debouncedValue)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedValue(newValue)
    }, 600)
  }, [onChange])

  return (
    <div className="space-y-2">
      <div className={cn(
        'relative rounded-md transition-all duration-200',
        focused && 'ring-2 ring-primary/20'
      )}>
        <Textarea
          id={id}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={rows}
          required={required}
          disabled={disabled}
          spellCheck
          lang="es"
          autoCorrect="on"
          autoCapitalize="sentences"
          className={cn(
            'resize-none transition-all duration-200 text-base leading-relaxed',
            'focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
            focused && 'border-primary/50',
            className
          )}
        />
      </div>

      {showQuality && (
        <TextQualityBadge
          analysis={analysis}
          showDetails={showIssues && focused}
        />
      )}
    </div>
  )
}
