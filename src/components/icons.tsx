import React from 'react'

type IconProps = {
  size?: number
  className?: string
}

type SvgIconProps = IconProps & React.SVGProps<SVGSVGElement>

function SvgIcon({children, size = 16, ...props}: SvgIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
    </SvgIcon>
  )
}

export function DashIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M3 8a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 8Z" />
    </SvgIcon>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M6.5 1.75A1.75 1.75 0 0 0 4.75 3.5v.25H2.5a.75.75 0 0 0 0 1.5h.5v7A1.75 1.75 0 0 0 4.75 14h6.5A1.75 1.75 0 0 0 13 12.25v-7h.5a.75.75 0 0 0 0-1.5h-2.25V3.5A1.75 1.75 0 0 0 9.5 1.75h-3Zm3.25 2V3.5a.25.25 0 0 0-.25-.25h-3a.25.25 0 0 0-.25.25v.25h3.5Zm-4.25 1.5v7a.25.25 0 0 0 .25.25h6.5a.25.25 0 0 0 .25-.25v-7h-7Zm1.75 1.25a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Zm3.5 0a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z" />
    </SvgIcon>
  )
}

export function CheckCircleFillIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8 1.25a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5Zm3.03 4.78-3.5 4a.75.75 0 0 1-1.1.04L4.9 8.54a.75.75 0 1 1 1.06-1.06l.96.96 2.95-3.36a.75.75 0 1 1 1.16.95Z" />
    </SvgIcon>
  )
}

export function XCircleIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8 1.25a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5Zm2.28 8.22a.75.75 0 1 1-1.06 1.06L8 9.31l-1.22 1.22a.75.75 0 1 1-1.06-1.06L6.94 8.25 5.72 7.03a.75.75 0 0 1 1.06-1.06L8 7.19l1.22-1.22a.75.75 0 1 1 1.06 1.06L9.06 8.25l1.22 1.22Z" />
    </SvgIcon>
  )
}
