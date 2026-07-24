import { Link } from 'react-router-dom'
import { HiOutlineArrowRight, HiOutlineDownload, HiOutlineMail, HiOutlineNewspaper } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import { BreadcrumbSchema } from '../components/StructuredData'
import { useSEO } from '../hooks/useSEO'
import { usePublicContent } from '../hooks/usePublicContent'
import { BASIN_FALLBACK } from '../data/publicGrowthPages'
import './GrowthPages.css'

function safeExternalUrl(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

export default function Basin() {
  const { content } = usePublicContent('basin', BASIN_FALLBACK)
  const companyInfo = Array.isArray(content.companyInfo) ? content.companyInfo.filter((item) => item?.etiket && item?.deger) : []
  const logoPackages = Array.isArray(content.logoPackages) ? content.logoPackages.filter((item) => safeExternalUrl(item?.url)) : []
  const news = Array.isArray(content.news) ? content.news.filter((item) => item?.baslik && safeExternalUrl(item?.link)) : []

  useSEO({
    title: 'Basın Odası | Kade New Media',
    description: 'Kade New Media kurumsal bilgileri, doğrulanmış basın bağlantıları, marka materyalleri ve basın iletişimi.',
    keywords: 'Kade New Media basın, medya kiti, basın iletişim',
    path: '/basin',
  })

  return (
    <PageTransition>
      <BreadcrumbSchema items={[
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Basın', path: '/basin' },
      ]} />

      <section className="editorial-section section">
        <div className="container">
          <FadeIn><span className="editorial-eyebrow">— Basın odası</span></FadeIn>
          <FadeIn delay={0.1}><h1 className="editorial-lead">Kurumsal bilgiyi kaynağıyla paylaşın.</h1></FadeIn>
          <FadeIn delay={0.2}>
            <p className="editorial-subtitle">Basın talepleri, doğrulanmış yayın bağlantıları ve indirilebilir marka materyalleri için tek iletişim noktası.</p>
          </FadeIn>
        </div>
      </section>

      <section className="editorial-section section" style={{ borderTop: 'none' }}>
        <div className="container">
          <span className="editorial-eyebrow">— Kurumsal bilgiler</span>
          <ul className="editorial-list">
            {companyInfo.map((item, index) => (
              <li key={`${item.etiket}-${index}`}>
                <div className="editorial-list-row">
                  <span className="editorial-list-idx">{String(index + 1).padStart(2, '0')}</span>
                  <span className="editorial-list-body">
                    <span className="editorial-list-label">{item.etiket}</span>
                    <span className="editorial-list-desc">{item.deger}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="editorial-section section">
        <div className="container">
          <span className="editorial-eyebrow">— Doğrulanmış yayınlar</span>
          {news.length > 0 ? (
            <ul className="editorial-list">
              {news.map((item, index) => (
                <li key={`${item.baslik}-${index}`}>
                  <a className="editorial-list-link" href={safeExternalUrl(item.link)} target="_blank" rel="noopener noreferrer">
                    <span className="editorial-list-idx"><HiOutlineNewspaper size={18} /></span>
                    <span className="editorial-list-body">
                      <span className="editorial-list-tags">
                        {item.kaynak && <span className="editorial-list-tag">{item.kaynak}</span>}
                        {item.tarih && <span className="editorial-list-tag">{item.tarih}</span>}
                      </span>
                      <span className="editorial-list-label">{item.baslik}</span>
                      {item.ozet && <span className="editorial-list-desc">{item.ozet}</span>}
                    </span>
                    <HiOutlineArrowRight className="editorial-list-arrow" size={18} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="growth-page-note">Kaynağı doğrulanmış bir basın bağlantısı henüz yayınlanmadı. Örnek veya temsili haber gösterilmez.</p>
          )}
        </div>
      </section>

      <section className="editorial-section section">
        <div className="container">
          <span className="editorial-eyebrow">— Marka materyalleri</span>
          {logoPackages.length > 0 ? (
            <div className="editorial-actions">
              {logoPackages.map((item, index) => (
                <a key={`${item.isim}-${index}`} href={safeExternalUrl(item.url)} className="editorial-btn editorial-btn-ghost" target="_blank" rel="noopener noreferrer">
                  <HiOutlineDownload size={16} /> {item.isim || item.format || 'Dosyayı indir'}
                </a>
              ))}
            </div>
          ) : (
            <p className="growth-page-note">Güncel ve onaylı marka dosyaları hazırlandığında indirme bağlantıları burada yayınlanacaktır.</p>
          )}
        </div>
      </section>

      <section className="editorial-section section" style={{ textAlign: 'center' }}>
        <div className="container">
          <HiOutlineMail size={26} aria-hidden="true" />
          <h2 className="editorial-display-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>{content.ctaTitle}</h2>
          <p className="editorial-subtitle" style={{ margin: '0 auto 12px' }}>{content.ctaSubtitle}</p>
          <p className="growth-status">Yanıt hedefi: {content.responseTime}</p>
          <div className="editorial-actions" style={{ justifyContent: 'center' }}>
            <a className="editorial-btn editorial-btn-primary" href={`mailto:${content.contactEmail || BASIN_FALLBACK.contactEmail}`}>E-posta gönder</a>
            <Link className="editorial-btn editorial-btn-ghost" to="/iletisim">İletişim sayfası</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
