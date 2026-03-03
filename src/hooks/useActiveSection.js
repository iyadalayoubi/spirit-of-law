import { useEffect, useState } from 'react'

/**
 * Tracks the currently visible section ID based on scroll position.
 *
 * @param {string[]} sectionIds - Array of section element IDs to watch
 * @param {number}   offset     - Pixels from top to consider "active" (default: 100)
 * @returns {string} activeSection - The ID of the currently active section
 */
export function useActiveSection(sectionIds, offset = 100) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '')

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + offset

      // Walk sections in reverse to find the one we've scrolled past
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sectionIds[i])
          return
        }
      }
      setActiveSection(sectionIds[0])
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // run once on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionIds, offset])

  return activeSection
}