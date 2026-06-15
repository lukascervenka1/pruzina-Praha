import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLang } from '../LangContext.jsx'
import styles from './Products.module.css'

const products = [
  {
    id: 'TL',
    name: 'Tlačné pružiny',
    en: 'Compression Springs',
    desc: 'Výroba tlačných pružin z drátů průměru 0.1–12 mm. Možnost strojní úpravy čel.',
    svg: (
      // Clean side view — 8 coils, flat ground ends, L₀ dimension right
      <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="60" y1="8" x2="60" y2="152" stroke="var(--line-faint)" strokeWidth="0.7" strokeDasharray="5 4"/>
        <line x1="22" y1="16" x2="98" y2="16" stroke="var(--charcoal)" strokeWidth="3" strokeLinecap="round"/>
        {[0,1,2,3,4,5,6,7].map(i => {
          const y = 16 + i * 16
          return (
            <g key={i}>
              <path d={`M60,${y} Q98,${y+4} 60,${y+8}`} stroke="var(--charcoal)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
              <path d={`M60,${y+8} Q22,${y+12} 60,${y+16}`} stroke="var(--line)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeDasharray="4 3"/>
            </g>
          )
        })}
        <line x1="22" y1="144" x2="98" y2="144" stroke="var(--charcoal)" strokeWidth="3" strokeLinecap="round"/>
        {/* L₀ dimension */}
        <line x1="102" y1="16"  x2="114" y2="16"  stroke="var(--rust)" strokeWidth="1"/>
        <line x1="102" y1="144" x2="114" y2="144" stroke="var(--rust)" strokeWidth="1"/>
        <line x1="108" y1="20"  x2="108" y2="140" stroke="var(--rust)" strokeWidth="0.8"/>
        <polygon points="108,21 105.5,29 110.5,29" fill="var(--rust)"/>
        <polygon points="108,139 105.5,131 110.5,131" fill="var(--rust)"/>
        <text x="112" y="83" textAnchor="start" fill="var(--rust)" fontSize="8.5" fontFamily="'Barlow Condensed'" letterSpacing="0.06em">L₀</text>
        {/* Ø dim top */}
        <line x1="22" y1="8" x2="98" y2="8" stroke="var(--rust)" strokeWidth="0.7" opacity="0.7"/>
        <line x1="22" y1="5" x2="22" y2="11" stroke="var(--rust)" strokeWidth="0.7" opacity="0.7"/>
        <line x1="98" y1="5" x2="98" y2="11" stroke="var(--rust)" strokeWidth="0.7" opacity="0.7"/>
        <text x="60" y="5" textAnchor="middle" fill="var(--rust)" fontSize="7.5" fontFamily="'Barlow Condensed'" opacity="0.8">Ø d₂</text>
      </svg>
    ),
  },
  {
    id: 'TA',
    name: 'Tažné pružiny',
    en: 'Tension Springs',
    desc: 'Tažné pružiny s různými typy háků. Předpětí dle specifikace zákazníka.',
    svg: (
      // Coil body with English hooks top and bottom, centered
      <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="60" y1="8" x2="60" y2="152" stroke="var(--line-faint)" strokeWidth="0.7" strokeDasharray="5 4"/>
        {/* top hook — opens downward */}
        <path d="M60,22 L60,14 Q60,6 68,6 Q76,6 76,14 Q76,22 60,22"
          stroke="var(--charcoal)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        {/* coil body — 9 tight coils */}
        {[0,1,2,3,4,5,6,7,8].map(i => {
          const y = 22 + i * 12
          return (
            <g key={i}>
              <path d={`M60,${y} Q96,${y+3} 60,${y+6}`} stroke="var(--charcoal)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
              <path d={`M60,${y+6} Q24,${y+9} 60,${y+12}`} stroke="var(--line)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeDasharray="3.5 3"/>
            </g>
          )
        })}
        {/* bottom hook — opens upward */}
        <path d="M60,130 L60,138 Q60,146 52,146 Q44,146 44,138 Q44,130 60,130"
          stroke="var(--charcoal)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'ZK',
    name: 'Zkrutné pružiny',
    en: 'Torsion Springs',
    desc: 'Zkrutné pružiny s přesně definovaným krouticím momentem a délkou ramen.',
    svg: (() => {
      // Tight coil body (6 coils) with two arms extending at angles
      const CX = 60, yTop = 52, nC = 6, pitch = 9, R = 20
      const yBot = yTop + nC * pitch // = 106
      return (
        <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* center axis */}
          <line x1={CX} y1="8" x2={CX} y2="152" stroke="var(--line-faint)" strokeWidth="0.7" strokeDasharray="5 4"/>
          {/* top arm — extends up-right */}
          <line x1={CX} y1={yTop} x2="105" y2="14" stroke="var(--charcoal)" strokeWidth="2.5" strokeLinecap="round"/>
          {/* top end cap */}
          <line x1={CX-R-3} y1={yTop} x2={CX+R+3} y2={yTop} stroke="var(--charcoal)" strokeWidth="2.5" strokeLinecap="round"/>
          {/* coil body */}
          {Array.from({length: nC}, (_, i) => {
            const y = yTop + i * pitch
            return (
              <g key={i}>
                <path d={`M${CX},${y} Q${CX+2*R},${y+pitch*0.25} ${CX},${y+pitch*0.5}`}
                  stroke="var(--charcoal)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d={`M${CX},${y+pitch*0.5} Q${CX-2*R},${y+pitch*0.75} ${CX},${y+pitch}`}
                  stroke="var(--line)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeDasharray="3 2.5"/>
              </g>
            )
          })}
          {/* bottom end cap */}
          <line x1={CX-R-3} y1={yBot} x2={CX+R+3} y2={yBot} stroke="var(--charcoal)" strokeWidth="2.5" strokeLinecap="round"/>
          {/* bottom arm — extends down-left */}
          <line x1={CX} y1={yBot} x2="15" y2="146" stroke="var(--charcoal)" strokeWidth="2.5" strokeLinecap="round"/>
          {/* moment arc between arms */}
          <path d="M97,22 A52,52 0 0,0 23,138" stroke="var(--rust)" strokeWidth="0.9" fill="none" strokeDasharray="3.5 3"/>
          <text x="86" y="84" fill="var(--rust)" fontSize="9" fontFamily="'Barlow Condensed'" fontWeight="500" letterSpacing="0.08em">M</text>
        </svg>
      )
    })(),
  },
  {
    id: 'TV',
    name: 'Tvarové pružiny',
    en: 'Shaped Springs',
    desc: 'Libovolné tvary a technická řešení. Prototypy i sériová výroba.',
    svg: (
      // Complex shaped spring — S-bend with spring element in center
      <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* entry tab top-right */}
        <line x1="88" y1="18" x2="108" y2="18" stroke="var(--charcoal)" strokeWidth="2.5" strokeLinecap="round"/>
        {/* first bend — curves down-left */}
        <path d="M88,18 Q60,18 60,38" stroke="var(--charcoal)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* spring coil section in center — 5 coils */}
        {[0,1,2,3,4].map(i => {
          const y = 38 + i * 14
          return (
            <g key={i}>
              <path d={`M60,${y} Q84,${y+3.5} 60,${y+7}`} stroke="var(--charcoal)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
              <path d={`M60,${y+7} Q36,${y+10.5} 60,${y+14}`} stroke="var(--line)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeDasharray="3 2.5"/>
            </g>
          )
        })}
        {/* second bend — curves to bottom-left */}
        <path d="M60,108 Q60,126 40,126" stroke="var(--charcoal)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* exit tab bottom-left */}
        <line x1="18" y1="126" x2="40" y2="126" stroke="var(--charcoal)" strokeWidth="2.5" strokeLinecap="round"/>
        {/* mount holes */}
        <circle cx="104" cy="18" r="4.5" stroke="var(--rust)" strokeWidth="1.2" fill="none"/>
        <circle cx="22"  cy="126" r="4.5" stroke="var(--rust)" strokeWidth="1.2" fill="none"/>
        <text x="60" y="153" textAnchor="middle" fill="var(--line)" fontSize="7.5" fontFamily="'Barlow Condensed'" letterSpacing="0.1em">TVAROVÁ GEOMETRIE</text>
      </svg>
    ),
  },
  {
    id: 'KR',
    name: 'Kroužky',
    en: 'Rings & Circlips',
    desc: 'Pojistné a rozpěrné kroužky. Průměr 3–250 mm, různé průřezy.',
    svg: (
      // Simple open ring — gap at bottom, no ear lugs, cross-axis shown
      <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* center crosshair */}
        <line x1="60" y1="10" x2="60" y2="150" stroke="var(--line-faint)" strokeWidth="0.7" strokeDasharray="5 4"/>
        <line x1="10" y1="80" x2="110" y2="80" stroke="var(--line-faint)" strokeWidth="0.7" strokeDasharray="5 4"/>
        {/* open ring — large arc counter-clockwise, gap at bottom (~20°) */}
        {/* (75,121) and (45,121) are at r=44 from center (60,80). sweep=0 → goes up through top */}
        <path d="M75,121 A44,44 0 1,0 45,121" stroke="var(--charcoal)" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
        {/* inner bore dashed */}
        <circle cx="60" cy="80" r="26" stroke="var(--line)" strokeWidth="1" fill="none" strokeDasharray="4 3"/>
        {/* Ø dimension — from center up to top of ring with tick */}
        <line x1="60" y1="80" x2="60" y2="36" stroke="var(--rust)" strokeWidth="0.8"/>
        <line x1="56" y1="36" x2="64" y2="36" stroke="var(--rust)" strokeWidth="0.8"/>
        <text x="66" y="40" fill="var(--rust)" fontSize="7.5" fontFamily="'Barlow Condensed'" letterSpacing="0.04em">Ø D</text>
        {/* wire cross-section circles at gap ends */}
        <circle cx="75" cy="121" r="3.5" stroke="var(--charcoal)" strokeWidth="1.2" fill="var(--paper)"/>
        <circle cx="45" cy="121" r="3.5" stroke="var(--charcoal)" strokeWidth="1.2" fill="var(--paper)"/>
      </svg>
    ),
  },
  {
    id: 'LS',
    name: 'Listové planžety',
    en: 'Leaf Springs',
    desc: 'Pružné planžety a listové pružiny z pásového materiálu tl. 0.05–5 mm.',
    svg: (
      // Flat strip spring — side profile: installed (flat) + free state (slight bow)
      <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* center axis */}
        <line x1="60" y1="10" x2="60" y2="150" stroke="var(--line-faint)" strokeWidth="0.7" strokeDasharray="5 4"/>
        {/* free state — dashed slight bow above */}
        <path d="M14,84 Q60,64 106,84" stroke="var(--line)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeDasharray="4 3"/>
        <text x="60" y="56" textAnchor="middle" fill="var(--line)" fontSize="6.5" fontFamily="'Barlow Condensed'" letterSpacing="0.08em">volný stav</text>
        {/* deflection arrow */}
        <line x1="60" y1="66" x2="60" y2="87" stroke="var(--rust)" strokeWidth="0.8"/>
        <polygon points="60,88 57.5,80 62.5,80" fill="var(--rust)"/>
        <text x="65" y="78" fill="var(--rust)" fontSize="7.5" fontFamily="'Barlow Condensed'">f</text>
        {/* installed flat state — solid strip */}
        <line x1="14" y1="90" x2="106" y2="90" stroke="var(--charcoal)" strokeWidth="3" strokeLinecap="round"/>
        {/* strip thickness bottom face */}
        <line x1="14" y1="97" x2="106" y2="97" stroke="var(--charcoal)" strokeWidth="2" strokeLinecap="round"/>
        {/* end caps */}
        <line x1="14"  y1="90" x2="14"  y2="97" stroke="var(--charcoal)" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="106" y1="90" x2="106" y2="97" stroke="var(--charcoal)" strokeWidth="2.2" strokeLinecap="round"/>
        {/* mounting holes */}
        <circle cx="24"  cy="93" r="4.5" stroke="var(--charcoal)" strokeWidth="1.6" fill="var(--paper)"/>
        <circle cx="96"  cy="93" r="4.5" stroke="var(--charcoal)" strokeWidth="1.6" fill="var(--paper)"/>
        {/* thickness dimension */}
        <line x1="110" y1="90" x2="118" y2="90" stroke="var(--rust)" strokeWidth="0.7"/>
        <line x1="110" y1="97" x2="118" y2="97" stroke="var(--rust)" strokeWidth="0.7"/>
        <line x1="114" y1="90" x2="114" y2="97" stroke="var(--rust)" strokeWidth="0.8"/>
        <text x="116" y="96" fill="var(--rust)" fontSize="6.5" fontFamily="'Barlow Condensed'">t</text>
        {/* length dimension */}
        <line x1="14"  y1="110" x2="106" y2="110" stroke="var(--rust)" strokeWidth="0.7"/>
        <line x1="14"  y1="106" x2="14"  y2="114" stroke="var(--rust)" strokeWidth="0.7"/>
        <line x1="106" y1="106" x2="106" y2="114" stroke="var(--rust)" strokeWidth="0.7"/>
        <text x="60" y="122" textAnchor="middle" fill="var(--rust)" fontSize="7.5" fontFamily="'Barlow Condensed'" letterSpacing="0.05em">L</text>
      </svg>
    ),
  },
  {
    id: 'JE',
    name: 'Jehly a krmítka',
    en: 'Needles & Wire Feeders',
    desc: 'Tvarové jehly a drátěná krmítka z nerezové a pružinové oceli.',
    svg: (() => {
      // Left: precision needle. Right: wire cage feeder (cylindrical — ribs + rings)
      const cX = 84, cY1 = 36, cY2 = 128, cW = 28
      // vertical wire ribs inside cage
      const ribs = [-10, -4, 2, 8, 14].map((dx, i) => (
        <line key={i} x1={cX + dx} y1={cY1 + 4} x2={cX + dx} y2={cY2 - 4}
          stroke="var(--line)" strokeWidth="0.9"/>
      ))
      // horizontal ring bands
      const rings = [cY1 + 28, cY1 + 56, cY1 + 84 - 4].map((y, i) => (
        <line key={i} x1={cX - cW / 2} y1={y} x2={cX + cW / 2} y2={y}
          stroke="var(--line)" strokeWidth="0.9" strokeDasharray="3 2"/>
      ))
      return (
        <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* ── left: needle ── */}
          {/* body */}
          <rect x="24" y="22" width="8" height="108" rx="3"
            stroke="var(--charcoal)" strokeWidth="2" fill="none"/>
          {/* taper tip */}
          <path d="M24,130 L28,148 L32,130" stroke="var(--charcoal)" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
          {/* eye */}
          <ellipse cx="28" cy="30" rx="2.5" ry="4" stroke="var(--charcoal)" strokeWidth="1.5" fill="var(--paper)"/>
          {/* L dimension */}
          <line x1="22" y1="22" x2="14" y2="22" stroke="var(--rust)" strokeWidth="0.7"/>
          <line x1="22" y1="148" x2="14" y2="148" stroke="var(--rust)" strokeWidth="0.7"/>
          <line x1="17" y1="22" x2="17" y2="148" stroke="var(--rust)" strokeWidth="0.7"/>
          <text x="12" y="88" textAnchor="middle" fill="var(--rust)" fontSize="7" fontFamily="'Barlow Condensed'">L</text>

          {/* ── right: cylindrical wire cage feeder ── */}
          {/* outer cage profile — rectangle with rounded ends */}
          <rect x={cX - cW / 2} y={cY1} width={cW} height={cY2 - cY1} rx="4"
            stroke="var(--charcoal)" strokeWidth="2.2" fill="none"/>
          {/* top cap oval */}
          <ellipse cx={cX} cy={cY1 + 4} rx={cW / 2 - 1} ry="4"
            stroke="var(--charcoal)" strokeWidth="1.5" fill="none"/>
          {/* bottom cap oval */}
          <ellipse cx={cX} cy={cY2 - 4} rx={cW / 2 - 1} ry="4"
            stroke="var(--charcoal)" strokeWidth="1.5" fill="none"/>
          {/* wire ribs */}
          {ribs}
          {/* horizontal ring marks */}
          {rings}
          {/* label */}
          <text x={cX} y="152" textAnchor="middle" fill="var(--line)" fontSize="6.5"
            fontFamily="'Barlow Condensed'" letterSpacing="0.08em">KRMÍTKO</text>
        </svg>
      )
    })(),
  },
  {
    id: 'BO',
    name: 'Bowdeny a oplety',
    en: 'Bowden Cables',
    desc: 'Lankovody a drátěné oplety pro přenos pohybu na vzdálenost.',
    svg: (() => {
      // Bowden = tightly wound helical outer casing + inner cable
      // Draw as cross-section cutaway: coil hatch marks along the conduit wall, dashed inner cable
      const coilMarks = []
      const n = 14
      const yStart = 34, yEnd = 132, x1L = 22, x1R = 42, x2L = 78, x2R = 98
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1)
        const y = yStart + t * (yEnd - yStart)
        const yNext = yStart + (i + 1) / (n - 1) * (yEnd - yStart)
        const yMid = (y + yNext) / 2
        // left wall coil arc
        coilMarks.push(
          <path key={`lc${i}`} d={`M${x1L},${y} Q${x1L - 6},${yMid} ${x1L},${yNext}`}
            stroke="var(--charcoal)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        )
        // right wall coil arc
        coilMarks.push(
          <path key={`rc${i}`} d={`M${x1R},${y} Q${x1R + 6},${yMid} ${x1R},${yNext}`}
            stroke="var(--charcoal)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        )
      }
      return (
        <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* inner cable dashed — center line */}
          <line x1="32" y1="22" x2="32" y2="148" stroke="var(--rust)" strokeWidth="1.2" strokeDasharray="5 3.5"/>
          {/* coil outer and inner walls */}
          <line x1={x1L} y1={yStart} x2={x1L} y2={yEnd} stroke="var(--charcoal)" strokeWidth="0.5" opacity="0.3"/>
          <line x1={x1R} y1={yStart} x2={x1R} y2={yEnd} stroke="var(--charcoal)" strokeWidth="0.5" opacity="0.3"/>
          {/* coil hatch marks */}
          {coilMarks}
          {/* end fittings */}
          <rect x="18" y="14" width="28" height="12" rx="2" stroke="var(--charcoal)" strokeWidth="2" fill="var(--paper)"/>
          <rect x="18" y="134" width="28" height="12" rx="2" stroke="var(--charcoal)" strokeWidth="2" fill="var(--paper)"/>
          {/* cross-section detail on the right — show layers */}
          <line x1="56" y1="54" x2="56" y2="106" stroke="var(--line-faint)" strokeWidth="0.7"/>
          {/* cross-section circles stack */}
          <circle cx="76" cy="68" r="18" stroke="var(--charcoal)" strokeWidth="2" fill="none"/>
          <circle cx="76" cy="68" r="11" stroke="var(--line)" strokeWidth="1" fill="none" strokeDasharray="3 2"/>
          <circle cx="76" cy="68" r="4" stroke="var(--rust)" strokeWidth="1.5" fill="none"/>
          {/* cross-section circles bottom */}
          <circle cx="76" cy="96" r="14" stroke="var(--charcoal)" strokeWidth="1.5" fill="none"/>
          <circle cx="76" cy="96" r="7" stroke="var(--line)" strokeWidth="1" fill="none" strokeDasharray="3 2"/>
          <circle cx="76" cy="96" r="2.5" stroke="var(--rust)" strokeWidth="1.2" fill="none"/>
          {/* labels */}
          <text x="8"  y="11" fill="var(--line)" fontSize="7" fontFamily="'Barlow Condensed'" letterSpacing="0.06em">PLÁŠŤ</text>
          <text x="8" y="155" fill="var(--line)" fontSize="7" fontFamily="'Barlow Condensed'" letterSpacing="0.06em">LANKO</text>
          <text x="60" y="46" fill="var(--line)" fontSize="6.5" fontFamily="'Barlow Condensed'" letterSpacing="0.06em">PRŮŘEZ</text>
        </svg>
      )
    })(),
  },
]

