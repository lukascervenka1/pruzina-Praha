import styles from './Technology.module.css'

const specs = [
  { label: 'Min. průměr drátu', value: 'Ø 0,10 mm' },
  { label: 'Max. průměr drátu', value: 'Ø 12 mm' },
  { label: 'Expresní výroba',   value: '24 hodin' },
  { label: 'Materiály',         value: '15+ druhů' },
  { label: 'Sériová výroba',    value: 'až 10M ks' },
  { label: 'Certifikace',       value: 'ISO 9001' },
]

const materials = [
  'Ocel ČSN EN 10270-1',
  'Nerez 1.4301 / 1.4310',
  'Mosaz / bronz',
  'Titanová slitina',
  'Neobvyklé průřezy drátů',
  'Dle specifikace',
]

const keyStats = [
  { num: 'Ø 0,1–12', unit: 'mm', label: 'průměr drátu' },
  { num: '24',       unit: 'h',  label: 'expresní výroba' },
  { num: '10M',      unit: 'ks', label: 'sériová výroba' },
]

export default function Technology() {
  return (
    <section id="technologie" className={styles.section}>

      {/* Header — 2 col */}
      <div className={styles.header}>
        <h2 className={styles.title}>NC výroba<br/>pružin</h2>
        <p className={styles.subtitle}>
          Vlastní výroba na CNC ohýbacích automatech. Od jednoho kusu po milionové série.
          Dráty Ø&nbsp;0,1–12&nbsp;mm, expresní termíny do&nbsp;24&nbsp;hodin.
        </p>
      </div>

      {/* 2-col content */}
      <div className={styles.content}>

        {/* Left: spec table */}
        <div className={styles.specBlock}>
          <div className={styles.specTableHead}>
            <span>Parametr</span>
            <span>Hodnota</span>
          </div>
          {specs.map(s => (
            <div key={s.label} className={styles.specRow}>
              <span className={styles.specLabel}>{s.label}</span>
              <span className={styles.specValue}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Right: key stats + materials */}
        <div className={styles.aside}>
          <div className={styles.statsInline}>
            {keyStats.map(s => (
              <div key={s.num} className={styles.stat}>
                <span className={styles.statNum}>
                  {s.num}<span className={styles.statUnit}>{s.unit}</span>
                </span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.matBlock}>
            <p className={styles.matHead}>Zpracovávané materiály</p>
            <div className={styles.matTags}>
              {materials.map(m => (
                <span key={m} className={styles.tag}>{m}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
