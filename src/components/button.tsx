import WaButton from '@awesome.me/webawesome/dist/react/button/index.js'
import React from 'react'

type ButtonProps = {
  children?: React.ReactNode
  variant?: 'default' | 'primary'
  size?: 'small' | 'medium' | 'large'
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLElement>
}

type IconButtonProps = Omit<ButtonProps, 'children' | 'variant'> & {
  icon: React.ComponentType<{size?: number; className?: string}>
  'aria-label': string
  children?: React.ReactNode
}

type ButtonGroupProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Button({
  children,
  variant = 'default',
  size = 'medium',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <WaButton
      type={type}
      size={size}
      variant={variant === 'primary' ? 'brand' : 'neutral'}
      appearance={variant === 'primary' ? 'accent' : 'filled-outlined'}
      className={['app-button', variant === 'primary' ? 'app-button--primary' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </WaButton>
  )
}

export function IconButton({
  icon: Icon,
  className = '',
  style,
  size = 'medium',
  children: _children,
  ...props
}: IconButtonProps) {
  return (
    <WaButton
      size={size}
      variant="neutral"
      appearance="filled-outlined"
      className={['app-button', 'app-icon-button', className].filter(Boolean).join(' ')}
      style={{
        minWidth: 36,
        width: 36,
        ...style
      }}
      {...props}
    >
      <Icon className="app-icon-button__icon" />
    </WaButton>
  )
}

export function ButtonGroup({children, className, style}: ButtonGroupProps) {
  return (
    <div className={['app-button-group', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  )
}
