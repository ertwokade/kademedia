import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiOutlineHome, HiOutlineArrowRight, HiOutlineSearch } from 'react-icons/hi'
import { useLanguage } from '../i18n/LanguageContext'
import { useSEO } from '../hooks/useSEO'
import PageTransition from '../components/PageTransition'
import './NotFound.css'

const populerSayfalar = [
  { yol: '/hizmetler', etiket: '📋 Hizmetler' },
  { yol: '/paketler', etiket: '💰 Paketler' },
  { yol: '/sss', etiket: '❓ SSS' },
  { yol: '/iletisim', etiket: '✉️ İletişim' },
]

export default function NotFound() {
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [arama, setArama] = useState('')

  useSEO({
    title: lang === 'tr' ? 'Sayfa Bulunamadı | Kade New Media' : 'Page Not Found | Kade New Media',
    description: lang === 'tr' ? 'Aradığınız sayfa bulunamadı.' : 'The page you are looking for was not found.',
    path: location.pathname,
    noindex: true,
  })

  const handleArama = (e) => {
    e.preventDefault()
    const sorgu = arama.trim().toLowerCase()
    if (!sorgu) return
    if (sorgu.includes('blog')) navigate('/blog')
    else if (sorgu.includes('hizmet') || sorgu.includes('servis')) navigate('/hizmetler')
    else if (sorgu.includes('paket') || sorgu.includes('fiyat')) navigate('/paketler')
    else if (sorgu.includes('iletisim') || sorgu.includes('iletişim') || sorgu.includes('contact')) navigate('/iletisim')
    else if (sorgu.includes('partner') || sorgu.includes('referans')) navigate('/partnerler')
    else if (sorgu.includes('ekip') || sorgu.includes('team')) navigate('/ekip')
    else if (sorgu.includes('kariyer') || sorgu.includes('iş')) navigate('/kariyer')
    else if (sorgu.includes('sss') || sorgu.includes('soru')) navigate('/sss')
    else navigate('/iletisim')
  }

  return (
    <PageTransition>
      <section className="notfound-section">
        <div className="grid-bg" />
        <div className="glow-effect" style={{ top: '-150px', right: '-100px' }} />
        <div className="container notfound-container">
          <div className="notfound-code nf-reveal" style={{ '--d': '0s' }}>
            4<span>0</span>4
          </div>
          <h1 className="nf-reveal" style={{ '--d': '0.08s' }}>
            {lang === 'tr' ? 'Sayfa Bulunamadı' : 'Page Not Found'}
          </h1>
          <p className="nf-reveal" style={{ '--d': '0.16s' }}>
            {lang === 'tr'
              ? 'Aradığınız sayfa mevcut değil veya taşınmış olabilir.'
              : 'The page you are looking for does not exist or may have been moved.'}
          </p>

          <form
            className="notfound-arama nf-reveal"
            style={{ '--d': '0.22s' }}
            onSubmit={handleArama}
          >
            <input
              type="text"
              placeholder={lang === 'tr' ? 'Ne arıyordunuz? (blog, hizmetler, paketler...)' : 'What were you looking for?'}
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              className="notfound-arama-input"
              aria-label={lang === 'tr' ? 'Site içinde ara' : 'Search the site'}
            />
            <button type="submit" className="notfound-arama-btn" aria-label={lang === 'tr' ? 'Ara' : 'Search'}>
              <HiOutlineSearch size={18} />
            </button>
          </form>

          <div className="notfound-actions nf-reveal" style={{ '--d': '0.3s' }}>
            <Link to="/" className="btn btn-primary">
              <HiOutlineHome size={18} />
              {lang === 'tr' ? 'Anasayfa' : 'Home'}
            </Link>
            <Link to="/iletisim" className="btn btn-outline">
              {lang === 'tr' ? 'İletişim' : 'Contact'}
              <HiOutlineArrowRight size={16} />
            </Link>
          </div>

          <div className="notfound-populer nf-reveal" style={{ '--d': '0.38s' }}>
            <p className="notfound-populer-baslik">
              {lang === 'tr' ? 'Popüler Sayfalar' : 'Popular Pages'}
            </p>
            <div className="notfound-populer-grid">
              {populerSayfalar.map((s) => (
                <Link key={s.yol} to={s.yol} className="notfound-populer-link">
                  {s.etiket}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </PageTransition>
  )
}
