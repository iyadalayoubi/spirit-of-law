import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@hooks/useLanguage'
import { useActiveSection } from '@hooks/useActiveSection'
import { cn } from '@utils/cn'
import './Navbar.css'

const SECTION_IDS = ['hero', 'about', 'team', 'services', 'contact']
const HERO_THRESHOLD = 80

export default function Navbar() {
  const { t, toggleLanguage, isRTL } = useLanguage()
  const activeSection = useActiveSection(SECTION_IDS)

  const [visible, setVisible]           = useState(false)
  const [scrolled, setScrolled]         = useState(false)
  const [hideOnScroll, setHideOnScroll] = useState(false)
  const [menuOpen, setMenuOpen]         = useState(false)

  const lastScrollY = useRef(0)

  // Show navbar when Hero video ends
  useEffect(() => {
    const onVideoEnd = () => setVisible(true)
    window.addEventListener('hero-video-ended', onVideoEnd)
    return () => window.removeEventListener('hero-video-ended', onVideoEnd)
  }, [])

  // Scroll: blur effect + hide on scroll down + fallback reveal
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      const prev = lastScrollY.current

      if (y > HERO_THRESHOLD) setVisible(true)
      setScrolled(y > HERO_THRESHOLD + 20)

      if (y > prev + 8 && y > 300) {
        setHideOnScroll(true)
      } else if (y < prev - 4) {
        setHideOnScroll(false)
      }

      lastScrollY.current = y
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { id: 'hero',     label: t.nav.home },
    { id: 'about',    label: t.nav.about },
    { id: 'team',     label: t.nav.team },
    { id: 'services', label: t.nav.services },
    { id: 'contact',  label: t.nav.contact },
  ]

  const handleNavClick = (id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className={cn(
          'navbar',
          visible      && 'navbar--visible',
          scrolled     && 'navbar--scrolled',
          hideOnScroll && !menuOpen && 'navbar--hidden',
          menuOpen     && 'navbar--menu-open',
        )}
        role="banner"
      >
        <div className="navbar__inner container">

          {/* Logo */}
          <Link
            to="/"
            className="navbar__logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={isRTL ? 'روح النظام — الرئيسية' : 'Spirit of Law — Home'}
          >
            <img
              src="/logo.svg"
              alt="Spirit of Law"
              className="navbar__logo-mark"
            />
            <span className="navbar__logo-text">
              <span className="navbar__logo-primary">
                {isRTL ? 'روح النظام' : 'Spirit of Law'}
              </span>
              <span className="navbar__logo-secondary">
                {isRTL ? 'للمحاماة والاستشارات القانونية' : 'Law Firm'}
              </span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="navbar__links" aria-label={isRTL ? 'التنقل الرئيسي' : 'Main navigation'}>
            {navLinks.map((link) => (
              <button
                key={link.id}
                className={cn('navbar__link', activeSection === link.id && 'navbar__link--active')}
                onClick={() => handleNavClick(link.id)}
              >
                {link.label}
                <span className="navbar__link-underline" aria-hidden="true" />
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div className="navbar__controls">
            <LangToggle isRTL={isRTL} onToggle={toggleLanguage} />
            <button
              className={cn('navbar__burger', menuOpen && 'navbar__burger--open')}
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? t.nav.menuClose : t.nav.menuOpen}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn('mobile-menu', menuOpen && 'mobile-menu--open')}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu__backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />
        <nav className="mobile-menu__panel">
          <div className="mobile-menu__header">
            <img
              src="/logo.svg"
              alt="Spirit of Law"
              className="navbar__logo-mark navbar__logo-mark--sm"
            />
            <button className="mobile-menu__close" onClick={() => setMenuOpen(false)} aria-label={t.nav.menuClose}>
              <CloseIcon />
            </button>
          </div>

          <ul className="mobile-menu__links">
            {navLinks.map((link, i) => (
              <li key={link.id} className="mobile-menu__item" style={{ '--delay': `${i * 0.06}s` }}>
                <button
                  className={cn('mobile-menu__link', activeSection === link.id && 'mobile-menu__link--active')}
                  onClick={() => handleNavClick(link.id)}
                >
                  <span className="mobile-menu__num">0{i + 1}</span>
                  <span>{link.label}</span>
                  <span className="mobile-menu__arrow" aria-hidden="true">›</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mobile-menu__footer">
            <LangToggle isRTL={isRTL} onToggle={toggleLanguage} large />
          </div>
        </nav>
      </div>
    </>
  )
}

/* ── Language Toggle ──────────────────────────────────────────── */
function LangToggle({ isRTL, onToggle, large = false }) {
  return (
    <button
      className={cn('lang-toggle', large && 'lang-toggle--large')}
      onClick={onToggle}
      aria-label={isRTL ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span className={cn('lang-toggle__option', !isRTL && 'lang-toggle__option--active')}>EN</span>
      <span className="lang-toggle__track" aria-hidden="true">
        <span className={cn('lang-toggle__pill', isRTL && 'lang-toggle__pill--right')} />
      </span>
      <span className={cn('lang-toggle__option', isRTL && 'lang-toggle__option--active')}>ع</span>
    </button>
  )
}

/* ── Close Icon ───────────────────────────────────────────────── */
function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}