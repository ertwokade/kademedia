import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineSparkles, HiOutlineChartBar } from 'react-icons/hi'
import { useLanguage } from '../i18n/LanguageContext'
import { useSEO } from '../hooks/useSEO'
import { getPartnersApi } from '../api'
import { BreadcrumbSchema } from '../components/StructuredData'
import { analytics } from '../utils/analytics'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import NotFound from './NotFound'
import './Partners.css'

export default function PartnerDetail() {
  const { id: slug } = useParams()
  const { lang } = useLanguage()
  const isEN = lang === 'en'
  const [partner, setPartner] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getPartnersApi()
      .then(data => {
        if (cancelled) return
        const found = Array.isArray(data) ? data.find(p => p.slug === slug) : null
        setPartner(found || null)
        if (found) analytics.caseStudyView(found.name)
      })
      .catch(() => { if (!cancelled) setPartner(null) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [slug])

  const name = partner?.name || ''
  const desc = partner ? (isEN ? (partner.longDescEn || partner.descEn || partner.longDescTr || partner.descTr) : (partner.longDescTr || partner.descTr)) : ''
  const services = partner ? (isEN ? (partner.servicesEn?.length ? partner.servicesEn : partner.servicesTr) : partner.servicesTr) || [] : []
  const results = partner ? (isEN ? (partner.resultsEn?.length ? partner.resultsEn : partner.resultsTr) : partner.resultsTr) || [] : []
  const category = partner ? (isEN ? (partner.categoryEn || partner.category) : partner.category) : ''

  useSEO({
    title: partner ? `${name} | Kade New Media` : 'Partnerler | Kade New Media',
    description: desc || undefined,
    path: `/partnerler/${slug}`,
    noindex: !partner,
  })

  if (loading) return <PageTransition><section className="section"><div className="container" /></section></PageTransition>
  if (!partner) return <NotFound />

  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: isEN ? 'Partners' : 'Partnerler', path: '/partnerler' }, { name, path: `/partnerler/${slug}` }]} />

      <section className="editorial-section section">
        <div className="container">
          <FadeIn>
            <Link to="/partnerler" className="editorial-btn editorial-btn-ghost" style={{ marginBottom: 32 }}>
              <HiOutlineArrowLeft size={14} /> {isEN ? 'All partners' : 'Tüm partnerler'}
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <span className="editorial-eyebrow">— {category || (isEN ? 'Partnership' : 'İş ortaklığı')}</span>
            <h1 className="editorial-lead">{name}</h1>
          </FadeIn>
          {desc && <FadeIn delay={0.2}><p className="editorial-subtitle">{desc}</p></FadeIn>}
        </div>
      </section>

      <section className="editorial-section section" style={{ borderTop: 'none' }}>
        <div className="container">
          {services.length > 0 && (
            <>
              <FadeIn>
                <span className="editorial-eyebrow">— {isEN ? 'Services' : 'Hizmetler'}</span>
              </FadeIn>
              <ul className="editorial-list">
                {services.map((service) => (
                  <li key={service}>
                    <div className="editorial-list-row">
                      <span className="editorial-list-idx"><HiOutlineSparkles size={18} /></span>
                      <span className="editorial-list-body">
                        <span className="editorial-list-label">{service}</span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {results.length > 0 && (
        <section className="editorial-section section">
          <div className="container">
            <FadeIn>
              <span className="editorial-eyebrow">— {isEN ? 'Verified results' : 'Doğrulanmış sonuçlar'}</span>
            </FadeIn>
            <ul className="editorial-list">
              {results.map((result) => (
                <li key={result}>
                  <div className="editorial-list-row">
                    <span className="editorial-list-idx"><HiOutlineChartBar size={18} /></span>
                    <span className="editorial-list-body">
                      <span className="editorial-list-label">{result}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="editorial-section section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="editorial-display-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>{isEN ? 'PARTNERSHIP INQUIRIES' : 'İŞ ORTAKLIĞI GÖRÜŞMELERİ'}</h2>
          <div className="editorial-actions" style={{ justifyContent: 'center' }}>
            <Link to="/iletisim" className="editorial-btn editorial-btn-primary">{isEN ? 'Contact us' : 'İletişime geç'}<HiOutlineArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
