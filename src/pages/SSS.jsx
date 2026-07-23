import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineChevronDown } from 'react-icons/hi'
import { useLanguage } from '../i18n/LanguageContext'
import { useSEO } from '../hooks/useSEO'
import { FAQSchema } from '../components/StructuredData'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import { FAQ_ITEMS as ITEMS } from '../data/faq'
import './SSS.css'

export default function SSS() {
  const { lang } = useLanguage()
  const [open, setOpen] = useState(null)

  useSEO({
    title: lang === 'tr' ? 'Dijital Pazarlama Sık Sorulan Sorular | Kade New Media' : 'FAQ | Kade New Media',
    description: lang === 'tr' ? 'Kade New Media’nın hizmetleri, teklif süreci, çalışma biçimi, teslimat ve iletişim adımları hakkında sık sorulan soruların yanıtlarını inceleyin.' : 'Frequently asked questions about Kade New Media services and proposals.',
    path: '/sss',
  })

  const questionKey = lang === 'tr' ? 'soru' : 'soruEn'
  const answerKey = lang === 'tr' ? 'cevap' : 'cevapEn'

  return (
    <PageTransition>
      <FAQSchema items={ITEMS} />
      {/* Hero — editoryal desen */}
      <section className="editorial-section section">
        <div className="container">
          <FadeIn>
            <span className="editorial-eyebrow">— {lang === 'tr' ? 'Sık Sorulan Sorular' : 'FAQ'}</span>
            <h1 className="editorial-lead">{lang === 'tr' ? 'Net yanıtlar, yazılı koşullar' : 'Clear answers, written terms'}</h1>
            <p className="editorial-subtitle">{lang === 'tr' ? 'Bağlayıcı kapsam ve fiyat her zaman size gönderilen yazılı teklifte yer alır.' : 'Binding scope and pricing always appear in your written proposal.'}</p>
          </FadeIn>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ul className="editorial-list">
            {ITEMS.map((item, index) => {
              const panelId = `faq-panel-${index}`
              const isOpen = open === index
              return (
                <li key={item.soru}>
                  <button
                    className="editorial-list-row"
                    style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid var(--ky-line, rgba(23,19,10,.11))', cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="editorial-list-body">
                      <span className="editorial-list-label">{item[questionKey]}</span>
                      {isOpen && <span className="editorial-list-desc" id={panelId}>{item[answerKey]}</span>}
                    </span>
                    <HiOutlineChevronDown size={18} aria-hidden="true" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="editorial-section section" style={{ textAlign: 'center', marginTop: 24 }}>
            <h2 className="editorial-display-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
              {lang === 'tr' ? 'BAŞKA BİR SORUNUZ MU VAR?' : 'HAVE ANOTHER QUESTION?'}
            </h2>
            <div className="editorial-actions" style={{ justifyContent: 'center' }}>
              <Link to="/iletisim" className="editorial-btn editorial-btn-primary">{lang === 'tr' ? 'Bize yazın' : 'Contact us'}</Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
