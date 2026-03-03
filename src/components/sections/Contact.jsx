import { useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useScrollAnimation } from '@hooks/useScrollAnimation'
import { cn } from '@utils/cn'
import './Contact.css'

/*
  CONTACT SECTION
  ───────────────────────────────────────────────────────────
  Layout (desktop): two columns
    LTR — info panel left, form right
    RTL — info panel right, form left  (dir=rtl handles naturally)

  Info panel: address, phone (tel: link), whatsapp (wa.me link),
              email (mailto: link), hours.
  Form: name, phone, email, subject, description textarea.
        48-hour note beneath submit.
  All links open native apps on mobile.
*/

/* ── Contact info link component ─────────────────────────── */
function InfoRow({ icon, label, value, href, valueLtr }) {
  const Tag = href ? 'a' : 'div'
  const props = href
    ? { href, target: href.startsWith('http') ? '_blank' : undefined,
        rel: href.startsWith('http') ? 'noopener noreferrer' : undefined }
    : {}

  return (
    <Tag className={cn('ci-row', href && 'ci-row--link')} {...props}>
      <span className="ci-row__icon" aria-hidden="true">{icon}</span>
      <div className="ci-row__text">
        <span className="ci-row__label">{label}</span>
        <span className="ci-row__value" dir={valueLtr ? "ltr" : undefined}>{value}</span>
      </div>
      {href && (
        <span className="ci-row__arrow" aria-hidden="true">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6h8M7 3l3 3-3 3"/>
          </svg>
        </span>
      )}
    </Tag>
  )
}

/* ── SVG icons ───────────────────────────────────────────── */
const IconAddress = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
)
const IconEmail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IconHours = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

