import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { cn } from '@utils/cn'
import './Hero.css'

export default function Hero() {
  const { isRTL } = useLanguage()
  const videoRef = useRef(null)
  const [videoEnded, setVideoEnded] = useState(false)

  const revealUI = () => {
    setVideoEnded(true)
    window.dispatchEvent(new Event('hero-video-ended'))
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const play = () => {
      video.play().catch(() => revealUI())
    }

    const fallback = setTimeout(revealUI, 8000)

    if (video.readyState >= 2) {
      play()
    } else {
      video.addEventListener('canplay', play, { once: true })
    }

    video.addEventListener('canplay', () => clearTimeout(fallback), { once: true })

    return () => clearTimeout(fallback)
  }, [])

  return (
    <section id="hero" className="hero">

      {/* Full-screen video */}
      <video
        ref={videoRef}
        className="hero__video"
        src={`${import.meta.env.BASE_URL}videos/hero.mp4`}
        muted
        playsInline
        preload="auto"
        onEnded={revealUI}
        onError={revealUI}
        aria-hidden="true"
      />

      {/* Left-side gradient overlay — always on the physical left */}
      <div
        className={cn('hero__overlay', videoEnded && 'hero__overlay--visible')}
        aria-hidden="true"
      />

      {/* Content — always physical bottom-left, language switches text only */}
      <div className={cn('hero__content', videoEnded && 'hero__content--visible')}>
        {isRTL ? (
          <>
            <h1 className="hero__name-primary">روح النظام</h1>
            <p  className="hero__slogan">تحقيق العدالة وحماية الأعمال</p>
          </>
        ) : (
          <>
            <h1 className="hero__name-primary">Spirit of Law</h1>
            <p  className="hero__slogan">Achieving Justice and Protecting Businesses</p>
          </>
        )}
        <span className="hero__rule" aria-hidden="true" />
      </div>

      {/* Scroll indicator */}
      <div className={cn('hero__scroll', videoEnded && 'hero__scroll--visible')} aria-hidden="true">
        <span className="hero__scroll-dot" />
      </div>

    </section>
  )
}