import { Link } from 'react-router-dom'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { useLanguage } from '../i18n/LanguageContext'
import { useSEO } from '../hooks/useSEO'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import './Partners.css'

export default function Partners() {
  const { lang } = useLanguage()
  const isEN = lang === 'en'
  useSEO({
    title: isEN ? 'Business Partners | Kade New Media' : 'İş Ortakları | Kade New Media',
    description: isEN ? 'Verified Kade New Media business partner information.' : 'Doğrulanmış Kade New Media iş ortaklığı bilgileri.',
    path: '/partnerler',
    noindex: true,
  })

  const platforms = [
    { n: '01', lab: 'Platform', t: 'Meta', c: isEN ? 'Instagram · Facebook' : 'Instagram · Facebook' },
    { n: '02', lab: 'Platform', t: 'Google', c: isEN ? 'Search · YouTube' : 'Arama · YouTube' },
    { n: '03', lab: 'Platform', t: 'TikTok', c: isEN ? 'Ads · Creators' : 'Reklam · Kreatör' },
    { n: '04', lab: 'Platform', t: 'LinkedIn', c: 'B2B' },
  ]

  const models = [
    { n: '001', t: isEN ? 'Project-based' : 'Proje bazlı', d: isEN ? 'A defined scope with a clear start and delivery.' : 'Net başlangıç ve teslimi olan tanımlı kapsam.', tag: isEN ? 'Scope' : 'Kapsam' },
    { n: '002', t: isEN ? 'Retainer' : 'Sürekli', d: isEN ? 'Ongoing monthly work across content, ads and reporting.' : 'İçerik, reklam ve raporlamada aylık sürekli çalışma.', tag: isEN ? 'Monthly' : 'Aylık' },
    { n: '003', t: isEN ? 'White-label' : 'White-label', d: isEN ? 'We produce behind the scenes for other agencies.' : 'Diğer ajanslar için sahne arkasında üretim.', tag: isEN ? 'Agency' : 'Ajans' },
  ]

  return (
    <PageTransition>
      <section className="editorial-section section">
        <div className="container">
          <FadeIn><span className="editorial-eyebrow">— {isEN ? 'Business partners' : 'İş ortakları'}</span></FadeIn>
          <FadeIn delay={0.1}><h1 className="editorial-lead">{isEN ? 'Verified partnerships' : 'Doğrulanmış iş ortaklıkları'}</h1></FadeIn>
          <FadeIn delay={0.2}><p className="editorial-subtitle">{isEN ? 'Partner identities and logos are published only with permission. Below are the ad platforms we work on and how we structure partnerships.' : 'Partner kimliklerini ve logolarını yalnızca izinle yayınlıyoruz. Aşağıda üzerinde çalıştığımız reklam platformlarını ve iş birliği modellerimizi görebilirsin.'}</p></FadeIn>
        </div>
      </section>

      <section className="section pf-block">
        <div className="container">
          <div className="pf-head">
            <div className="section-badge">{isEN ? 'Ad platforms' : 'Reklam platformları'}</div>
            <span className="pf-idx">{isEN ? 'where we run' : 'çalıştığımız yerler'}</span>
          </div>
          <div className="pf-tiles">
            {platforms.map((k) => (
              <FadeIn key={k.n}>
                <div className="pf-tile">
                  <div className="pf-sq"><span className="pf-lab">{k.lab}</span><span className="pf-no">{k.n}</span></div>
                  <div className="pf-row"><span className="pf-t">{k.t}</span><span className="pf-c">{k.c}</span></div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section pf-block">
        <div className="container">
          <div className="pf-head">
            <div className="section-badge">{isEN ? 'Partnership models' : 'İş birliği modelleri'}</div>
            <span className="pf-idx">{isEN ? '3 models' : '3 model'}</span>
          </div>
          <div className="pf-proc">
            {models.map((s) => (
              <div className="pf-proc-row" key={s.n}>
                <span className="pf-proc-n">{s.n}</span>
                <div className="pf-proc-main"><h3>{s.t}</h3><p>{s.d}</p></div>
                <span className="pf-proc-tag">{s.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="editorial-display-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
            {isEN ? 'PARTNERSHIP INQUIRIES' : 'İŞ ORTAKLIĞI GÖRÜŞMELERİ'}
          </h2>
          <div className="editorial-actions" style={{ justifyContent: 'center' }}>
            <Link to="/iletisim" className="editorial-btn editorial-btn-primary">{isEN ? 'Contact us' : 'İletişime geç'}<HiOutlineArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
