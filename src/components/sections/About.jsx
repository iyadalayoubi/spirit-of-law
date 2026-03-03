import { useEffect, useRef, useState, useMemo } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { cn } from '@utils/cn'
import './About.css'

/*
  SCROLL-DRIVEN ABOUT SECTION — 400vh tall, sticky inner viewport
  Slide 0: Who We Are + Stats   (word highlight → stats open, locked until done)
  Slide 1: Vision & Mission     (magnifier cycles through explicit key-word indices)
  Slide 2: Why Us               (click-to-flip cards, reset on leave)
*/

/* ─────────────────────────────────────────────────────────────
   WORD HIGHLIGHTER
   Fires word-by-word when `active` becomes true.
   Calls onDone after the last word's CSS transition ends.
───────────────────────────────────────────────────────────── */
function WordHighlighter({ text, active, onDone }) {
  const words      = text.split(' ')
  const WORD_DELAY = 0.055   // s stagger between words
  const WORD_DUR   = 0.35    // s CSS transition duration
  const totalMs    = ((words.length - 1) * WORD_DELAY + WORD_DUR) * 1000 + 100

  const timerRef = useRef(null)
  useEffect(() => {
    clearTimeout(timerRef.current)
    if (!active || !onDone) return
    timerRef.current = setTimeout(onDone, totalMs)
    return () => clearTimeout(timerRef.current)
  }, [active, totalMs, onDone])

  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className={cn('wh__word', active && 'wh__word--lit')}
          style={{ transitionDelay: active ? `${i * WORD_DELAY}s` : '0s' }}
        >
          {word}{' '}
        </span>
      ))}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAGNIFIER TEXT
   Accepts pre-split `words` array and `keyIndices` (word positions).
   Cycles the glowing highlight through key words every 1800 ms.
───────────────────────────────────────────────────────────── */
function MagnifierText({ words, keyIndices, active }) {
  const [mag, setMag] = useState(0)
  const ivRef = useRef(null)

  useEffect(() => {
    // Clear any running interval whenever deps change
    clearInterval(ivRef.current)

    if (!active || !keyIndices.length) return

    ivRef.current = setInterval(
      () => setMag(p => (p + 1) % keyIndices.length),
      1800
    )
    // On cleanup: stop interval and schedule reset asynchronously
    // (never call setState synchronously in effect cleanup — use a timer)
    return () => {
      clearInterval(ivRef.current)
      const id = setTimeout(() => setMag(0), 0)
      // Store id nowhere — it fires once immediately, no cancel needed
      void id
    }
  }, [active, keyIndices.length])

  return (
    <p className="vm__text">
      {words.map((w, i) => (
        <span key={i} className={cn(
          'vm__word',
          keyIndices.includes(i) && 'vm__word--key',
          i === keyIndices[mag] && active && 'vm__word--mag'
        )}>
          {w}{' '}
        </span>
      ))}
    </p>
  )
}

/* ─────────────────────────────────────────────────────────────
   COUNTER — animates 0 → target when active becomes true
───────────────────────────────────────────────────────────── */
function Counter({ target, suffix, duration, active }) {
  const [n, setN] = useState(0)
  const rafRef    = useRef(null)

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    if (!active) {
      // Async reset — never call setState synchronously in effect body
      rafRef.current = requestAnimationFrame(() => setN(0))
      return () => cancelAnimationFrame(rafRef.current)
    }
    const t0 = performance.now()
    const run = now => {
      const p = Math.min((now - t0) / duration, 1)
      setN(Math.round((1 - (1 - p) ** 3) * target))
      if (p < 1) rafRef.current = requestAnimationFrame(run)
    }
    rafRef.current = requestAnimationFrame(run)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, target, duration])

  return <>{n.toLocaleString()}{suffix}</>
}

