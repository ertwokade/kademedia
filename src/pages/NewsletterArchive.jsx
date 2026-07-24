import { Link } from 'react-router-dom'
import { HiOutlineArrowRight, HiOutlineCalendar, HiOutlineMail } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import { BreadcrumbSchema } from '../components/StructuredData'
import { useSEO } from '../hooks/useSEO'
import { usePublicContent } from '../hooks/usePublicContent'
import { NEWSLETTER_FALLBACK } from '../data/publicGrowthPages'
import './GrowthPages.css'

export default function NewsletterArchive() {
  const { content } = usePublicContent('newsletterArchive', NEWSLETTER_FALLBACK)
  const items = Array.isArray(content.items) ? content.items.filter((item) => item?.title) : []

  useSEO({
    title: 'Bülten Arşivi | Kade New Media',
    description: 'Kade New Media’nın sosyal medya, dijital pazarlama, içerik ve new media konularındaki yayınlanmış bültenlerini inceleyin.',
    keywords: 'dijital pazarlama bülteni, sosyal medya bülteni, Kade New Media',
    path: '/bulten-arsivi',
  })

  return (
    <PageTransition>
      <BreadcrumbSchema items={[
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Bülten Arşivi', path: '/bulten-arsivi' },
      ]} />

      <section className="editorial-section section">
        <div className="container">
          <FadeIn><span className="editorial-eyebrow">— Bülten arşivi</span></FadeIn>
          <FadeIn delay={0.1}><h1 className="editorial-lead">Gündemi değil, işe yarayan değişimi kaydedin.</h1></FadeIn>
          <FadeIn delay={0.2}>
            <p className="editorial-subtitle">Yayınlanmış bültenler; sosyal platformlar, reklam, içerik üretimi ve dijital operasyon üzerine kısa uygulama notları içerir.</p>
          </FadeIn>
        </div>
      </section>

      <section className="editorial-section section" style={{ borderTop: 'none' }}>
        <div className="container">
          <span className="editorial-eyebrow">— Yayınlanmış sayılar</span>
          {items.length > 0 ? (
            <ul className="editorial-list">
              {items.map((item, index) => (
                <li key={`${item.title}-${index}`}>
                  <div className="editorial-list-row">
                    <span className="editorial-list-idx"><HiOutlineMail size={18} /></span>
                    <span className="editorial-list-body">
                      {item.date && (
                        <span className="editorial-list-tags">
                          <span className="editorial-list-tag"><HiOutlineCalendar size={12} /> {item.date}</span>
                        </span>
                      )}
                      <span className="editorial-list-label">{item.title}</span>
                      {item.desc && <span className="editorial-list-desc">{item.desc}</span>}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="growth-page-note">Arşive eklenmiş doğrulanmış bir bülten henüz bulunmuyor. Örnek bülten başlıkları yayınlanmaz.</p>
          )}
        </div>
      </section>

      <section className="editorial-section section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="editorial-display-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>Bir sonraki konuya katkıda bulunun.</h2>
          <p className="editorial-subtitle" style={{ margin: '0 auto 32px' }}>Yanıtlanmasını istediğiniz soruyu veya içerik önerinizi ekibimize iletin.</p>
          <div className="editorial-actions" style={{ justifyContent: 'center' }}>
            <Link to="/iletisim" className="editorial-btn editorial-btn-primary">Konu öner <HiOutlineArrowRight size={16} /></Link>
            <Link to="/blog" className="editorial-btn editorial-btn-ghost">Blog arşivi</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
