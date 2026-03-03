import { useLanguage } from '@hooks/useLanguage'
import { cn } from '@utils/cn'
import './Footer.css'

const NAV_LINKS = [
  { id: 'about',    labelEn: 'About',    labelAr: 'من نحن'   },
  { id: 'team',     labelEn: 'Team',     labelAr: 'فريقنا'   },
  { id: 'services', labelEn: 'Services', labelAr: 'خدماتنا'  },
  { id: 'contact',  labelEn: 'Contact',  labelAr: 'تواصل معنا'},
]

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Footer() {
  const { t, isRTL } = useLanguage()
  const { tagline, rights, privacy, terms } = t.footer
  const { info } = t.contact

  const telHref  = `tel:${info.phone.replace(/\s/g, '')}`
  const waNumber = info.whatsapp.replace(/[^0-9]/g, '')
  const waHref   = `https://wa.me/${waNumber}`
  const mailHref = `mailto:${info.email}`

  return (
    <footer className={cn('ft', isRTL && 'ft--rtl')} id="footer">

      {/* Top accent line */}
      <div className="ft__rule" aria-hidden="true" />

      <div className="ft__inner">

        {/* ── Brand column ─────────────────────────────── */}
        <div className="ft__brand">
          <a href="#hero" className="ft__logo" onClick={(e) => { e.preventDefault(); scrollTo('hero') }} aria-label={isRTL ? 'روح القانون — الرئيسية' : 'Spirit of Law — Home'}>
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className="ft__logo-img" aria-hidden="true" />
            <div className="ft__logo-text">
              <span className="ft__logo-primary">{isRTL ? 'روح النظام' : 'Spirit of Law'}</span>
              <span className="ft__logo-secondary">{isRTL ? 'للمحاماة والاستشارات القانونية' : 'Law Firm'}</span>
            </div>
          </a>
          <p className="ft__tagline">{tagline}</p>
        </div>

        {/* ── Quick links column ───────────────────────── */}
        <nav className="ft__nav" aria-label={isRTL ? 'روابط سريعة' : 'Quick links'}>
          <span className="ft__col-heading">{isRTL ? 'روابط سريعة' : 'Quick Links'}</span>
          <ul className="ft__nav-list">
            {NAV_LINKS.map(link => (
              <li key={link.id}>
                <button
                  className="ft__nav-link"
                  onClick={() => scrollTo(link.id)}
                >
                  {isRTL ? link.labelAr : link.labelEn}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Contact column ───────────────────────────── */}
        <div className="ft__contact">
          <span className="ft__col-heading">{isRTL ? 'تواصل معنا' : 'Contact'}</span>
          <ul className="ft__contact-list">
            <li>
              <a href={telHref} className="ft__contact-link">
                <span className="ft__contact-label">{info.phone_label}</span>
                <span className="ft__contact-value" dir="ltr">{info.phone_display}</span>
              </a>
            </li>
            <li>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="ft__contact-link">
                <span className="ft__contact-label">{info.whatsapp_label}</span>
                <span className="ft__contact-value" dir="ltr">{info.whatsapp_display}</span>
              </a>
            </li>
            <li>
              <a href={mailHref} className="ft__contact-link">
                <span className="ft__contact-label">{info.email_label}</span>
                <span className="ft__contact-value">{info.email}</span>
              </a>
            </li>
            <li className="ft__address">
              <span className="ft__contact-label">{info.address_label}</span>
              <span className="ft__contact-value">{info.address}</span>
            </li>
          </ul>
        </div>

      </div>

      {/* ── Bottom bar ───────────────────────────────────── */}
      <div className="ft__bottom">
        <span className="ft__rights">{rights}</span>
        <div className="ft__legal-links">
          <a href="/privacy" className="ft__legal-link">{privacy}</a>
          <span className="ft__sep" aria-hidden="true">·</span>
          <a href="/terms"   className="ft__legal-link">{terms}</a>
        </div>
      </div>

    </footer>
  )
}