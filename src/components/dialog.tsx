import WaDialog from '@awesome.me/webawesome/dist/react/dialog/index.js'
import React from 'react'

type DialogProps = {
  title: string
  onClose: () => void
  children: React.ReactNode
  width?: string
}

export function Dialog({title, onClose, children, width = 'min(42rem, calc(100vw - 2rem))'}: DialogProps) {
  return (
    <WaDialog
      open
      lightDismiss
      label={title}
      withoutHeader
      onWaHide={() => onClose()}
      className="app-dialog"
      style={
        {
          '--width': width,
          '--spacing': '0px'
        } as React.CSSProperties
      }
    >
      <div className="app-dialog__surface">
        <div className="app-dialog__header">
          <h2 className="app-dialog__title">{title}</h2>
          <button type="button" className="app-dialog__close" onClick={onClose} aria-label={`Close ${title}`}>
            <span aria-hidden="true">x</span>
          </button>
        </div>
        <div className="app-dialog__body">{children}</div>
      </div>
    </WaDialog>
  )
}