export default function Products() {
  const { lang, tx } = useLang()
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const BIG = 1200
    const observers = []

    const cards = sectionRef.current.querySelectorAll(`.${styles.card}`)

    cards.forEach(card => {
      const svg = card.querySelector('svg')
      if (!svg) return

      const strokeEls = [...svg.querySelectorAll('path, line, circle, rect, ellipse, polyline, polygon')]
      const textEls   = [...svg.querySelectorAll('text')]

      strokeEls.forEach(el => {
        // preserve existing dash patterns (dashed guide lines) — only add dasharray to solid strokes
        if (!el.hasAttribute('stroke-dasharray')) {
          gsap.set(el, { strokeDasharray: BIG, strokeDashoffset: BIG })
        }
        gsap.set(el, { opacity: 0 })
      })
      textEls.forEach(el => gsap.set(el, { opacity: 0 }))

      const allEls = [...strokeEls, ...textEls]

      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()

        gsap.to(allEls, {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 0.7,
          stagger: { each: 0.045, from: 'start' },
          ease: 'power2.inOut',
        })
      }, { threshold: 0.25 })

      obs.observe(card)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <section ref={sectionRef} id="produkty" className={styles.section}>
      <div className={styles.sectionHead}>
        <p className="label">Produkty · 8 kategorií</p>
        <h2 className={styles.sectionTitle}>Výrobní program</h2>
        <p className={styles.sectionSub}>
          Vyrábíme téměř libovolné tvary pružin a drátěných dílů. Kusová výroba i série.
        </p>
      </div>

      <div className={styles.grid}>
        {products.map((p, idx) => (
          <article key={p.id} className={styles.card}>
            {/* technical drawing header */}
            <div className={styles.cardHeader}>
              <span className={styles.cardId}>PP–{p.id}–00{idx + 1}</span>
              <span className={styles.cardScale}>M 1:1</span>
            </div>

            {/* drawing area */}
            <div className={styles.drawingArea}>
              <div className={styles.drawingInner}>
                {p.svg}
              </div>
              {/* corner marks */}
              <div className={styles.cornerTL} aria-hidden="true"/>
              <div className={styles.cornerTR} aria-hidden="true"/>
              <div className={styles.cornerBL} aria-hidden="true"/>
              <div className={styles.cornerBR} aria-hidden="true"/>
            </div>

            {/* title block */}
            <div className={styles.titleBlock}>
              <div className={styles.titleBlockLeft}>
                <h3 className={styles.cardName}>{p.name}</h3>
                {lang !== 'cs' && <p className={styles.cardEn}>{p.en}</p>}
              </div>
            </div>
            <p className={styles.cardDesc}>{p.desc}</p>
          </article>
        ))}
      </div>

      {/* CTA strip after product grid */}
      <div className={styles.cta}>
        <a href="#kontakt" className={styles.ctaPrimary}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {tx.ctaBtn}
        </a>
        <a href="tel:+420603426796" className={styles.ctaPhone}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3.5C3 2.7 3.7 2 4.5 2h1.2c.4 0 .7.3.8.6l.7 2.1c.1.4 0 .8-.3 1L5.7 6.6C6.5 8.2 7.8 9.5 9.4 10.3l.9-1.2c.2-.3.6-.4 1-.3l2.1.7c.3.1.6.4.6.8V11.5c0 .8-.7 1.5-1.5 1.5C6.1 13 3 9.9 3 3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          +420 603 426 796
        </a>
      </div>
    </section>
  )
}
