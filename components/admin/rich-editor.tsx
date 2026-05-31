'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import { useEffect, useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { TextQualityBadge } from './text-quality-badge'
import { useTextAnalysis } from '@/hooks/use-text-analysis'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Link as LinkIcon,
  Minus,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface RichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
  showQuality?: boolean
  showWordCount?: boolean
  className?: string
  disabled?: boolean
}

interface ToolbarButtonProps {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'h-7 w-7 flex items-center justify-center rounded text-sm transition-all duration-150',
        'hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-foreground/70 hover:text-foreground'
      )}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-border/60 mx-0.5" />
}

export function RichEditor({
  value,
  onChange,
  placeholder = 'Escribe aquí...',
  minHeight = 240,
  showQuality = true,
  showWordCount = true,
  className,
  disabled = false,
}: RichEditorProps) {
  const [focused, setFocused] = useState(false)
  const [debouncedText, setDebouncedText] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const analysis = useTextAnalysis(debouncedText)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Underline,
      Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right', 'justify'] }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const text = editor.getText()
      onChange(html)

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        setDebouncedText(text)
      }, 600)
    },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    editorProps: {
      attributes: {
        spellcheck: 'true',
        lang: 'es',
        class: 'prose-editor-content',
      },
    },
    immediatelyRender: false,
  })

  // Sync external value changes (e.g. when loading saved data)
  useEffect(() => {
    if (!editor) return
    const currentHtml = editor.getHTML()
    if (value !== currentHtml && value !== undefined) {
      editor.commands.setContent(value, false)
      setDebouncedText(editor.getText())
    }
  }, [value, editor])

  const wordCount = editor?.storage.characterCount?.words() ?? 0
  const charCount = editor?.storage.characterCount?.characters() ?? 0

  const handleLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL del enlace:')
    if (!url) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className={cn('space-y-1', className)}>
      {/* Editor container */}
      <div className={cn(
        'border rounded-md bg-card/30 overflow-hidden transition-all duration-200',
        focused ? 'border-primary/50 shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]' : 'border-border',
        disabled && 'opacity-60 pointer-events-none'
      )}>
        {/* Toolbar */}
        <AnimatePresence>
          <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border/50 bg-card/60 flex-wrap">
            {/* History */}
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Deshacer"
            >
              <Undo className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Rehacer"
            >
              <Redo className="w-3.5 h-3.5" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Headings */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive('heading', { level: 2 })}
              title="Título H2"
            >
              <span className="text-xs font-bold">H2</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor.isActive('heading', { level: 3 })}
              title="Título H3"
            >
              <span className="text-xs font-bold">H3</span>
            </ToolbarButton>

            <ToolbarDivider />

            {/* Text styles */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              title="Negrita"
            >
              <Bold className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              title="Cursiva"
            >
              <Italic className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive('underline')}
              title="Subrayado"
            >
              <UnderlineIcon className="w-3.5 h-3.5" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Lists */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="Lista"
            >
              <List className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="Lista numerada"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive('blockquote')}
              title="Cita"
            >
              <Quote className="w-3.5 h-3.5" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Align */}
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              active={editor.isActive({ textAlign: 'left' })}
              title="Alinear izquierda"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              active={editor.isActive({ textAlign: 'center' })}
              title="Centrar"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              active={editor.isActive({ textAlign: 'right' })}
              title="Alinear derecha"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              active={editor.isActive({ textAlign: 'justify' })}
              title="Justificar"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Extras */}
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Separador"
            >
              <Minus className="w-3.5 h-3.5" />
            </ToolbarButton>
          </div>
        </AnimatePresence>

        {/* Editor content area */}
        <EditorContent
          editor={editor}
          className="rich-editor-content"
          style={{ minHeight }}
        />
      </div>

      {/* Footer: quality + word count */}
      {(showQuality || showWordCount) && (
        <div className="space-y-2">
          {showWordCount && wordCount > 0 && (
            <div className="flex items-center justify-end gap-3">
              <span className="text-xs text-muted-foreground">{wordCount} palabras</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{charCount} caracteres</span>
            </div>
          )}
          {showQuality && (
            <TextQualityBadge
              analysis={analysis}
              showDetails={focused}
            />
          )}
        </div>
      )}
    </div>
  )
}
