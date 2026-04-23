import React from 'react'
import styled from 'styled-components'

type PrimitiveProps = {
  as?: React.ElementType
  children?: React.ReactNode
  className?: string
  sx?: Record<string, unknown>
  style?: React.CSSProperties
  [key: string]: unknown
}

const SPACING_SCALE = ['0px', '4px', '8px', '16px', '24px', '32px', '40px', '48px']
const FONT_SIZE_SCALE = ['12px', '14px', '16px', '20px', '24px', '32px']
const RADIUS_SCALE = ['0px', '4px', '6px', '8px', '12px', '16px']
const COLOR_TOKENS: Record<string, string> = {
  'canvas.default': 'var(--app-surface)',
  'fg.muted': 'var(--app-muted)'
}

type NormalizedSx = Record<string, any>

const StyledPrimitive = styled.div.withConfig({
  shouldForwardProp: prop => prop !== '$sx'
})<{$sx: NormalizedSx}>(({$sx}) => $sx as any)

export function Box({as = 'div', sx, children, ...props}: PrimitiveProps) {
  return (
    <StyledPrimitive as={as} $sx={normalizeSx(sx)} {...props}>
      {children}
    </StyledPrimitive>
  )
}

export function Text({as = 'span', sx, children, ...props}: PrimitiveProps) {
  return (
    <Box
      as={as}
      sx={{
        fontSize: 2,
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

export function Heading({as = 'h2', sx, children, ...props}: PrimitiveProps) {
  return (
    <Box
      as={as}
      sx={{
        margin: 0,
        fontSize: 4,
        fontWeight: 700,
        lineHeight: 1.15,
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

function normalizeSx(sx?: Record<string, unknown>): NormalizedSx {
  if (!sx) {
    return {}
  }

  const output: NormalizedSx = {}

  for (const [key, value] of Object.entries(sx)) {
    if (value == null) {
      continue
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      output[key] = normalizeSx(value as Record<string, unknown>)
      continue
    }

    applyStyle(output, key, value)
  }

  return output
}

function applyStyle(output: NormalizedSx, key: string, value: unknown) {
  switch (key) {
    case 'm':
      output.margin = mapSpace(value)
      return
    case 'mt':
      output.marginTop = mapSpace(value)
      return
    case 'mr':
      output.marginRight = mapSpace(value)
      return
    case 'mb':
      output.marginBottom = mapSpace(value)
      return
    case 'ml':
      output.marginLeft = mapSpace(value)
      return
    case 'mx':
      output.marginLeft = mapSpace(value)
      output.marginRight = mapSpace(value)
      return
    case 'my':
      output.marginTop = mapSpace(value)
      output.marginBottom = mapSpace(value)
      return
    case 'p':
      output.padding = mapSpace(value)
      return
    case 'pt':
      output.paddingTop = mapSpace(value)
      return
    case 'pr':
      output.paddingRight = mapSpace(value)
      return
    case 'pb':
      output.paddingBottom = mapSpace(value)
      return
    case 'pl':
      output.paddingLeft = mapSpace(value)
      return
    case 'px':
      output.paddingLeft = mapSpace(value)
      output.paddingRight = mapSpace(value)
      return
    case 'py':
      output.paddingTop = mapSpace(value)
      output.paddingBottom = mapSpace(value)
      return
    case 'bg':
      output.backgroundColor = mapColor(value)
      return
    case 'gap':
    case 'rowGap':
    case 'columnGap':
      output[key] = mapSpace(value)
      return
    case 'fontSize':
      output.fontSize = mapFontSize(value)
      return
    case 'fontFamily':
      output.fontFamily = mapFontFamily(value)
      return
    case 'borderRadius':
    case 'borderTopLeftRadius':
    case 'borderTopRightRadius':
    case 'borderBottomLeftRadius':
    case 'borderBottomRightRadius':
      output[key] = mapRadius(value)
      return
    case 'color':
    case 'borderColor':
    case 'backgroundColor':
    case 'stroke':
    case 'fill':
      output[key] = mapColor(value)
      return
    case 'lineClamp':
      output.WebkitLineClamp = value
      output.WebkitBoxOrient = 'vertical'
      output.overflow = 'hidden'
      output.display = '-webkit-box'
      return
    default:
      output[key] = value
  }
}

function mapSpace(value: unknown) {
  if (typeof value === 'number') {
    return SPACING_SCALE[value] ?? `${value}px`
  }

  return value
}

function mapFontSize(value: unknown) {
  if (typeof value === 'number') {
    return FONT_SIZE_SCALE[value] ?? `${value}px`
  }

  return value
}

function mapRadius(value: unknown) {
  if (typeof value === 'number') {
    return RADIUS_SCALE[value] ?? `${value}px`
  }

  return value
}

function mapFontFamily(value: unknown) {
  if (value === 'mono') {
    return 'var(--font-mono)'
  }

  return value
}

function mapColor(value: unknown) {
  if (typeof value === 'string') {
    return COLOR_TOKENS[value] ?? value
  }

  return value
}