/* ── Main component ──────────────────────────────────────── */
export default function Contact() {
  const { t, isRTL } = useLanguage()
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  const { eyebrow, headline, body, note, form, info } = t.contact

  // Form state
  const [fields, setFields]   = useState({ name: '', phone: '', email: '', subject: '', description: '' })
  const [status, setStatus]   = useState('idle')  // idle | sending | success | error
  const [errors, setErrors]   = useState({})

  const update = (field) => (e) => {
    setFields(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!fields.name.trim())        e.name        = isRTL ? 'مطلوب' : 'Required'
    if (!fields.email.trim())       e.email       = isRTL ? 'مطلوب' : 'Required'
    if (!fields.subject.trim())     e.subject     = isRTL ? 'مطلوب' : 'Required'
    if (!fields.description.trim()) e.description = isRTL ? 'مطلوب' : 'Required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('sending')
    // Replace with real submission logic (fetch/email service)
    setTimeout(() => setStatus('success'), 1500)
  }

  // Build action hrefs
  // tel: strips spaces, opens phone dialler
  const telHref      = `tel:${info.phone.replace(/\s/g, '')}`
  // wa.me: international number without leading +
  const waNumber     = info.whatsapp.replace(/[^0-9]/g, '')
  const waHref       = `https://wa.me/${waNumber}`
  // mailto: opens default mail client
  const mailHref     = `mailto:${info.email}`

  return (
    <section
      id="contact"
      className={cn('ct', isVisible && 'ct--visible', isRTL && 'ct--rtl')}
      ref={ref}
    >
      {/* Ambient glows */}
      <div className="ct__glow ct__glow--a" aria-hidden="true" />
      <div className="ct__glow ct__glow--b" aria-hidden="true" />

      <div className="ct__inner">

        {/* ══ INFO PANEL ══════════════════════════════════ */}
        <aside className="ct__info">

          <header className="ct__header">
            <span className="ct__eyebrow">{eyebrow}</span>
            <h2 className="ct__headline">
              {headline.split('\\n').map((line, i) => (
                <span key={i} className="ct__headline-line">{line}</span>
              ))}
            </h2>
            <p className="ct__body">{body}</p>
          </header>

          <div className="ct__info-rows">
            <InfoRow
              icon={<IconAddress />}
              label={info.address_label}
              value={info.address}
              isRTL={isRTL}
            />
            <InfoRow
              icon={<IconPhone />}
              label={info.phone_label}
              value={info.phone_display}
              href={telHref}
              valueLtr
              isRTL={isRTL}
            />
            <InfoRow
              icon={<IconWhatsApp />}
              label={info.whatsapp_label}
              value={info.whatsapp_display}
              href={waHref}
              valueLtr
              isRTL={isRTL}
            />
            <InfoRow
              icon={<IconEmail />}
              label={info.email_label}
              value={info.email}
              href={mailHref}
              isRTL={isRTL}
            />
            <InfoRow
              icon={<IconClock />}
              label={info.hours_label}
              value={info.hours}
              isRTL={isRTL}
            />
          </div>
        </aside>

        {/* ══ FORM PANEL ══════════════════════════════════ */}
        <div className="ct__form-wrap">
          {status === 'success' ? (
            <div className="ct__success">
              <span className="ct__success-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="24" r="22"/>
                  <polyline points="14 24 21 31 34 17"/>
                </svg>
              </span>
              <p className="ct__success-msg">{form.success}</p>
            </div>
          ) : (
            <form
              className="ct__form"
              onSubmit={handleSubmit}
              noValidate
              aria-label={isRTL ? 'نموذج التواصل' : 'Contact form'}
            >

              {/* Row 1: Name + Phone */}
              <div className="ct__row">
                <div className={cn('ct__field', errors.name && 'ct__field--error')}>
                  <label className="ct__label" htmlFor="ct-name">{form.name}</label>
                  <input
                    id="ct-name"
                    className="ct__input"
                    type="text"
                    placeholder={form.name_ph}
                    value={fields.name}
                    onChange={update('name')}
                    autoComplete="name"
                  />
                  {errors.name && <span className="ct__error">{errors.name}</span>}
                </div>

                <div className="ct__field">
                  <label className="ct__label" htmlFor="ct-phone">{form.phone}</label>
                  <input
                    id="ct-phone"
                    className="ct__input"
                    type="tel"
                    placeholder={form.phone_ph}
                    value={fields.phone}
                    onChange={update('phone')}
                    autoComplete="tel"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Row 2: Email + Subject */}
              <div className="ct__row">
                <div className={cn('ct__field', errors.email && 'ct__field--error')}>
                  <label className="ct__label" htmlFor="ct-email">{form.email}</label>
                  <input
                    id="ct-email"
                    className="ct__input"
                    type="email"
                    placeholder={form.email_ph}
                    value={fields.email}
                    onChange={update('email')}
                    autoComplete="email"
                    dir="ltr"
                  />
                  {errors.email && <span className="ct__error">{errors.email}</span>}
                </div>

                <div className={cn('ct__field', errors.subject && 'ct__field--error')}>
                  <label className="ct__label" htmlFor="ct-subject">{form.subject}</label>
                  <input
                    id="ct-subject"
                    className="ct__input"
                    type="text"
                    placeholder={form.subject_ph}
                    value={fields.subject}
                    onChange={update('subject')}
                  />
                  {errors.subject && <span className="ct__error">{errors.subject}</span>}
                </div>
              </div>

              {/* Row 3: Description (full width) */}
              <div className={cn('ct__field', errors.description && 'ct__field--error')}>
                <label className="ct__label" htmlFor="ct-desc">{form.description}</label>
                <textarea
                  id="ct-desc"
                  className="ct__textarea"
                  placeholder={form.description_ph}
                  value={fields.description}
                  onChange={update('description')}
                  rows={5}
                />
                {errors.description && <span className="ct__error">{errors.description}</span>}
              </div>

              {/* Submit row */}
              <div className="ct__submit-row">
                <button
                  type="submit"
                  className={cn('ct__submit', status === 'sending' && 'ct__submit--sending')}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? form.sending : form.submit}
                  {status !== 'sending' && (
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4"/>
                    </svg>
                  )}
                </button>

                {/* 48-hour note */}
                <p className="ct__note">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="8" cy="8" r="7"/>
                    <polyline points="8 5 8 8 10 9"/>
                  </svg>
                  {note}
                </p>
              </div>

              {status === 'error' && (
                <p className="ct__form-error">{form.error}</p>
              )}
            </form>
          )}
        </div>

      </div>
    </section>
  )
}