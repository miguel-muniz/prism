import React from 'react'

type StackProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode
  spacing?: number | string
}

export function HStack({spacing, style, children, ...props}: StackProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: 'max-content',
        gap: px(spacing),
        alignItems: 'center',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function VStack({spacing, style, children, ...props}: StackProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'row',
        gridAutoRows: 'max-content',
        gap: px(spacing),
        alignItems: 'center',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function ZStack({style, children, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        ...style
      }}
      {...props}
    >
      {React.Children.map(children, child => (
        <div style={{gridArea: '1 / 1', width: '100%', height: '100%'}}>{child}</div>
      ))}
    </div>
  )
}

export function px(value: unknown): React.CSSProperties['gap'] {
  if (typeof value === 'number') {
    return `${value}px`
  }

  return value as React.CSSProperties['gap']
}
