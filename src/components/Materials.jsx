import styles from './Materials.module.css'

const wireSteels = [
  { name: 'SL',      norm: 'EN 10270-1',  aisi: '—',    carbon: '0,35–0,60', note: 'Všeobecné použití, nižší pevnost' },
  { name: 'SM',      norm: 'EN 10270-1',  aisi: '—',    carbon: '0,50–0,75', note: 'Standardní pružiny, statické zatížení' },
  { name: 'SH',      norm: 'EN 10270-1',  aisi: '—',    carbon: '0,65–1,00', note: 'Vyšší pevnost, dynamické zatížení' },
  { name: 'DH',      norm: 'EN 10270-1',  aisi: '—',    carbon: '0,65–1,00', note: 'Nejvyšší pevnost, náročné aplikace' },
]

const wireStainless = [
  { name: '1.4016', norm: 'EN 10270-3', aisi: '430',  note: 'Feritická, magnetická, do 300 °C' },
  { name: '1.4301', norm: 'EN 10270-3', aisi: '304',  note: 'Austenitická, korozivzdorná, nejčastější' },
  { name: '1.4401', norm: 'EN 10270-3', aisi: '316',  note: 'Mo-legovaná, odolnost kyselinám a chloridům' },
  { name: '1.4568', norm: 'EN 10270-3', aisi: '631',  note: 'Vytvrditelná, vysoká mez kluzu' },
  { name: '1.4310', norm: 'EN 10270-3', aisi: '301',  note: 'Austenitická, vyšší mez pružnosti' },
]

const stripCarbon = [
  { name: 'C 45 E',    norm: 'EN 10132-3', din: 'Ck 45',    astm: '1045', carbon: '0,45–0,50', note: 'Střední pevnost, dobrá tvárnost' },
  { name: 'C 60 S',    norm: 'EN 10132-4', din: 'Ck 60',    astm: '1060', carbon: '0,57–0,65', note: 'Vyšší tvrdost a pružnost' },
  { name: 'C 67 S',    norm: 'EN 10132-4', din: 'Ck 67',    astm: '1070', carbon: '0,65–0,73', note: 'Vysoká pružnost' },
  { name: 'C 75 S',    norm: 'EN 10132-4', din: 'Ck 75',    astm: '1074', carbon: '0,70–0,80', note: 'Velmi vysoká pevnost' },
  { name: '51 Cr V 4', norm: 'EN 10132-4', din: '51CrV4',   astm: '6150', carbon: '0,47–0,55', note: 'Cr-V legovaná, odolnost únavě' },
]

const stripStainless = [
  { name: '1.4301', norm: 'EN 10151', aisi: '304',  note: 'Austenitická, korozivzdorná' },
  { name: '1.4310', norm: 'EN 10151', aisi: '301',  note: 'Austenitická, vyšší mez pružnosti' },
]

export default function Materials() {
  return (
    <section id="materialy" className={styles.section}>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.overline}>Přehled materiálů</p>
          <h2 className={styles.title}>Materiály</h2>
        </div>
        <p className={styles.subtitle}>
          Pracujeme s normovanými oceli pro pružinářský průmysl.
          Všechny materiály jsou certifikovány a dodávány s atestem.
          Na vyžádání zpracujeme i materiály dle specifikace zákazníka.
        </p>
      </div>

      {/* DRÁTOVÉ MATERIÁLY */}
      <div className={styles.category}>
        <h3 className={styles.catTitle}>Drátové materiály</h3>

        <div className={styles.tableWrap}>
          <p className={styles.tableLabel}>Patentované oceli dle EN 10270-1</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Označení</th>
                <th>Norma</th>
                <th>Obsah C (%)</th>
                <th>Charakteristika</th>
              </tr>
            </thead>
            <tbody>
              {wireSteels.map(m => (
                <tr key={m.name}>
                  <td className={styles.nameCell}>{m.name}</td>
                  <td className={styles.normCell}>{m.norm}</td>
                  <td>{m.carbon}</td>
                  <td className={styles.noteCell}>{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.tableWrap}>
          <p className={styles.tableLabel}>Nerezové oceli dle EN 10270-3</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Označení</th>
                <th>Norma</th>
                <th>AISI</th>
                <th>Charakteristika</th>
              </tr>
            </thead>
            <tbody>
              {wireStainless.map(m => (
                <tr key={m.name}>
                  <td className={styles.nameCell}>{m.name}</td>
                  <td className={styles.normCell}>{m.norm}</td>
                  <td>{m.aisi}</td>
                  <td className={styles.noteCell}>{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PÁSOVÉ MATERIÁLY */}
      <div className={styles.category}>
        <h3 className={styles.catTitle}>Pásové materiály · planžety</h3>

        <div className={styles.tableWrap}>
          <p className={styles.tableLabel}>Uhlíkové oceli</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Označení</th>
                <th>EN norma</th>
                <th>DIN</th>
                <th>ASTM</th>
                <th>Obsah C (%)</th>
                <th>Charakteristika</th>
              </tr>
            </thead>
            <tbody>
              {stripCarbon.map(m => (
                <tr key={m.name}>
                  <td className={styles.nameCell}>{m.name}</td>
                  <td className={styles.normCell}>{m.norm}</td>
                  <td>{m.din}</td>
                  <td>{m.astm}</td>
                  <td>{m.carbon}</td>
                  <td className={styles.noteCell}>{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.tableWrap}>
          <p className={styles.tableLabel}>Nerezové oceli dle EN 10151</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Označení</th>
                <th>Norma</th>
                <th>AISI</th>
                <th>Charakteristika</th>
              </tr>
            </thead>
            <tbody>
              {stripStainless.map(m => (
                <tr key={m.name}>
                  <td className={styles.nameCell}>{m.name}</td>
                  <td className={styles.normCell}>{m.norm}</td>
                  <td>{m.aisi}</td>
                  <td className={styles.noteCell}>{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.note}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        Pracujeme i s materiály mimo tento přehled — mosaz, bronz, titan a speciální průřezy drátů. Kontaktujte nás.
      </div>

    </section>
  )
}
