import { useEffect, useRef, useState } from 'react'
import { useBelAgeMobileFx } from '../../hooks/useMediaQuery'

const TAP_TARGETS =
  'a[href], button, .pack-m-btn, .pack-m-hero-teaser, .pack-m-hero-jstep, .pack-m-sticky__cta, .pack-m-tile__head, .navbar__link, .navbar__drawer-link, .navbar__burger, .navbar__icon-btn, .home-m-cta__btn'

const MAX_BURSTS = 6
const SPARKLE_COUNT = 12

function buildSparkles() {
  return Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
    id: i,
    angle: (i / SPARKLE_COUNT) * 360 + (Math.random() * 24 - 12),
    dist: 32 + Math.random() * 40,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 0.06,
  }))
}

export function useMobileTapFx() {
  const isMobile = useBelAgeMobileFx()
  const [bursts, setBursts] = useState([])
  const burstId = useRef(0)
  const litTimers = useRef(new Map())

  useEffect(() => {
    if (!isMobile) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const clearLit = (target) => {
      const timer = litTimers.current.get(target)
      if (timer) window.clearTimeout(timer)
      target.classList.remove('belage-mfx-tap-lit')
      litTimers.current.delete(target)
    }

    const spawnBurst = (x, y, target) => {
      const id = ++burstId.current
      setBursts((prev) => [
        ...prev.slice(-(MAX_BURSTS - 1)),
        { id, x, y, sparkles: buildSparkles() },
      ])

      if (target) {
        clearLit(target)
        target.classList.add('belage-mfx-tap-lit')
        litTimers.current.set(
          target,
          window.setTimeout(() => clearLit(target), 720),
        )
      }

      window.setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id))
      }, 900)
    }

    const onPointerDown = (event) => {
      if (event.button !== 0) return
      const target = event.target.closest(TAP_TARGETS)
      if (!target) return

      spawnBurst(event.clientX, event.clientY, target)
    }

    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      litTimers.current.forEach((timer) => window.clearTimeout(timer))
      litTimers.current.clear()
    }
  }, [isMobile])

  return isMobile ? bursts : []
}
