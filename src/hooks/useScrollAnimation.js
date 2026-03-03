import { useEffect, useRef, useState } from 'react'

/**
 * Triggers a CSS class when the element enters the viewport.
 *
 * @param {Object} options
 * @param {number}  options.threshold  - 0–1, portion of element visible before triggering (default: 0.15)
 * @param {string}  options.rootMargin - CSS margin string (default: '0px')
 * @param {boolean} options.once       - only trigger once (default: true)
 *
 * @returns {{ ref, isVisible }}
 */
export function useScrollAnimation({
  threshold = 0.15,
  rootMargin = '0px',
  once = true,
} = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(element)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isVisible }
}