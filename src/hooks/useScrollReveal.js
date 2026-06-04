import { useEffect } from 'react'

export function useScrollReveal(className = 'reveal') {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible')
            }, i * 100)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const nodes = document.querySelectorAll(`.${className}`)
    nodes.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [className])
}
