import { useState, useCallback, useRef } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useScrollAnimation } from '@hooks/useScrollAnimation'
import { cn } from '@utils/cn'
import './Services.css'

/* ─────────────────────────────────────────────────────────────
   SVG ICON MAP
   Inline SVGs keyed by the icon string in translations.
   All 24×24 viewBox, stroke-based, currentColor.
───────────────────────────────────────────────────────────── */
const ICONS = {
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/><path d="M2 12h20"/>
    </svg>
  ),
  gavel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m14 13-8.5 8.5a2.12 2.12 0 1 1-3-3L11 10"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/>
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01"/>
    </svg>
  ),
  contracts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/><path d="M13 17c.55-.87 1.46-1 2-1 1.1 0 2 .9 2 2s-.9 2-2 2c-.54 0-1.45-.13-2-1"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  bank: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  governance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="4" rx="1"/><rect x="2" y="18" width="6" height="4" rx="1"/><rect x="16" y="18" width="6" height="4" rx="1"/><path d="M12 6v4m0 0H5a1 1 0 0 0-1 1v3m8-4h7a1 1 0 0 1 1 1v3"/>
    </svg>
  ),
  arbitration: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21"/><path d="M5 21h14"/><path d="M3 6l4 4 4-4"/><path d="M13 6l4 4 4-4"/><line x1="3" y1="6" x2="9" y2="6"/><line x1="15" y1="6" x2="21" y2="6"/>
    </svg>
  ),
  contractors: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18h20"/><path d="M4 18v-2a8 8 0 0 1 16 0v2"/><path d="M12 6V2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>
    </svg>
  ),
  sports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
    </svg>
  ),
  insurance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"/>
    </svg>
  ),
  taxes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="15" x2="16" y2="9"/><circle cx="9" cy="9.5" r="0.5" fill="currentColor"/><circle cx="15" cy="14.5" r="0.5" fill="currentColor"/>
    </svg>
  ),
  wills: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  mediation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 11l-4 4-2-2"/>
    </svg>
  ),
  notary: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
}

/* ─────────────────────────────────────────────────────────────
   DETAIL PANEL — the right (LTR) / left (RTL) display panel
───────────────────────────────────────────────────────────── */
function ServiceDetail({ service, isRTL }) {
  if (!service) return null
  const icon = ICONS[service.icon] ?? ICONS.briefcase

  return (
    <div className="srv-detail" key={service.id}>
      {/* Large ghost index number — decorative depth */}
      <span className="srv-detail__ghost" aria-hidden="true">
        {String(service.id).padStart(2, '0')}
      </span>

      <div className="srv-detail__body">
        {/* Icon */}
        <div className="srv-detail__icon" aria-hidden="true">
          {icon}
        </div>

        {/* Title */}
        <h3 className="srv-detail__title">{service.title}</h3>

        {/* Divider */}
        <div className="srv-detail__rule" aria-hidden="true" />

        {/* Description */}
        <p className="srv-detail__desc">{service.desc}</p>

        {/* CTA */}
        <a href="#contact" className="srv-detail__cta">
          <span>{isRTL ? 'استشارة مجانية' : 'Free Consultation'}</span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN SERVICES COMPONENT
───────────────────────────────────────────────────────────── */
export default function Services() {
  const { t, isRTL } = useLanguage()
  const { ref: animRef, isVisible } = useScrollAnimation({ threshold: 0.1 })

  // Callback ref: attaches both the animation observer ref and our scroll ref
  // to the same <section> element without needing a wrapper div.
  const setSectionRef = useCallback((el) => {
    sectionRef.current = el
    animRef.current    = el
  }, [animRef])

  const { eyebrow, headline, body, items } = t.services
  const [activeId, setActiveId] = useState(1)
  const sectionRef = useRef(null)   // target for scroll-to-top on item click

  const activeService = items.find(s => s.id === activeId) ?? items[0]

  const handleSelect = useCallback((id) => {
    setActiveId(id)
    // Scroll the section's top edge into view so the sticky detail panel
    // is fully visible — works for both lower-list items and mobile stacked layout
    if (sectionRef.current) {
      const top = sectionRef.current.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  return (
    <section
      id="services"
      className={cn('srv', isVisible && 'srv--visible', isRTL && 'srv--rtl')}
      ref={setSectionRef}
    >
      {/* ── Background texture ───────────────────────────── */}
      <div className="srv__bg-grid" aria-hidden="true" />

      <div className="srv__inner">

        {/* ══ LIST PANEL ══════════════════════════════════ */}
        <div className="srv__list-panel">

          {/* Section header */}
          <header className="srv__header">
            <span className="srv__eyebrow">{eyebrow}</span>
            <h2 className="srv__headline">
              {headline.split('\\n').map((line, i) => (
                <span key={i} className="srv__headline-line">{line}</span>
              ))}
            </h2>
            <p className="srv__body">{body}</p>
          </header>

          {/* Service list */}
          <nav className="srv__list" aria-label={isRTL ? 'قائمة الخدمات' : 'Services list'}>
            {items.map((item) => (
              <button
                key={item.id}
                className={cn('srv__item', activeId === item.id && 'srv__item--active')}
                onClick={() => handleSelect(item.id)}
                aria-current={activeId === item.id ? 'true' : undefined}
                style={{ '--i': item.id }}
              >
                <span className="srv__item-num">
                  {String(item.id).padStart(2, '0')}
                </span>
                <span className="srv__item-title">{item.title}</span>
                <span className="srv__item-arrow" aria-hidden="true">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6h8M7 3l3 3-3 3"/>
                  </svg>
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* ══ DETAIL PANEL ════════════════════════════════ */}
        <div className="srv__detail-panel">
          <div className="srv__detail-sticky">
            <ServiceDetail service={activeService} isRTL={isRTL} />
          </div>
        </div>

      </div>
    </section>
  )
}