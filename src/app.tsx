import React from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {routePrefix} from './constants'
import {useGlobalState} from './global-state'
import {NavigationProvider} from './navigation'
import {Index} from './pages'
import {Curve} from './pages/curve'
import {NotFound} from './pages/not-found'
import {Palette, PaletteIndex} from './pages/palette'
import {Scale} from './pages/scale'

export function App() {
  const [, send] = useGlobalState()

  useHotkeys('command+z, ctrl+z', () => {
    send('UNDO')
  })
  useHotkeys('command+shift+z, ctrl+shift+z', () => {
    send('REDO')
  })

  return (
    <BrowserRouter>
      <NavigationProvider />
      <Routes>
        <Route path={`${routePrefix}/`} element={<Index />} />
        <Route path={`${routePrefix}/local/:paletteId`} element={<Palette />}>
          <Route index element={<PaletteIndex />} />
          <Route path="scale/:scaleId" element={<Scale />} />
          <Route path="curve/:curveId" element={<Curve />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