/* ─────────────────────────────────────────────────────────────
   FLIP CARD — click toggles front (image) ↔ back (details)
   resetSignal: incremented by parent when slide leaves → resets to front
───────────────────────────────────────────────────────────── */
function FlipCard({ card, resetSignal }) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    // resetSignal changes only when parent wants a reset — schedule async
    // to avoid synchronous setState in effect body
    const id = setTimeout(() => setFlipped(false), 0)
    return () => clearTimeout(id)
  }, [resetSignal])

  return (
    <button
      className={cn('fc', flipped && 'fc--flipped')}
      onClick={() => setFlipped(f => !f)}
      aria-label={flipped
        ? `Hide details for ${card.title}`
        : `Show details for ${card.title}`}
    >
      <div className="fc__inner">
        <div className="fc__face fc__face--front">
          <div
            className="fc__img"
            style={{
              backgroundImage:
                `url(${card.image || `/images/why-us-${card.id}.jpg`})`,
            }}
          />
          <div className="fc__front-overlay">
            <span className="fc__front-num">0{card.id}</span>
            <h3 className="fc__front-title">{card.title}</h3>
            <span className="fc__flip-hint">↩</span>
          </div>
        </div>
        <div className="fc__face fc__face--back">
          <span className="fc__back-num">0{card.id}</span>
          <h3 className="fc__back-title">{card.title}</h3>
          <p   className="fc__back-body">{card.body}</p>
          <span className="fc__flip-hint fc__flip-hint--back">↩</span>
        </div>
      </div>
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────
   WHY US GRID
───────────────────────────────────────────────────────────── */
function WhyUsGrid({ cards, active }) {
  const [resetSignal, setResetSignal] = useState(0)
  const wasActiveRef = useRef(false)

  useEffect(() => {
    const wasActive = wasActiveRef.current
    wasActiveRef.current = active
    if (wasActive && !active) {
      // Schedule async to avoid synchronous setState in effect body
      const id = setTimeout(() => setResetSignal(s => s + 1), 0)
      return () => clearTimeout(id)
    }
  }, [active])

  return (
    <div className="wu__grid">
      {cards.map(card => (
        <FlipCard key={card.id} card={card} resetSignal={resetSignal} />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SLIDE WRAPPER
───────────────────────────────────────────────────────────── */
function Slide({ children, state }) {
  return (
    <div className={cn('abt-slide', `abt-slide--${state}`)}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN ABOUT COMPONENT
───────────────────────────────────────────────────────────── */
const SLIDES        = 3
const TRANSITION_MS = 700

export default function About() {
  const { t, isRTL } = useLanguage()

  // ── Slide navigation state ────────────────────────────────
  const [slide,         setSlide]         = useState(0)
  const [incomingSlide, setIncomingSlide] = useState(0)
  const [outgoing,      setOutgoing]      = useState(null)
  const [direction,     setDirection]     = useState('fwd')
  const [transitioning, setTransitioning] = useState(false)

  // ── Slide 0 sequence state ────────────────────────────────
  // highlightActive starts false — words are dim until sequence fires,
  // giving WordHighlighter a real false→true edge to animate on.
  const [seq, setSeq] = useState({
    highlightActive: false,
    highlightDone:   false,
    statsOpen:       false,
    ready:           false,
  })

  // ── Refs (read in event handlers / timeouts, never in render) ─
  const sectionRef       = useRef(null)
  const transTimerRef    = useRef(null)
  const seq0TimersRef    = useRef([])       // timers for slide 0 sequence
  const slideRef         = useRef(0)        // mirrors slide state
  const transitioningRef = useRef(false)    // mirrors transitioning state
  const readyRef         = useRef(false)    // mirrors seq.ready

  // Derived: which slide is visually "on screen" right now
  const activeSlide = transitioning ? incomingSlide : slide

  /* ── Slide 0 sequence launcher ───────────────────────────
     Triggered by two events:
       A) IntersectionObserver fires when section first enters viewport
          (handles scrolling DOWN from Hero)
       B) Scroll handler detects backward move to slide 0
          (handles scrolling UP from slide 1+)
     Both call startSlide0Sequence().
  ─────────────────────────────────────────────────────────── */
  const startSlide0Sequence = () => {
    // Cancel any in-progress sequence timers
    seq0TimersRef.current.forEach(clearTimeout)
    seq0TimersRef.current = []
    readyRef.current = false

    // Reset synchronously via a single batched setState — this is called
    // from an effect callback or an event handler, NOT from effect body
    // directly, so it is safe.
    // Reset all — highlightActive false so words go dim immediately
    setSeq({ highlightActive: false, highlightDone: false, statsOpen: false, ready: false })

    // The word highlight duration (ms): last word delay + transition + buffer
    const words      = t.about.whoWeAre.split(' ')
    const highlightMs = ((words.length - 1) * 0.055 + 0.35) * 1000 + 150

    // After a short delay, flip highlightActive → true to start the word animation
    const startId = setTimeout(
      () => setSeq(s => ({ ...s, highlightActive: true })),
      50   // one frame — lets the dim state paint before animating
    )
    seq0TimersRef.current.push(startId)

    const push = (fn, ms) => {
      const id = setTimeout(fn, ms)
      seq0TimersRef.current.push(id)
      return id
    }

    // T+highlightMs  → stats panel opens
    push(() => setSeq(s => ({ ...s, highlightDone: true, statsOpen: true })), highlightMs)

    // T+highlightMs+2200 → scroll unlocked
    push(() => {
      readyRef.current = true
      setSeq(s => ({ ...s, ready: true }))
    }, highlightMs + 2200)
  }

  /* ── IntersectionObserver — fires when About enters viewport ─
     This is the primary trigger when scrolling DOWN from Hero.
     Threshold 0.1 fires as soon as ~10% of the section is visible,
     which for a 400vh section means the sticky panel is in view.
  ─────────────────────────────────────────────────────────────── */
  const hasEnteredRef = useRef(false)
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      if (!hasEnteredRef.current) {
        // First entry — start the slide 0 sequence
        hasEnteredRef.current = true
        startSlide0Sequence()
      }
    }, { threshold: 0.05 })

    obs.observe(el)
    return () => obs.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Slide state calculator ─────────────────────────────── */
  const getState = (i) => {
    if (transitioning) {
      if (i === outgoing)      return direction === 'fwd' ? 'out-fwd' : 'out-bwd'
      if (i === incomingSlide) return direction === 'fwd' ? 'in-fwd'  : 'in-bwd'
    } else {
      if (i === slide) return 'current'
    }
    return 'hidden'
  }

  /* ── Scroll → slide mapping ──────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el || transitioningRef.current) return

      const rect     = el.getBoundingClientRect()
      const scrolled = -rect.top
      const total    = el.offsetHeight - window.innerHeight
      if (total <= 0) return

      const progress  = Math.max(0, Math.min(1, scrolled / total))
      const rawTarget = Math.min(SLIDES - 1, Math.floor(progress * SLIDES + 0.15))

      // Gate: cannot advance past slide 0 until sequence is complete
      const targetSlide =
        rawTarget > 0 && slideRef.current === 0 && !readyRef.current
          ? 0
          : rawTarget

      if (targetSlide === slideRef.current) return

      const dir  = targetSlide > slideRef.current ? 'fwd' : 'bwd'
      const prev = slideRef.current

      slideRef.current         = targetSlide
      transitioningRef.current = true

      setOutgoing(prev)
      setDirection(dir)
      setIncomingSlide(targetSlide)
      setTransitioning(true)

      // If scrolling backward to slide 0, restart the sequence
      if (targetSlide === 0) {
        startSlide0Sequence()
      }

      clearTimeout(transTimerRef.current)
      transTimerRef.current = setTimeout(() => {
        transitioningRef.current = false
        setSlide(targetSlide)
        setTransitioning(false)
        setOutgoing(null)
      }, TRANSITION_MS)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Vision / Mission data ──────────────────────────────── */
  const visionData = useMemo(() => {
    const { text, keyWords } = t.about.vision
    const words = text.split(' ')
    const keyIndices = words.reduce((acc, w, i) => {
      if (keyWords.includes(w.replace(/[.,،؛:؟!]/g, ''))) acc.push(i)
      return acc
    }, [])
    return { words, keyIndices }
  }, [t.about.vision])

  const missionData = useMemo(() => {
    const { text, keyWords } = t.about.mission
    const words = text.split(' ')
    const keyIndices = words.reduce((acc, w, i) => {
      if (keyWords.includes(w.replace(/[.,،؛:؟!]/g, ''))) acc.push(i)
      return acc
    }, [])
    return { words, keyIndices }
  }, [t.about.mission])

  const stats = t.about.stats
  const cards = t.about.whyUs.cards

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="about__sticky">

        {/* ── Slide 0: Who We Are + Stats ──────────────────── */}
        <Slide state={getState(0)}>
          <div className={cn('about__ws', isRTL && 'about__ws--rtl')}>

            <div className={cn(
              'about__panel about__panel--text',
              seq.statsOpen && 'about__panel--text-half',
              isRTL ? 'about__panel--text-right' : 'about__panel--text-left'
            )}>
              <div className="about__panel-inner">
                <span className="about__eyebrow">{t.about.eyebrow}</span>
                <p className="about__who-text">
                  <WordHighlighter
                    text={t.about.whoWeAre}
                    active={seq.highlightActive}
                    onDone={() =>
                      setSeq(s => ({ ...s, highlightDone: true }))
                    }
                  />
                </p>
              </div>
              <div className="about__seam" aria-hidden="true" />
            </div>

            <div className={cn(
              'about__panel about__panel--stats',
              seq.statsOpen && 'about__panel--stats-open',
              isRTL ? 'about__panel--stats-left' : 'about__panel--stats-right'
            )}>
              <div className="about__stats-inner">
                {stats.map((s, i) => (
                  <div key={i} className="about__stat" style={{ '--si': i }}>
                    <span className="about__stat-value">
                      <Counter
                        target={s.value} suffix={s.suffix}
                        duration={1400 + i * 300}
                        active={seq.statsOpen}
                      />
                    </span>
                    <span className="about__stat-label">{s.label}</span>
                    {i < stats.length - 1 && <span className="about__stat-rule" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Sequence progress bar */}
            {!seq.ready && activeSlide === 0 && (
              <div className="about__lock-bar" aria-hidden="true">
                <div className={cn(
                  'about__lock-bar-fill',
                  seq.highlightDone && 'about__lock-bar-fill--stats',
                  seq.ready         && 'about__lock-bar-fill--done'
                )} />
              </div>
            )}

          </div>
        </Slide>

        {/* ── Slide 1: Vision & Mission ─────────────────────── */}
        <Slide state={getState(1)}>
          <div className={cn('about__vm', isRTL && 'about__vm--rtl')}>

            <div className={cn(
              'about__panel about__panel--vision',
              isRTL ? 'about__panel--text-right' : 'about__panel--text-left'
            )}>
              <div className="about__panel-inner">
                <span className="about__eyebrow about__eyebrow--vision">
                  {isRTL ? 'رؤيتنا' : 'Our Vision'}
                </span>
                <MagnifierText
                  words={visionData.words}
                  keyIndices={visionData.keyIndices}
                  active={activeSlide === 1}
                />
              </div>
            </div>

            <div className={cn(
              'about__panel about__panel--mission',
              isRTL ? 'about__panel--stats-left' : 'about__panel--stats-right'
            )}>
              <div className="about__panel-inner">
                <span className="about__eyebrow about__eyebrow--mission">
                  {isRTL ? 'رسالتنا' : 'Our Mission'}
                </span>
                <MagnifierText
                  words={missionData.words}
                  keyIndices={missionData.keyIndices}
                  active={activeSlide === 1}
                />
              </div>
            </div>

          </div>
        </Slide>

        {/* ── Slide 2: Why Us ──────────────────────────────── */}
        <Slide state={getState(2)}>
          <div className="about__wu">
            <div className="about__wu-header">
              <span className="about__eyebrow about__eyebrow--wu">
                {t.about.whyUs.eyebrow}
              </span>
              <h2 className="about__wu-title">
                {isRTL ? 'لماذا روح النظام' : 'Why Spirit of Law?'}
              </h2>
            </div>
            <WhyUsGrid cards={cards} active={activeSlide === 2} />
          </div>
        </Slide>

        {/* Nav dots */}
        <div className="about__nav-dots" aria-hidden="true">
          {Array.from({ length: SLIDES }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'about__nav-dot',
                activeSlide === i && 'about__nav-dot--active'
              )}
            />
          ))}
        </div>

        {/* Scroll hint — hidden until slide 0 sequence completes */}
        {activeSlide < SLIDES - 1 && (activeSlide !== 0 || seq.ready) && (
          <div className="about__scroll-hint" aria-hidden="true">
            <span className="about__scroll-hint-line" />
          </div>
        )}

      </div>
    </section>
  )
}