import {render} from '@testing-library/react'
import React from 'react'
import {App} from './app'
import {GlobalStateProvider} from './global-state'

test('renders without crashing', () => {
  render(
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  )
})
