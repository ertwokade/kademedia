/*
 * Sayfa mimarisi:
 * Hero → yeni medya ajansı tanımı → hizmet kümeleri → çalışma modeli →
 * doğru müşteri profili → sık sorulan sorular → teklif CTA.
 */
import { Link } from 'react-router-dom'
import {
  HiOutlineArrowRight,
  HiOutlineChartBar,
  HiOutlineChatAlt2,
  HiOutlineCheckCircle,
  HiOutlineCode,
  HiOutlineFilm,
  HiOutlineGlobe,
  HiOutlinePencilAlt,
} from 'react-icons/hi'
import { useSEO } from '../hooks/useSEO'
import { BreadcrumbSchema, FAQSchema, ServiceSchema } from '../components/StructuredData'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import { SERVICE_DESCRIPTION, SERVICES as SERVICES_DATA, PROCESS, FAQS } from '../data/newMediaAgency'
import './NewMediaAgency.css'

const SERVICE_ICONS = [HiOutlineGlobe, HiOutlinePencilAlt, HiOutlineChartBar, HiOutlineFilm, HiOutlineChatAlt2, HiOutlineCode]
const SERVICES = SERVICES_DATA.map((service, i) => ({ ...service, icon: SERVICE_ICONS[i] }))

export default function NewMediaAgency() {
  useSEO({
    title: 'New Media Ajansı İstanbul | Kade New Media',
    description: SERVICE_DESCRIPTION,
    keywords: 'new media ajansı, yeni medya ajansı, medya ajansı, dijital medya ajansı, sosyal medya ajansı istanbul, kade media, kade new media, kademedia, kadenewmedia',
    path: '/new-media-ajansi',
  })

  return (
    <PageTransition>
      <BreadcrumbSchema items={[
        { name: 'Ana Sayfa', path: '/' },
        { name: 'New Media Ajansı', path: '/new-media-ajansi' },
      ]} />
      <ServiceSchema name="New Media Ajansı" description={SERVICE_DESCRIPTION} url="/new-media-ajansi" />
      <FAQSchema items={FAQS} />

      <section className="editorial-section section">
        <div className="container">
          <FadeIn>
            <span className="editorial-eyebrow">— New Media Ajansı</span>
            <h1 className="editorial-lead">
              Yeni medyada strateji, içerik ve performans tek planda
            </h1>
            <p className="editorial-subtitle">
              Kade New Media, İstanbul merkezli bir new media ve dijital medya ajansı. Sosyal medya,
              içerik, reklam, video ve web hizmetlerini markanızın hedefleri etrafında bir araya getiriyoruz.
            </p>
            <div className="editorial-actions">
              <Link className="editorial-btn editorial-btn-primary" to="/teklif-al">Projenizi paylaşın <HiOutlineArrowRight /></Link>
              <Link className="editorial-btn editorial-btn-ghost" to="/hizmetler">Tüm hizmetler</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section new-media-intro">
        <div className="container new-media-intro-grid">
          <FadeIn direction="left">
            <span className="new-media-kicker">Yeni medya nedir?</span>
            <h2>Medya kanallarını ayrı işler değil, tek müşteri yolculuğu olarak ele alıyoruz.</h2>
          </FadeIn>
          <FadeIn direction="right">
            <p>
              New media dediğimizde sosyal ağlardan arama motorlarına, dijital reklamdan videoya ve
              web deneyimine kadar geniş bir alandan bahsediyoruz. Bu kanalları ayrı ayrı değil,
              markanızın görünürlüğü, talep yaratma ve sürdürülebilir iletişim hedefleri etrafında
              tek bir plan içinde yönetiyoruz.
            </p>
            <p>
              Markamızın adı <strong>Kade New Media</strong>. İnternette Kade, Kademedia veya
              Kadenewmedia şeklinde arandığında da karşınıza çıkan resmi adresimiz
              <strong> kadenewmedia.com</strong>.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <span className="editorial-eyebrow">— Hizmetler</span>
            <h2 className="editorial-lead" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}>Dijital medyada ihtiyacınız olan temel uzmanlıklar</h2>
            <p className="editorial-subtitle">Tek bir hizmetle başlayabilir veya ihtiyaçlarınıza göre bütünleşik bir kapsam oluşturabilirsiniz.</p>
          </FadeIn>
          <ul className="editorial-list">
            {SERVICES.map(service => (
              <li key={service.title}>
                <Link className="editorial-list-link" to={service.to}>
                  <span className="editorial-list-idx"><service.icon size={18} aria-hidden="true" /></span>
                  <span className="editorial-list-body">
                    <span className="editorial-list-label">{service.title}</span>
                    <span className="editorial-list-desc">{service.description}</span>
                  </span>
                  <HiOutlineArrowRight className="editorial-list-arrow" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section new-media-process">
        <div className="container">
          <FadeIn>
            <span className="editorial-eyebrow">— Çalışma modeli</span>
            <h2 className="editorial-lead" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}>Fikirden ölçüme üç net adım</h2>
          </FadeIn>
          <ul className="editorial-list">
            {PROCESS.map(([number, title, description]) => (
              <li key={number}>
                <div className="editorial-list-row">
                  <span className="editorial-list-idx">{number}</span>
                  <span className="editorial-list-body">
                    <span className="editorial-list-label">{title}</span>
                    <span className="editorial-list-desc">{description}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="editorial-section section">
        <div className="container">
          <FadeIn>
            <span className="editorial-eyebrow">— Kimler için?</span>
            <h2 className="editorial-lead" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}>Dijital iletişimini düzenli ve ölçülebilir hale getirmek isteyen markalar için.</h2>
          </FadeIn>
          <ul className="editorial-list">
            {[
              'Yeni bir marka veya ürün lansmanı planlayan ekipler',
              'Sosyal medya üretimini düzenli hale getirmek isteyen işletmeler',
              'Reklam bütçesini içerik ve dönüşüm hedefleriyle birlikte yönetmek isteyen markalar',
              'Video, web ve dijital kampanyaları tek plan içinde yürütmek isteyen ekipler',
            ].map(item => (
              <li key={item}>
                <div className="editorial-list-row">
                  <span className="editorial-list-idx"><HiOutlineCheckCircle aria-hidden="true" /></span>
                  <span className="editorial-list-body"><span className="editorial-list-label">{item}</span></span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="editorial-section section new-media-faq">
        <div className="container">
          <FadeIn>
            <span className="editorial-eyebrow">— Sık sorulan sorular</span>
            <h2 className="editorial-lead" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}>New media ajansı hakkında</h2>
          </FadeIn>
          <ul className="editorial-list">
            {FAQS.map(item => (
              <li key={item.soru}>
                <div className="editorial-list-row">
                  <span className="editorial-list-idx">?</span>
                  <span className="editorial-list-body">
                    <span className="editorial-list-label">{item.soru}</span>
                    <span className="editorial-list-desc">{item.cevap}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="editorial-section section" style={{ textAlign: 'center' }}>
        <div className="container">
          <FadeIn>
            <span className="editorial-eyebrow">— Birlikte planlayalım</span>
            <h2 className="editorial-display-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>MARKANIZ İÇİN DOĞRU NEW MEDIA KAPSAMINI BELİRLEYİN</h2>
            <p className="editorial-subtitle" style={{ margin: '0 auto 32px' }}>Hedefinizi ve ihtiyacınızı paylaşın; kapsam, takvim ve maliyetleri yazılı teklifte netleştirelim.</p>
            <div className="editorial-actions" style={{ justifyContent: 'center' }}>
              <Link className="editorial-btn editorial-btn-primary" to="/teklif-al">Teklif isteyin <HiOutlineArrowRight /></Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  )
}
