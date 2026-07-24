import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HiOutlineArrowRight, HiOutlineCalendar, HiOutlineClock, HiOutlineArrowLeft } from 'react-icons/hi'
import { useLanguage } from '../i18n/LanguageContext'
import { useSEO } from '../hooks/useSEO'
import { getBlogsApi } from '../api'
import { ArticleSchema, BreadcrumbSchema } from '../components/StructuredData'
import { analytics } from '../utils/analytics'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import NotFound from './NotFound'
import './Blog.css'

function formatDate(post, lang) {
  const raw = post?.date || post?.publishAt || post?.createdAt
  if (!raw) return ''
  try {
    return new Date(raw).toLocaleDateString(lang === 'en' ? 'en-US' : 'tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return ''
  }
}

export default function BlogDetail() {
  const { slug } = useParams()
  const { lang } = useLanguage()
  const isEN = lang === 'en'
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getBlogsApi()
      .then(data => {
        if (cancelled) return
        const found = Array.isArray(data) ? data.find(p => p.slug === slug) : null
        setPost(found || null)
        if (found) analytics.blogRead(slug, isEN ? (found.titleEn || found.titleTr) : found.titleTr)
      })
      .catch(() => { if (!cancelled) setPost(null) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const title = post ? (isEN ? (post.titleEn || post.titleTr) : post.titleTr) : ''
  const description = post ? (isEN ? (post.excerptEn || post.excerptTr) : post.excerptTr) : ''
  const content = post ? (isEN ? (post.contentEn || post.contentTr) : post.contentTr) : ''

  useSEO({
    title: post ? `${title} | Kade New Media` : 'Blog | Kade New Media',
    description,
    path: `/blog/${slug}`,
    image: post?.image,
    type: 'article',
    noindex: !post,
  })

  if (loading) return <PageTransition><section className="section"><div className="container" /></section></PageTransition>
  if (!post) return <NotFound />

  return (
    <PageTransition>
      {post && (
        <>
          <ArticleSchema
            title={title}
            description={description}
            image={post.image}
            datePublished={post.publishAt || post.createdAt}
            dateModified={post.updatedAt}
          />
          <BreadcrumbSchema items={[{ name: 'Blog', path: '/blog' }, { name: title, path: `/blog/${slug}` }]} />
        </>
      )}

      <section className="editorial-section section">
        <div className="container">
          <FadeIn>
            <Link to="/blog" className="editorial-btn editorial-btn-ghost" style={{ marginBottom: 32 }}>
              <HiOutlineArrowLeft size={14} /> {isEN ? 'Back to blog' : 'Blog\'a dön'}
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <span className="editorial-eyebrow">— {isEN ? 'Article' : 'Yazı'}</span>
            <div className="editorial-list-tags" style={{ marginTop: 0, marginBottom: 18 }}>
              {post.category && <span className="editorial-list-tag">{isEN ? (post.categoryEn || post.category) : post.category}</span>}
              <span className="editorial-list-tag"><HiOutlineCalendar size={11} style={{ marginRight: 4, verticalAlign: -2 }} /> {formatDate(post, lang)}</span>
              {post.readTime && <span className="editorial-list-tag"><HiOutlineClock size={11} style={{ marginRight: 4, verticalAlign: -2 }} /> {post.readTime}</span>}
            </div>
            <h1 className="editorial-lead">{title}</h1>
            {description && <p className="editorial-subtitle">{description}</p>}
          </FadeIn>
        </div>
      </section>

      <section className="editorial-section section" style={{ borderTop: 'none' }}>
        <div className="container blog-detail-layout">
          <FadeIn>
            <article className="blog-detail-content">
              <div className="blog-body" dangerouslySetInnerHTML={{ __html: content }} />
            </article>
          </FadeIn>
        </div>
      </section>

      <section className="editorial-section section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="editorial-display-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>{isEN ? 'NEED A PRACTICAL ANSWER?' : 'PRATİK BİR YANIT MI ARIYORSUNUZ?'}</h2>
          <p className="editorial-subtitle" style={{ margin: '0 auto 32px' }}>{isEN ? 'Tell us what you are working on.' : 'Üzerinde çalıştığınız konuyu bize anlatın.'}</p>
          <div className="editorial-actions" style={{ justifyContent: 'center' }}>
            <Link to="/iletisim" className="editorial-btn editorial-btn-primary">{isEN ? 'Contact us' : 'İletişime geç'}<HiOutlineArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
