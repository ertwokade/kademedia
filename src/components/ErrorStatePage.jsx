import { Link, useLocation } from 'react-router-dom'
import { HiOutlineHome, HiOutlineArrowRight } from 'react-icons/hi'
import { useSEO } from '../hooks/useSEO'
import PageTransition from './PageTransition'
import './ErrorStatePage.css'

// Paylaşılan 401/403/429/bakım durum sayfası iskeleti — src/pages/NotFound.jsx
// ile aynı görsel dilde ama kendi (generic isimli) CSS sınıflarını kullanır.
//
// NOT: Giriş animasyonu framer-motion yerine CSS (`.error-reveal`, staggered
// animation-delay) ile yapılır. framer-motion'ın ana-thread rAF animasyonu,
// ağır CPU/dekoratif canvas yükü altında aç kalıp içeriği opacity 0'da
// takılı bırakıyordu ("gövde 3-8 sn görünmez"). CSS animasyonu compositor'da
// çalışır, bu yüzden içerik yük altında da hızlı görünür.
export default function ErrorStatePage({ code, title, message, retryLabel, retryTo = '/', secondaryLabel, secondaryTo = '/iletisim' }) {
  const location = useLocation()

  useSEO({
    title: `${title} | Kade New Media`,
    description: message,
    path: location.pathname,
    noindex: true,
  })

  return (
    <PageTransition>
      <section className="error-state-section">
        <div className="grid-bg" />
        <div className="glow-effect" style={{ top: '-150px', right: '-100px' }} />
        <div className="container error-state-container">
          <div className="error-state-code error-reveal" style={{ '--d': '0s' }}>{code}</div>
          <h1 className="error-reveal" style={{ '--d': '0.08s' }}>{title}</h1>
          <p className="error-reveal" style={{ '--d': '0.16s' }}>{message}</p>
          <div className="error-state-actions error-reveal" style={{ '--d': '0.24s' }}>
            <Link to={retryTo} className="btn btn-primary">
              <HiOutlineHome size={18} />
              {retryLabel}
            </Link>
            {secondaryLabel && (
              <Link to={secondaryTo} className="btn btn-outline">
                {secondaryLabel}
                <HiOutlineArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
