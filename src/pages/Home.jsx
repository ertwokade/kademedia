import { Link } from 'react-router-dom'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { useSEO } from '../hooks/useSEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FadeIn } from '../components/Animations'
import './Home.css'

// haoqi.design editoryal dili — Kade krem/altın token'larıyla (kade-yeni.css
// tek kaynak). WebGL "hello" hero'su izole edilmiş /public/hero.html
// iframe'inde çalışır (donmuş Next.js bundle, ana React ağacından ayrı — bu
// hydration #418 çakışmasını ana konsoldan kaldırır). DOM-patch nav hack'leri
// ve site.html rewrite'ı kaldırıldı; nav artık gerçek <Navbar/>.

const HOME_LINKS = [
  { label: 'Sosyal Medya Yönetimi', to: '/hizmetler/sosyal-medya-yonetimi' },
  { label: 'İçerik Üretimi', to: '/hizmetler/icerik-uretimi' },
  { label: 'Reklam Yönetimi', to: '/hizmetler/reklam-yonetimi' },
  { label: 'Video Prodüksiyon', to: '/hizmetler/video-produksiyon' },
  { label: 'Strateji & Danışmanlık', to: '/hizmetler/strateji-danismanlik' },
  { label: 'Web Sitesi Tasarımı', to: '/hizmetler/web-sitesi-tasarimi' },
]

export default function Home() {
  useSEO({
    title: 'Kade New Media | İstanbul Sosyal Medya & Dijital Pazarlama Ajansı',
    description: 'İstanbul merkezli sosyal medya ve dijital pazarlama ajansı Kade New Media. İçerik, reklam ve prodüksiyonla markanızı dijitalde büyütüyoruz.',
    path: '/',
  })

  return (
    <>
      <Navbar />

      {/* İzole WebGL hero — donmuş bundle iframe içinde, ana React ağacından ayrı */}
      <section className="home-hero" aria-label="Kade New Media">
        <iframe
          src="/hero.html"
          className="home-hero-frame"
          title="Kade New Media — hero animasyonu"
          loading="eager"
          tabIndex={-1}
          aria-hidden="true"
        />
      </section>

      <main id="main-content">
        {/* Editoryal hizmet listesi — haoqi altı-çizili inline link kalıbı */}
        <section className="home-editorial section">
          <div className="container">
            <FadeIn>
              <span className="home-eyebrow">— NE YAPIYORUZ</span>
            </FadeIn>
            <FadeIn delay={0.05}>
              <p className="home-lead">
                Strateji, içerik ve reklamı bir araya getirerek markaların
                dijitalde düzenli büyümesini sağlıyoruz.
              </p>
            </FadeIn>
            <ul className="home-service-list">
              {HOME_LINKS.map((s, i) => (
                <li key={s.to}>
                  <Link to={s.to} className="home-service-link">
                    <span className="home-service-idx">{String(i + 1).padStart(2, '0')}</span>
                    <span className="home-service-label">{s.label}</span>
                    <HiOutlineArrowRight className="home-service-arrow" size={18} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Büyük tipografi CTA */}
        <section className="home-cta section">
          <div className="container">
            <FadeIn>
              <h2 className="home-cta-title">
                <span>MARKANI</span>
                <span>BİRLİKTE</span>
                <span>BÜYÜTELİM</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="home-cta-actions">
                <Link to="/teklif-al" className="home-btn home-btn-primary">
                  Teklif Al <HiOutlineArrowRight size={16} />
                </Link>
                <Link to="/iletisim" className="home-btn home-btn-ghost">
                  İletişime Geç
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
