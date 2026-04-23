import {render} from '@testing-library/react'
import React from 'react'
import {vi} from 'vitest'
import {GlobalStateProvider} from './global-state'

vi.mock('react-hotkeys-hook', () => ({
  useHotkeys: () => undefined
}))

vi.mock('./components/button', () => ({
  Button: ({children, ...props}: any) => <button {...props}>{children}</button>,
  IconButton: ({children, icon: Icon, ...props}: any) => (
    <button {...props}>{children ?? (Icon ? <Icon /> : null)}</button>
  ),
  ButtonGroup: ({children, ...props}: any) => <div {...props}>{children}</div>
}))

import {App} from './app'

test('renders without crashing', () => {
  render(
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  )
})
