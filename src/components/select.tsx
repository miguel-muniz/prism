import React from 'react'

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

const baseStyle: React.CSSProperties = {
  height: 32,
  padding: '0 8px',
  fontFamily: 'inherit',
  fontSize: 14,
  lineHeight: '32px',
  border: '1px solid var(--color-border, gray)',
  borderRadius: 6,
  color: 'var(--color-text)',
  backgroundColor: 'var(--color-background)',
  margin: 0
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select({style, ...props}, ref) {
  return <select ref={ref} style={{...baseStyle, ...style}} {...props} />
})
