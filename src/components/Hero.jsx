import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLang } from '../LangContext.jsx'
import styles from './Hero.module.css'

// ── bezier helper ────────────────────────────────────────────────────────────
function qBez(p0, p1, p2, n = 55) {
  const pts = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    pts.push([
      (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0],
      (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1],
    ])
  }
  return pts
}

const SVG_W  = 280
const SVG_H  = 60
const Y_CX   = 30
const X_WALL = 268
const X_FREE = 18
const X_COMP = 208
const N_COILS = 9
const H_R    = 12
const H_CAP  = 8

function buildHPath(xLeft) {
  const bodyLen = X_WALL - xLeft - 2 * H_CAP
  if (bodyLen < 2) return `M ${xLeft} ${Y_CX} L ${X_WALL} ${Y_CX}`
  const pitch = bodyLen / N_COILS
  const pts = [[xLeft, Y_CX], [xLeft + H_CAP, Y_CX]]
  for (let i = 0; i < N_COILS; i++) {
    const x0 = xLeft + H_CAP + i * pitch
    qBez([x0, Y_CX], [x0 + pitch * 0.25, Y_CX - 2 * H_R], [x0 + pitch * 0.5, Y_CX]).forEach(p => pts.push(p))
    qBez([x0 + pitch * 0.5, Y_CX], [x0 + pitch * 0.75, Y_CX + 2 * H_R], [x0 + pitch, Y_CX]).forEach(p => pts.push(p))
  }
  pts.push([X_WALL - H_CAP, Y_CX], [X_WALL, Y_CX])
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ')
}

function buildHDashedPath(xLeft) {
  const bodyLen = X_WALL - xLeft - 2 * H_CAP
  if (bodyLen < 2) return ''
  const pitch = bodyLen / N_COILS
  const segs = []
  for (let i = 0; i < N_COILS; i++) {
    const x0 = xLeft + H_CAP + i * pitch
    const pts = qBez([x0, Y_CX], [x0 + pitch * 0.25, Y_CX - 2 * H_R], [x0 + pitch * 0.5, Y_CX])
    segs.push(pts.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' '))
  }
  return segs.join(' ')
}

function HSpring({ frontRef, backRef, capLeftRef }) {
  const wallHatches = [5, 13, 21, 29, 37, 45, 53]
  return (
    <svg
      className={styles.springSvg}
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
    >
      <line x1={X_WALL + 2} y1={1} x2={X_WALL + 2} y2={SVG_H - 1}
        stroke="var(--charcoal)" strokeWidth="3" strokeLinecap="square" />
      {wallHatches.map(y => (
        <line key={y}
          x1={X_WALL + 2} y1={y} x2={X_WALL + 12} y2={y - 8}
          stroke="var(--charcoal)" strokeWidth="1.2" opacity="0.45"
        />
      ))}
      <path ref={backRef}
        fill="none" stroke="var(--line)" strokeWidth="1.6"
        strokeLinecap="round" strokeDasharray="4 5" opacity="0.55"
      />
      <path ref={frontRef}
        fill="none" stroke="var(--charcoal)" strokeWidth="2.4"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <line ref={capLeftRef}
        x1={X_FREE} y1={Y_CX - H_R - 4} x2={X_FREE} y2={Y_CX + H_R + 4}
        stroke="var(--charcoal)" strokeWidth="3.2" strokeLinecap="round"
      />
      <g opacity="0.4" stroke="var(--rust)" strokeWidth="0.8">
        <line x1={X_FREE} y1={SVG_H - 5} x2={X_WALL} y2={SVG_H - 5} />
        <line x1={X_FREE} y1={SVG_H - 9} x2={X_FREE} y2={SVG_H - 1} />
        <line x1={X_WALL} y1={SVG_H - 9} x2={X_WALL} y2={SVG_H - 1} />
      </g>
    </svg>
  )
}

