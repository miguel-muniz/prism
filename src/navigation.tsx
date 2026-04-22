import {useEffect} from 'react'
import type {NavigateFunction, NavigateOptions, To} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'

let navigateRef: NavigateFunction | undefined

export function navigate(to: To, options?: NavigateOptions) {
  navigateRef?.(to, options)
}

export function NavigationProvider() {
  const navigate = useNavigate()

  useEffect(() => {
    navigateRef = navigate

    return () => {
      if (navigateRef === navigate) {
        navigateRef = undefined
      }
    }
  }, [navigate])

  return null
}
