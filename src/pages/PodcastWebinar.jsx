import { Link } from 'react-router-dom'
import { HiOutlineArrowRight, HiOutlineMicrophone, HiOutlineVideoCamera } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import { BreadcrumbSchema } from '../components/StructuredData'
import { useSEO } from '../hooks/useSEO'
import { usePublicContent } from '../hooks/usePublicContent'
import { PODCAST_FALLBACK } from '../data/publicGrowthPages'
import './GrowthPages.css'

function resolveLink(value) {
  if (typeof value !== 'string' || !value.trim()) return null
  if (value.startsWith('/')) return { href: value, external: false }
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? { href: url.href, external: true } : null
  } catch {
    return null
  }
}

function ActionLink({ value, className, children }) {
  const target = resolveLink(value)
  if (!target) return null
  return target.external
    ? <a className={className} href={target.href} target="_blank" rel="noopener noreferrer">{children}</a>
    : <Link className={className} to={target.href}>{children}</Link>
}

export default function PodcastWebinar() {
  const { content } = usePublicContent('podcastWebinar', PODCAST_FALLBACK)
  const items = Array.isArray(content.items) ? content.items.filter((item) => item?.title) : []

  useSEO({
    title: 'Podcast ve Webinar | Kade New Media',
    description: 'Kade New Media podcast, webinar ve canlı yayın kayıtları ile doğrulanmış gelecek yayın takvimini inceleyin.',
    keywords: 'dijital pazarlama podcast, sosyal medya webinar, Kade New Media yayın',
    path: '/podcast-webinar',
  })

  return (
    <PageTransition>
      <BreadcrumbSchema items={[
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Podcast ve Webinar', path: '/podcast-webinar' },
      ]} />

      <section className="editorial-section section">
        <div className="container">
          <FadeIn><span className="editorial-eyebrow">— {content.heroBadge}</span></FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="editorial-lead">{content.heroTitleBefore} {content.heroTitleHighlight}{content.heroTitleAfter}</h1>
          </FadeIn>
          <FadeIn delay={0.2}><p className="editorial-subtitle">{content.heroSubtitle}</p></FadeIn>
        </div>
      </section>

      <section className="editorial-section section" style={{ borderTop: 'none' }}>
        <div className="container">
          <span className="editorial-eyebrow">— Yayın takvimi ve kayıtlar</span>
          {items.length > 0 ? (
            <ul className="editorial-list">
              {items.map((item, index) => {
                const target = resolveLink(item.url)
                const body = (
                  <>
                    <span className="editorial-list-idx">
                      {String(item.type || '').toLowerCase().includes('podcast')
                        ? <HiOutlineMicrophone size={18} />
                        : <HiOutlineVideoCamera size={18} />}
                    </span>
                    <span className="editorial-list-body">
                      <span className="editorial-list-tags">
                        {item.type && <span className="editorial-list-tag">{item.type}</span>}
                        {item.date && <span className="editorial-list-tag">{item.date}</span>}
                      </span>
                      <span className="editorial-list-label">{item.title}</span>
                    </span>
                    {target && <HiOutlineArrowRight className="editorial-list-arrow" size={18} />}
                  </>
                )

                return (
                  <li key={`${item.title}-${index}`}>
                    {target ? (
                      <ActionLink value={item.url} className="editorial-list-link">{body}</ActionLink>
                    ) : (
                      <div className="editorial-list-row">{body}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="growth-page-note">Doğrulanmış bir yayın tarihi veya kayıt bağlantısı henüz eklenmedi. Temsili etkinlik gösterilmez.</p>
          )}
        </div>
      </section>

      <section className="editorial-section section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="editorial-display-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>Yeni yayınlardan haberdar olun.</h2>
          <p className="editorial-subtitle" style={{ margin: '0 auto 32px' }}>Konu önerisi veya konuşmacı iş birliği için ekibimize ulaşabilirsiniz.</p>
          <div className="editorial-actions" style={{ justifyContent: 'center' }}>
            <ActionLink value={content.ctaLink || '/iletisim'} className="editorial-btn editorial-btn-primary">
              {content.ctaLabel || 'İletişime geç'} <HiOutlineArrowRight size={16} />
            </ActionLink>
            <Link to="/blog" className="editorial-btn editorial-btn-ghost">Yazıları incele</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
