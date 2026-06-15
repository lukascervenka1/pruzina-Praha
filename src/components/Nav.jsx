import { useState, useEffect } from 'react'
import { useLang } from '../LangContext.jsx'
import styles from './Nav.module.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { lang, setLang, tx } = useLang()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#produkty',    label: tx.navProducts  },
    { href: '#o-nas',       label: tx.navAbout     },
    { href: '#technologie', label: tx.navTech       },
    { href: '#materialy',   label: tx.navMaterials  },
    { href: '#kontakt',     label: tx.navContact    },
  ]

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#" className={styles.logo}>
        <svg width="42" height="46" viewBox="0 0 42 46" fill="none" aria-hidden="true" className={styles.logoMark}>
          <defs>
            <clipPath id="navLogoClip">
              <polygon points="9,3 37,3 33,43 5,43"/>
            </clipPath>
          </defs>
          <polygon points="9,3 37,3 33,43 5,43" fill="#0d1526"/>
          <polygon points="9,3 17,3 13,43 5,43" fill="#1d4ed8"/>
          <g clipPath="url(#navLogoClip)">
            <path d="M0,10 Q21,7.5 42,10" stroke="white" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
            <path d="M0,16 Q21,13.5 42,16" stroke="white" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
            <path d="M0,22 Q21,19.5 42,22" stroke="white" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
            <path d="M0,28 Q21,25.5 42,28" stroke="white" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
            <path d="M0,34 Q21,31.5 42,34" stroke="white" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
            <path d="M0,39 Q21,36.5 42,39" stroke="white" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
          </g>
        </svg>
        <div className={styles.logoWords}>
          <span className={styles.logoMain}>PRUŽINY PRAHA</span>
          <span className={styles.logoSub}>s.r.o.</span>
        </div>
      </a>

      <nav className={`${styles.links} ${open ? styles.open : ''}`}>
        {links.map(l => (
          <a key={l.href} href={l.href} className={styles.link} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#kontakt" className={styles.ctaNav}>
          {tx.ctaBtn}
        </a>
        <a href="tel:+420603426796" className={styles.phone}>
          +420 603 426 796
        </a>
      </nav>

      {/* language switcher */}
      <div className={styles.langSwitcher}>
        {['cs', 'en', 'de'].map(l => (
          <button
            key={l}
            className={`${styles.langBtn} ${lang === l ? styles.langActive : ''}`}
            onClick={() => setLang(l)}
            aria-label={`Přepnout na ${l.toUpperCase()}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <button
        className={styles.burger}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
        aria-expanded={open}
      >
        <span className={`${styles.burgerLine} ${open ? styles.burgerOpen : ''}`} />
        <span className={`${styles.burgerLine} ${open ? styles.burgerOpen : ''}`} />
      </button>
    </header>
  )
}