export default function Hero() {
  const { tx } = useLang()

  const f0 = useRef(), b0 = useRef(), cl0 = useRef(), wr0 = useRef()
  const f1 = useRef(), b1 = useRef(), cl1 = useRef(), wr1 = useRef()
  const f2 = useRef(), b2 = useRef(), cl2 = useRef(), wr2 = useRef()

  const springs = [
    { front: f0, back: b0, capLeft: cl0, wrap: wr0 },
    { front: f1, back: b1, capLeft: cl1, wrap: wr1 },
    { front: f2, back: b2, capLeft: cl2, wrap: wr2 },
  ]

  const word0 = useRef()
  const word1 = useRef()
  const word2 = useRef()
  const words = [word0, word1, word2]

  const overlineRef = useRef()
  const dimLineRef  = useRef()
  const bottomRef   = useRef()

  useEffect(() => {
    const states = springs.map(() => ({ xLeft: X_FREE }))

    function makeRedraw(sp, st) {
      return () => {
        const d  = buildHPath(st.xLeft)
        const db = buildHDashedPath(st.xLeft)
        sp.front.current?.setAttribute('d', d)
        sp.back.current?.setAttribute('d', db)
        sp.capLeft.current?.setAttribute('x1', st.xLeft)
        sp.capLeft.current?.setAttribute('x2', st.xLeft)
      }
    }

    const redraws = springs.map((sp, i) => makeRedraw(sp, states[i]))
    redraws.forEach(fn => fn())

    const masterTl = gsap.timeline({ delay: 0.5 })

    springs.forEach((sp, i) => {
      const st     = states[i]
      const redraw = redraws[i]
      const wordEl = words[i].current

      const fireTl = gsap.timeline()

      fireTl.to(st, {
        xLeft: X_COMP,
        duration: 0.75,
        ease: 'power3.in',
        onUpdate: redraw,
      })

      fireTl.to(st, {
        xLeft: X_FREE,
        duration: 0.13,
        ease: 'power4.out',
        onUpdate: redraw,
        onComplete: () => {
          const svgEl   = sp.wrap.current?.querySelector('svg')
          const wordRect = wordEl.getBoundingClientRect()

          let startX = 0, startY = 0
          if (svgEl) {
            const svgRect  = svgEl.getBoundingClientRect()
            const svgScale = svgRect.width / SVG_W
            const launchX  = svgRect.left + X_FREE * svgScale
            const launchY  = svgRect.top  + Y_CX  * svgScale
            startX = launchX - (wordRect.left + wordRect.width  * 0.5)
            startY = launchY - (wordRect.top  + wordRect.height * 0.5)
          }

          gsap.fromTo(wordEl,
            { x: startX, y: startY, opacity: 0, scale: 0.45, rotation: gsap.utils.random(2, 4) },
            {
              x: 0, y: 0, opacity: 1, scale: 1, rotation: 0,
              duration: 0.75,
              ease: 'elastic.out(1.05, 0.38)',
            }
          )
        },
      }, '-=0')

      fireTl.to(st, {
        xLeft: X_FREE + 14,
        duration: 0.22,
        ease: 'power2.out',
        onUpdate: redraw,
      })
      fireTl.to(st, {
        xLeft: X_FREE,
        duration: 0.55,
        ease: 'elastic.out(1.2, 0.4)',
        onUpdate: redraw,
      })

      masterTl.add(fireTl, i * 0.88)
    })

    masterTl.to(
      [wr0.current, wr1.current, wr2.current],
      { x: 180, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'power3.in' },
      `+=${0.2}`
    )

    masterTl.fromTo(overlineRef.current,
      { opacity: 0 }, { opacity: 1, duration: 0.45 }, '-=0.1'
    )
    masterTl.fromTo(dimLineRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.65, ease: 'power3.out', transformOrigin: 'left' },
      '-=0.25'
    )
    masterTl.fromTo(bottomRef.current,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    )

    return () => masterTl.kill()
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.frame} aria-hidden="true" />

      <div className={styles.springsColumn} aria-hidden="true">
        <div className={styles.springUnit} ref={wr0}>
          <HSpring frontRef={f0} backRef={b0} capLeftRef={cl0} />
        </div>
        <div className={styles.springUnit} ref={wr1}>
          <HSpring frontRef={f1} backRef={b1} capLeftRef={cl1} />
        </div>
        <div className={styles.springUnit} ref={wr2}>
          <HSpring frontRef={f2} backRef={b2} capLeftRef={cl2} />
        </div>
      </div>

      <div className={styles.heroContent}>
        <p className={styles.overline} ref={overlineRef}>
          {tx.location}
        </p>

        <div className={styles.dimLine} ref={dimLineRef} aria-hidden="true">
          <span className={styles.dimBarL} />
          <span className={styles.dimLabel}>{tx.sortiment}</span>
          <span className={styles.dimBarR} />
        </div>

        <h1 className={styles.title}>
          <span className={styles.titleLine} ref={word0}>{tx.line1}</span>
          <span className={`${styles.titleLine} ${styles.titleAccent}`} ref={word1}>{tx.line2}</span>
          <span className={styles.titleLine} ref={word2}>{tx.line3}</span>
        </h1>

        <div className={styles.bottomRow} ref={bottomRef}>
          <div className={styles.ctaArea}>
            <a href="#produkty" className={styles.btnPrimary}>{tx.cta1}</a>
            <a href="#kontakt" className={styles.btnGhost}>
              {tx.cta2}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M2 6.5h9M7.5 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* info table — readable for 30–60+ audience */}
          <div className={styles.infoTable}>
            <div className={styles.infoCell}>
              <span className={styles.infoLabel}>{tx.infoFirmaL}</span>
              <span className={styles.infoValue}>{tx.infoFirma}</span>
            </div>
            <div className={styles.infoCell}>
              <span className={styles.infoLabel}>{tx.infoSortL}</span>
              <span className={styles.infoValue}>{tx.infoSort}</span>
            </div>
            <div className={styles.infoCell}>
              <span className={styles.infoLabel}>{tx.infoVyrobaL}</span>
              <span className={styles.infoValue}>{tx.infoVyroba}</span>
            </div>
            <div className={styles.infoCell}>
              <span className={styles.infoLabel}>{tx.infoCertL}</span>
              <span className={styles.infoValue}>{tx.infoCert}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
