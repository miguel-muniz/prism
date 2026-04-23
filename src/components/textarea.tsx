import React from 'react'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const baseStyle: React.CSSProperties = {
  padding: 8,
  fontFamily: 'inherit',
  fontSize: 14,
  border: '1px solid var(--color-border, gray)',
  borderRadius: 6,
  color: 'var(--color-text)',
  backgroundColor: 'var(--color-background)'
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({style, ...props}, ref) {
  return <textarea ref={ref} style={{...baseStyle, ...style}} {...props} />
})
