import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const baseStyle: React.CSSProperties = {
  height: 32,
  padding: '0 8px',
  fontFamily: 'inherit',
  fontSize: 14,
  lineHeight: '32px',
  border: '1px solid var(--color-border, gray)',
  borderRadius: 6,
  color: 'var(--color-text)',
  backgroundColor: 'var(--color-background)'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({style, ...props}, ref) {
  return <input ref={ref} style={{...baseStyle, ...style}} {...props} />
})
