import { useEffect } from 'react'

const MOBILE_MQ = '(max-width: 767px)'

export function useHomeMobileMotion() {
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    if (!mq.matches) return undefined

    const easeOut = (p) => 1 - (1 - p) ** 3

    const startCount = (el) => {
      const target = parseFloat(el.dataset.count)
      if (Number.isNaN(target)) return
      const dur = 1300
      const t0 = performance.now()
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1)
        el.textContent = String(Math.round(easeOut(p) * target))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    const revealTargets = document.querySelectorAll('[data-home-reveal]')
    const countTargets = document.querySelectorAll('.home [data-count]')
    let io

    const revealOne = (el) => {
      el.classList.add('is-in')
      if (el.hasAttribute('data-count')) startCount(el)
    }

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            revealOne(entry.target)
            io.unobserve(entry.target)
          })
        },
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
      )
      revealTargets.forEach((node) => io.observe(node))
      countTargets.forEach((node) => {
        if (!node.hasAttribute('data-home-reveal')) io.observe(node)
      })
    } else {
      revealTargets.forEach((node) => revealOne(node))
      countTargets.forEach((node) => {
        if (!node.hasAttribute('data-home-reveal')) startCount(node)
      })
    }

    const bar = document.querySelector('.home-m-progress__bar')
    const parallaxNodes = document.querySelectorAll('[data-home-parallax]')
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const st = window.scrollY
        const max = document.documentElement.scrollHeight - window.innerHeight
        if (bar) {
          bar.style.transform = `scaleX(${max > 0 ? st / max : 0})`
        }
        parallaxNodes.forEach((el) => {
          const k = parseFloat(el.dataset.homeParallax) || 0.06
          el.style.transform = `translate3d(0, ${st * k}px, 0)`
        })
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const onMqChange = (e) => {
      if (!e.matches) {
        if (io) io.disconnect()
        window.removeEventListener('scroll', onScroll)
        if (bar) bar.style.transform = 'scaleX(0)'
        parallaxNodes.forEach((el) => {
          el.style.transform = ''
        })
      }
    }

    mq.addEventListener('change', onMqChange)

    return () => {
      if (io) io.disconnect()
      window.removeEventListener('scroll', onScroll)
      mq.removeEventListener('change', onMqChange)
    }
  }, [])
}
