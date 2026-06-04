import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Remonte en haut de page à chaque changement de route */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (typeof window.history.scrollRestoration !== 'undefined') {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
