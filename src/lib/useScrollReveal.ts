import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timeout = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
      )

      const elements = document.querySelectorAll('.animate-on-scroll')
      elements.forEach((el) => observer.observe(el))

      return () => observer.disconnect()
    }, 100)

    return () => clearTimeout(timeout)
  }, [])
}
