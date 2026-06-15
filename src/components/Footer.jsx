import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <svg width="34" height="38" viewBox="0 0 42 46" fill="none" aria-hidden="true" className={styles.logoMark}>
            <defs>
              <clipPath id="footerLogoClip">
                <polygon points="9,3 37,3 33,43 5,43"/>
              </clipPath>
            </defs>
            <polygon points="9,3 37,3 33,43 5,43" fill="oklch(0.279 0.041 260.031 / 0.6)"/>
            <polygon points="9,3 17,3 13,43 5,43" fill="#1d4ed8"/>
            <g clipPath="url(#footerLogoClip)">
              <path d="M0,10 Q21,7.5 42,10" stroke="white" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
              <path d="M0,16 Q21,13.5 42,16" stroke="white" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
              <path d="M0,22 Q21,19.5 42,22" stroke="white" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
              <path d="M0,28 Q21,25.5 42,28" stroke="white" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
              <path d="M0,34 Q21,31.5 42,34" stroke="white" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
              <path d="M0,39 Q21,36.5 42,39" stroke="white" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
            </g>
          </svg>
          <span>Pružiny Praha s.r.o.</span>
        </div>

        <div className={styles.links}>
          <a href="#produkty">Produkty</a>
          <a href="#o-nas">O nás</a>
          <a href="#technologie">Technologie</a>
          <a href="#kontakt">Kontakt</a>
        </div>

        <p className={styles.legal}>
          Radějovice 12 · 251 68 Kamenice · IČ: — · © {new Date().getFullYear()} Pružiny Praha s.r.o.
        </p>
      </div>
    </footer>
  )
}
