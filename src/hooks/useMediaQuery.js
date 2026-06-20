import { useEffect, useState } from 'react'

/**
 * true quand la media query correspond (ex. mobile / tablette carte).
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Carte : comportement tactile / scroll page (sidebar masquée) */
export function useCarteTouchLayout() {
  return useMediaQuery('(max-width: 1279px)')
}

/** Layout mobile app (fiches bulles, bottom sheets) */
export function useMobileLayout() {
  return useMediaQuery('(max-width: 767px)')
}

/** FX Bel Âge + layouts mobile/tablette (<1024px) */
export function useBelAgeMobileFx() {
  return useMediaQuery('(max-width: 1023px)')
}
