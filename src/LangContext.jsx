import { createContext, useContext, useState } from 'react'

export const LangContext = createContext()
export const useLang = () => useContext(LangContext)

export const translations = {
  cs: {
    location:    'Praha · Radějovice · Zal. 1993',
    sortiment:   'Výrobní sortiment · Ø 0,1–12 mm drátu',
    line1: 'Pružiny',
    line2: 'nejvyšší',
    line3: 'kvality',
    cta1:  'Naše produkty',
    cta2:  'Nezávazná poptávka',
    infoFirmaL:  'Firma',
    infoFirma:   'Pružiny Praha s.r.o.',
    infoSortL:   'Průměr drátu',
    infoSort:    'Ø 0,1–12 mm',
    infoVyrobaL: 'Expresní výroba',
    infoVyroba:  '24 hodin',
    infoCertL:   'Certifikace',
    infoCert:    'ISO 9001:2015',
    infoProjL:   'Výrobní program',
    infoProj:    '2025',
    navProducts:   'Produkty',
    navAbout:      'O nás',
    navTech:       'Technologie',
    navMaterials:  'Materiály',
    navContact:    'Kontakt',
    ctaBtn:        'Nezávazně poptat',
    phone:         '+420 603 426 796',
  },
  en: {
    location:    'Prague · Radějovice · Est. 1993',
    sortiment:   'Product range · Ø 0.1–12 mm wire',
    line1: 'Springs',
    line2: 'highest',
    line3: 'quality',
    cta1:  'Our products',
    cta2:  'Request a quote',
    infoFirmaL:  'Company',
    infoFirma:   'Pružiny Praha s.r.o.',
    infoSortL:   'Wire diameter',
    infoSort:    'Ø 0.1–12 mm',
    infoVyrobaL: 'Express lead time',
    infoVyroba:  '24 hours',
    infoCertL:   'Certification',
    infoCert:    'ISO 9001:2015',
    infoProjL:   'Product program',
    infoProj:    '2025',
    navProducts:   'Products',
    navAbout:      'About',
    navTech:       'Technology',
    navMaterials:  'Materials',
    navContact:    'Contact',
    ctaBtn:        'Get a quote',
    phone:         '+420 603 426 796',
  },
  de: {
    location:    'Prag · Radějovice · Gegr. 1993',
    sortiment:   'Produktpalette · Ø 0,1–12 mm Draht',
    line1: 'Federn',
    line2: 'höchster',
    line3: 'Qualität',
    cta1:  'Unsere Produkte',
    cta2:  'Angebot anfragen',
    infoFirmaL:  'Firma',
    infoFirma:   'Pružiny Praha s.r.o.',
    infoSortL:   'Drahtdurchmesser',
    infoSort:    'Ø 0,1–12 mm',
    infoVyrobaL: 'Expressproduktion',
    infoVyroba:  '24 Stunden',
    infoCertL:   'Zertifizierung',
    infoCert:    'ISO 9001:2015',
    infoProjL:   'Produktprogramm',
    infoProj:    '2025',
    navProducts:   'Produkte',
    navAbout:      'Über uns',
    navTech:       'Technologie',
    navMaterials:  'Materialien',
    navContact:    'Kontakt',
    ctaBtn:        'Unverbindlich anfragen',
    phone:         '+420 603 426 796',
  },
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState('cs')
  return (
    <LangContext.Provider value={{ lang, setLang, tx: translations[lang] }}>
      {children}
    </LangContext.Provider>
  )
}
