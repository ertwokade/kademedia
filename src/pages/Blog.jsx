import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineArrowRight, HiOutlineBookOpen, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi'
import { useLanguage } from '../i18n/LanguageContext'
import { useSEO } from '../hooks/useSEO'
import { getBlogsApi } from '../api'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import './Blog.css'

function formatDate(post, lang) {
  const raw = post.date || post.publishAt || post.createdAt
  if (!raw) return ''
  try {
    return new Date(raw).toLocaleDateString(lang === 'en' ? 'en-US' : 'tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return ''
  }
}

export default function Blog() {
  const { lang } = useLanguage()
  const isEN = lang === 'en'
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useSEO({
    title: isEN ? 'Blog | Kade New Media' : 'Blog | Kade New Media',
    description: isEN ? 'Verified Kade New Media articles and practical notes.' : 'Doğrulanmış Kade New Media yazıları ve pratik notları.',
    path: '/blog',
    noindex: posts.length === 0,
  })

  useEffect(() => {
    let cancelled = false
    getBlogsApi()
      .then(data => { if (!cancelled) setPosts(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) setPosts([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const [featured, ...rest] = posts

  return (
    <PageTransition>
      {/* Hero — editoryal desen */}
      <section className="editorial-section section">
        <div className="container">
          <FadeIn><span className="editorial-eyebrow">— Blog</span></FadeIn>
          <FadeIn delay={0.1}><h1 className="editorial-lead">{isEN ? 'Source-checked articles' : 'Kaynağı kontrol edilmiş yazılar'}</h1></FadeIn>
          <FadeIn delay={0.2}><p className="editorial-subtitle">{isEN ? 'Articles are published after their claims, dates, and sources are reviewed.' : 'Yazıları; iddiaları, tarihleri ve kaynakları kontrol ettikten sonra yayınlıyoruz.'}</p></FadeIn>
        </div>
      </section>

      {/* Yazı listesi — kart grid yerine küçük görselli editoryal liste
          (blog için görsel tamamen kaldırılmadı: içerik taraması için
          faydalı, haoqi.design'ın kendi "WORK" bölümünde de küçük
          görseller kullanılıyor). */}
      <section className="section">
        <div className="container">
          {loading ? null : posts.length === 0 ? (
            <p className="editorial-subtitle" style={{ margin: 0 }}>
              {isEN ? 'No verified article is currently public. Check back soon, or get in touch with a question.' : 'Şu anda yayında doğrulanmış bir yazı yok. Yakında tekrar kontrol edin veya bir sorunuzla bize ulaşın.'}
            </p>
          ) : (
            <ul className="editorial-list">
              {featured && (
                <li key={featured._id || featured.slug}>
                  <Link to={`/blog/${featured.slug}`} className="editorial-list-link">
                    {featured.image ? (
                      <span className="editorial-list-idx" style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={featured.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.currentTarget.setAttribute('data-failed', 'true')} />
                      </span>
                    ) : (
                      <span className="editorial-list-idx"><HiOutlineBookOpen size={20} /></span>
                    )}
                    <span className="editorial-list-body">
                      <span className="editorial-list-tags" style={{ marginTop: 0, marginBottom: 8 }}>
                        {featured.category && <span className="editorial-list-tag">{isEN ? (featured.categoryEn || featured.category) : featured.category}</span>}
                        <span className="editorial-list-tag"><HiOutlineCalendar size={11} style={{ marginRight: 4, verticalAlign: -2 }} />{formatDate(featured, lang)}</span>
                        {featured.readTime && <span className="editorial-list-tag"><HiOutlineClock size={11} style={{ marginRight: 4, verticalAlign: -2 }} />{featured.readTime}</span>}
                      </span>
                      <span className="editorial-list-label" style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}>{isEN ? (featured.titleEn || featured.titleTr) : featured.titleTr}</span>
                      <span className="editorial-list-desc">{isEN ? (featured.excerptEn || featured.excerptTr) : featured.excerptTr}</span>
                    </span>
                    <HiOutlineArrowRight className="editorial-list-arrow" size={18} />
                  </Link>
                </li>
              )}

              {rest.map(post => (
                <li key={post._id || post.slug}>
                  <Link to={`/blog/${post.slug}`} className="editorial-list-link">
                    {post.image ? (
                      <span className="editorial-list-idx" style={{ width: 48, height: 48, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.currentTarget.setAttribute('data-failed', 'true')} />
                      </span>
                    ) : (
                      <span className="editorial-list-idx"><HiOutlineBookOpen size={16} /></span>
                    )}
                    <span className="editorial-list-body">
                      <span className="editorial-list-tags" style={{ marginTop: 0, marginBottom: 6 }}>
                        {post.category && <span className="editorial-list-tag">{isEN ? (post.categoryEn || post.category) : post.category}</span>}
                        <span className="editorial-list-tag">{formatDate(post, lang)}</span>
                      </span>
                      <span className="editorial-list-label">{isEN ? (post.titleEn || post.titleTr) : post.titleTr}</span>
                      <span className="editorial-list-desc">{isEN ? (post.excerptEn || post.excerptTr) : post.excerptTr}</span>
                    </span>
                    <HiOutlineArrowRight className="editorial-list-arrow" size={18} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="editorial-section section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="editorial-display-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
            {isEN ? 'NEED A PRACTICAL ANSWER?' : 'PRATİK BİR YANIT MI ARIYORSUNUZ?'}
          </h2>
          <p className="editorial-subtitle" style={{ margin: '0 auto 32px' }}>{isEN ? 'Tell us what you are working on.' : 'Üzerinde çalıştığınız konuyu bize anlatın.'}</p>
          <div className="editorial-actions" style={{ justifyContent: 'center' }}>
            <Link to="/iletisim" className="editorial-btn editorial-btn-primary">{isEN ? 'Contact us' : 'İletişime geç'}<HiOutlineArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
