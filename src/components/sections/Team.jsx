import { useLanguage } from '@hooks/useLanguage'
import { useScrollAnimation } from '@hooks/useScrollAnimation'
import { cn } from '@utils/cn'
import './Team.css'

/*
  BENTO GRID — 7 members, three size tiers, all same 3:4 portrait shape
  ─────────────────────────────────────────────────────────────────────
  Tier 1 (largest)  — member 1:    hero  (2×2 grid cells)
  Tier 2 (medium)   — members 2-4: m2/m3/m4  (1 col × 2 rows)
  Tier 3 (small)    — members 5-7: s5/s6/s7  (1 col × 1 row)

  LTR desktop (5 col):
    [hero][hero][ m2 ][ m3 ][ m4 ]
    [hero][hero][ m2 ][ m3 ][ m4 ]
    [    ][ s5 ][ s6 ][ s7 ][    ]

  RTL desktop (5 col):
    [ m2 ][ m3 ][ m4 ][hero][hero]
    [ m2 ][ m3 ][ m4 ][hero][hero]
    [    ][ s5 ][ s6 ][ s7 ][    ]

  Photo: background-size cover, background-position center 15%
  so the face is always in the top-third and never cropped out.
  All cells have aspect-ratio 3/4 so the shape is always consistent.
*/

function MemberCard({ member, tier, index }) {
  const isHero = tier === 'hero'

  return (
    <article
      className={cn('tc', isHero && 'tc--hero')}
      data-id={member.id}
      style={{ '--delay': `${index * 0.07}s` }}
    >
      {/* Photo — covers cell, face anchored to upper portion */}
      <div
        className="tc__photo"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/team-${member.id}.png)` }}
        role="img"
        aria-label={member.name}
      />

      {/* Resting scrim + name tag */}
      <div className="tc__label">
        <span className="tc__specialty-tag">{member.specialty}</span>
        <span className="tc__name">{member.name}</span>
      </div>

      {/* Hover overlay — slides up */}
      <div className="tc__overlay" aria-hidden="true">
        <div className="tc__overlay-content">
          <span className="tc__overlay-specialty">{member.specialty}</span>
          <h3 className="tc__overlay-name">{member.name}</h3>
          <p   className="tc__overlay-title">{member.title}</p>
          {isHero && member.bio && (
            <p className="tc__overlay-bio">{member.bio}</p>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Team() {
  const { t, isRTL } = useLanguage()
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.5 })

  const { eyebrow, headline, body, members } = t.team

  // Size tiers
  const hero   = members[0]                // tier 1 — largest
  const mediums = members.slice(1, 4)      // tier 2 — members 2,3,4
  const smalls  = members.slice(4, 7)      // tier 3 — members 5,6,7

  return (
    <section
      id="team"
      className={cn('team', isVisible && 'team--visible', isRTL && 'team--rtl')}
      ref={ref}
    >
      {/* Section header */}
      <header className="team__header">
        <span className="team__eyebrow">{eyebrow}</span>
        <h2 className="team__headline">
          {headline.split('\\n').map((line, i) => (
            <span key={i} className="team__headline-line">{line}</span>
          ))}
        </h2>
        <p className="team__body">{body}</p>
      </header>

      {/* Bento grid */}
      <div className="team__grid">
        <MemberCard member={hero}     tier="hero"   index={0} />
        {mediums.map((m, i) => (
          <MemberCard key={m.id} member={m} tier="medium" index={i + 1} />
        ))}
        {smalls.map((m, i) => (
          <MemberCard key={m.id} member={m} tier="small"  index={i + 4} />
        ))}
      </div>
    </section>
  )
}