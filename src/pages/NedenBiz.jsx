import { Link } from 'react-router-dom'
import { HiOutlineArrowRight, HiOutlineBadgeCheck, HiOutlineMinus } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import { BreadcrumbSchema } from '../components/StructuredData'
import { useSEO } from '../hooks/useSEO'
import { usePublicContent } from '../hooks/usePublicContent'
import { NEDEN_BIZ_FALLBACK } from '../data/publicGrowthPages'
import './GrowthPages.css'

export default function NedenBiz() {
  const { content } = usePublicContent('nedenBiz', NEDEN_BIZ_FALLBACK)
  const advantages = Array.isArray(content.avantajlar) ? content.avantajlar.filter((item) => item?.baslik) : []
  const comparisons = Array.isArray(content.karsilastirma) ? content.karsilastirma.filter((item) => item?.kriter) : []
  const stats = Array.isArray(content.rakamlar) ? content.rakamlar.filter((item) => item?.sayi && item?.etiket) : []

  useSEO({
    title: 'Neden Kade New Media? | Çalışma Yaklaşımımız',
    description: 'Kade New Media’nın kapsam, onay, raporlama ve doğrulanabilir iletişim odaklı ajans çalışma yaklaşımını inceleyin.',
    keywords: 'neden Kade New Media, dijital ajans çalışma modeli, şeffaf ajans',
    path: '/neden-biz',
  })

  return (
    <PageTransition>
      <BreadcrumbSchema items={[
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Neden Biz', path: '/neden-biz' },
      ]} />

      <section className="editorial-section section">
        <div className="container">
          <FadeIn><span className="editorial-eyebrow">— {content.heroBadge}</span></FadeIn>
          <FadeIn delay={0.1}><h1 className="editorial-lead">Ajans seçimini sloganlarla değil, çalışma sistemiyle değerlendirin.</h1></FadeIn>
          <FadeIn delay={0.2}><p className="editorial-subtitle">{content.heroSubtitle}</p></FadeIn>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="editorial-section section" style={{ borderTop: 'none' }}>
          <div className="container">
            <span className="editorial-eyebrow">— Yayınlanmış göstergeler</span>
            <ul className="editorial-list">
              {stats.map((item, index) => (
                <li key={`${item.etiket}-${index}`}>
                  <div className="editorial-list-row">
                    <span className="editorial-list-idx">{item.ikon || String(index + 1).padStart(2, '0')}</span>
                    <span className="editorial-list-body">
                      <span className="editorial-list-label">{item.sayi}</span>
                      <span className="editorial-list-desc">{item.etiket}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="editorial-section section" style={stats.length === 0 ? { borderTop: 'none' } : undefined}>
        <div className="container">
          <span className="editorial-eyebrow">— İş yapış biçimi</span>
          <ul className="editorial-list">
            {advantages.map((item, index) => (
              <li key={`${item.baslik}-${index}`}>
                <div className="editorial-list-row">
                  <span className="editorial-list-idx"><HiOutlineBadgeCheck size={18} /></span>
                  <span className="editorial-list-body">
                    <span className="editorial-list-label">{item.baslik}</span>
                    <span className="editorial-list-desc">{item.aciklama}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="editorial-section section">
        <div className="container">
          <span className="editorial-eyebrow">— Karşılaştırma ölçütleri</span>
          <ul className="editorial-list">
            {comparisons.map((item, index) => (
              <li key={`${item.kriter}-${index}`}>
                <div className="editorial-list-row">
                  <span className="editorial-list-idx">{String(index + 1).padStart(2, '0')}</span>
                  <span className="editorial-list-body">
                    <span className="editorial-list-label">{item.kriter}</span>
                    <span className="editorial-list-desc"><HiOutlineBadgeCheck aria-hidden="true" /> {item.biz}</span>
                    <span className="editorial-list-desc"><HiOutlineMinus aria-hidden="true" /> {item.diger}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="editorial-section section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="editorial-display-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>{content.ctaTitle}</h2>
          <p className="editorial-subtitle" style={{ margin: '0 auto 32px' }}>{content.ctaSubtitle}</p>
          <div className="editorial-actions" style={{ justifyContent: 'center' }}>
            <Link to="/teklif-al" className="editorial-btn editorial-btn-primary">Görüşme talep et <HiOutlineArrowRight size={16} /></Link>
            <Link to="/hizmetler" className="editorial-btn editorial-btn-ghost">Hizmetleri incele</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
