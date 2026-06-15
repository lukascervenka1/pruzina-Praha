import styles from './About.module.css'

const milestones = [
  { year: '1993', text: 'Založení firmy Vladimírem Matějů a Miroslavem Doubkem. Start s vintage strojním vybavením.' },
  { year: '2000', text: 'Rozšíření výrobních prostorů. Přechod na moderní NC technologie.' },
  { year: '2010', text: 'Certifikace ISO 9001. Zavedení systému řízení kvality napříč výrobou.' },
  { year: '2015', text: 'Certifikace OHSAS 18001. Rozšíření sortimentu o rybářská krmítka a bowdeny.' },
  { year: 'Dnes', text: '30 let zkušeností. Tým specialistů. Výroba od Ø 0,1 mm. Expres 24 h.' },
]

const certs = ['ISO 9001:2015', 'ISO 21500:2012', 'OHSAS 18001']

export default function About() {
  return (
    <section id="o-nas" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.overline}>O společnosti</p>
          <h2 className={styles.title}>Přes 30 let<br/>v oboru</h2>
          <p className={styles.body}>
            Začínali jsme s vintage vybavením a minimálním kapitálem. Dnes jsme moderní výrobce
            pružin s nejnovějšími NC stroji, sídlící v Radějovicích u Prahy.
          </p>
          <p className={styles.body}>
            Naším cílem je spokojený zákazník. Vnímáme se jako součást týmu, který vyrábí
            finální produkt — ne jen dodavatel komponentu.
          </p>
          <div className={styles.certs}>
            {certs.map(c => (
              <div key={c} className={styles.cert}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2.5 7 L5.5 10 L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.timeline}>
            {milestones.map((m, i) => (
              <div key={i} className={`${styles.milestone} ${i === milestones.length - 1 ? styles.milestoneLast : ''}`}>
                <div className={styles.milestoneYear}>{m.year}</div>
                <div className={styles.milestoneConnector}/>
                <p className={styles.milestoneText}>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
