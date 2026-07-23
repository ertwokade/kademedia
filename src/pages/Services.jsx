import { Link } from 'react-router-dom'
import {
  HiOutlineGlobe,
  HiOutlineChartBar,
  HiOutlineFilm,
  HiOutlineChatAlt2,
  HiOutlinePencilAlt,
  HiOutlineCode,
  HiOutlineArrowRight,
} from 'react-icons/hi'
import { useLanguage } from '../i18n/LanguageContext'
import { useSEO } from '../hooks/useSEO'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import './Services.css'

export default function Services() {
  const { t } = useLanguage()
  useSEO({
    title: 'New Media ve Dijital Medya Hizmetleri | Kade New Media',
    description: 'Kade New Media’nın sosyal medya yönetimi, içerik üretimi, dijital reklam, video prodüksiyon, new media stratejisi ve web tasarımı hizmetleri.',
    keywords: 'new media, yeni medya, medya ajansı, dijital medya ajansı, sosyal medya ajansı hizmetleri, sosyal medya yönetimi istanbul, instagram ajansı, tiktok ajansı, içerik üretimi, meta reklam ajansı, google ads ajansı, video prodüksiyon, dijital ajans',
    path: '/hizmetler',
  })

  const services = [
    {
      icon: HiOutlineGlobe,
      slug: 'sosyal-medya-yonetimi',
      title: t('services.smm'),
      desc: t('services.smmDesc'),
      features: [t('services.smmFeat1'), t('services.smmFeat2'), t('services.smmFeat3'), t('services.smmFeat4')],
    },
    {
      icon: HiOutlinePencilAlt,
      slug: 'icerik-uretimi',
      title: t('services.contentTitle'),
      desc: t('services.contentDesc'),
      features: [t('services.contentFeat1'), t('services.contentFeat2'), t('services.contentFeat3'), t('services.contentFeat4')],
    },
    {
      icon: HiOutlineChartBar,
      slug: 'reklam-yonetimi',
      title: t('services.adsTitle'),
      desc: t('services.adsDesc'),
      features: [t('services.adsFeat1'), t('services.adsFeat2'), t('services.adsFeat3'), t('services.adsFeat4')],
    },
    {
      icon: HiOutlineFilm,
      slug: 'video-produksiyon',
      title: t('services.videoTitle'),
      desc: t('services.videoDesc'),
      features: [t('services.videoFeat1'), t('services.videoFeat2'), t('services.videoFeat3'), t('services.videoFeat4')],
    },
    {
      icon: HiOutlineChatAlt2,
      slug: 'strateji-danismanlik',
      title: t('services.strategyTitle'),
      desc: t('services.strategyDesc'),
      features: [t('services.strategyFeat1'), t('services.strategyFeat2'), t('services.strategyFeat3'), t('services.strategyFeat4')],
    },
    {
      icon: HiOutlineCode,
      slug: 'web-sitesi-tasarimi',
      title: t('services.webTitle'),
      desc: t('services.webDesc'),
      features: [t('services.webFeat1'), t('services.webFeat2'), t('services.webFeat3'), t('services.webFeat4')],
    },
  ]

  const process = [
    { step: '01', title: t('services.processStep1'), desc: t('services.processStep1Desc') },
    { step: '02', title: t('services.processStep2'), desc: t('services.processStep2Desc') },
    { step: '03', title: t('services.processStep3'), desc: t('services.processStep3Desc') },
    { step: '04', title: t('services.processStep4'), desc: t('services.processStep4Desc') },
  ]

  return (
    <PageTransition>
      {/* Hero — editoryal desen (bkz. Home.jsx): mono eyebrow + dev lead,
          kart/badge/glow dekorasyonu yok (haoqi dilinde düz zemin). */}
      <section className="editorial-section section">
        <div className="container">
          <FadeIn>
            <span className="editorial-eyebrow">— {t('services.badge')}</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="editorial-lead">
              {t('services.title')} {t('services.titleHighlight')} {t('services.titleEnd')}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="editorial-subtitle">
              {t('services.subtitle')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Hizmet listesi — kart yerine ince ayraçlı editoryal liste */}
      <section className="editorial-section section" style={{ borderTop: 'none' }}>
        <div className="container">
          <ul className="editorial-list">
            {services.map((service) => (
              <li key={service.title}>
                <Link
                  to={`/hizmetler/${service.slug}`}
                  className="editorial-list-link"
                  aria-label={`${service.title} hizmet detayları`}
                >
                  <span className="editorial-list-idx">
                    <service.icon size={18} />
                  </span>
                  <span className="editorial-list-body">
                    <span className="editorial-list-label">{service.title}</span>
                    <span className="editorial-list-desc">{service.desc}</span>
                    <span className="editorial-list-tags">
                      {service.features.map((feature) => (
                        <span key={feature} className="editorial-list-tag">
                          {feature}
                        </span>
                      ))}
                    </span>
                  </span>
                  <HiOutlineArrowRight className="editorial-list-arrow" size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Süreç — aynı editoryal liste kalıbı, adım numaraları */}
      <section className="editorial-section section">
        <div className="container">
          <FadeIn>
            <span className="editorial-eyebrow">— {t('services.processBadge')}</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="editorial-lead" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}>
              {t('services.processTitle')} {t('services.processHighlight')}?
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="editorial-subtitle">
              {t('services.processSubtitle')}
            </p>
          </FadeIn>

          <ul className="editorial-list">
            {process.map((item) => (
              <li key={item.step}>
                <div className="editorial-list-row">
                  <span className="editorial-list-idx">{item.step}</span>
                  <span className="editorial-list-body">
                    <span className="editorial-list-label">{item.title}</span>
                    <span className="editorial-list-desc">{item.desc}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageTransition>
  )
}
