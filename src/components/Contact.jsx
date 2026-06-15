import { useState } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // real implementation would POST to a backend
    setSent(true)
  }

  return (
    <section id="kontakt" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.info}>
          <p className="label">Kontakt</p>
          <h2 className={styles.title}>Poptejte<br/>pružiny</h2>
          <p className={styles.sub}>
            Popište nám váš požadavek. Odpovíme do 24 hodin
            s nezávaznou nabídkou.
          </p>

          <div className={styles.contacts}>
            <a href="tel:+420603426796" className={styles.contactRow}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 3h3l1.5 3.5-1.5 1A9 9 0 0 0 11.5 12l1-1.5L16 12v3a1 1 0 0 1-1 1A14 14 0 0 1 2 4a1 1 0 0 1 1-1z"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>+420 603 426 796</span>
              <small>Zákaznický servis</small>
            </a>
            <a href="tel:+420725439079" className={styles.contactRow}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 3h3l1.5 3.5-1.5 1A9 9 0 0 0 11.5 12l1-1.5L16 12v3a1 1 0 0 1-1 1A14 14 0 0 1 2 4a1 1 0 0 1 1-1z"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>+420 725 439 079</span>
              <small>Výroba</small>
            </a>
            <a href="mailto:info@pruzina.cz" className={styles.contactRow}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="2" y="4" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M2 5l7 5 7-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span>info@pruzina.cz</span>
              <small>E-mail</small>
            </a>
            <div className={styles.contactRow}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 2a5 5 0 0 1 5 5c0 3.5-5 9-5 9S4 10.5 4 7a5 5 0 0 1 5-5z"
                  stroke="currentColor" strokeWidth="1.3"/>
                <circle cx="9" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
              <span>Radějovice 12, Kamenice</span>
              <small>251 68 · Praha-východ</small>
            </div>
          </div>
        </div>

        <div className={styles.formWrap}>
          {sent ? (
            <div className={styles.thankYou}>
              <div className={styles.thankIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="1" y="1" width="30" height="30" stroke="var(--rust)" strokeWidth="1.5"/>
                  <path d="M8 16 L14 22 L24 10" stroke="var(--rust)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Zpráva odeslána</h3>
              <p>Odpovíme vám do 24 hodin.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="name">Jméno a příjmení</label>
                <input
                  id="name" name="name" type="text" required
                  className={styles.input}
                  value={form.name} onChange={handleChange}
                  autoComplete="name"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="email">E-mail</label>
                <input
                  id="email" name="email" type="email" required
                  className={styles.input}
                  value={form.email} onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="message">
                  Popis požadavku
                  <span className={styles.fieldNote}> — typ pružiny, rozměry, množství</span>
                </label>
                <textarea
                  id="message" name="message" required rows={6}
                  className={styles.textarea}
                  value={form.message} onChange={handleChange}
                />
              </div>
              <button type="submit" className={styles.submit}>
                Odeslat poptávku
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
