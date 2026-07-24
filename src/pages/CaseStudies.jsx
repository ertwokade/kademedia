import { Link } from 'react-router-dom'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { useSEO } from '../hooks/useSEO'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import './CaseStudies.css'

export default function CaseStudies() {
  useSEO({
    title: 'Vaka Çalışmaları | Kade New Media',
    description: 'Müşteri izniyle yayınlanan, doğrulanmış Kade New Media vaka çalışmaları.',
    path: '/basari-hikayeleri',
    noindex: true,
  })

  return (
    <PageTransition>
      <section className="editorial-section section">
        <div className="container">
          <FadeIn><span className="editorial-eyebrow">— Vaka çalışmaları</span></FadeIn>
          <FadeIn delay={0.1}><h1 className="editorial-lead">Doğrulanmış sonuç arşivi</h1></FadeIn>
          <FadeIn delay={0.2}><p className="editorial-subtitle">Kampanya sonuçlarını ve müşteri isimlerini ancak ölçüm kaynağı ve yayın izni doğrulandıktan sonra paylaşıyoruz. Şu anda yayında bir vaka çalışması yok.</p></FadeIn>
        </div>
      </section>
      <section className="editorial-section section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="editorial-display-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>PROJENİZ İÇİN KAPSAM OLUŞTURALIM</h2>
          <div className="editorial-actions" style={{ justifyContent: 'center' }}>
            <Link to="/teklif-al" className="editorial-btn editorial-btn-primary">Teklif al<HiOutlineArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
