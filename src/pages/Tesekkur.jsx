import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlineCheckCircle,
  HiOutlineMail,
} from 'react-icons/hi'
import { useSEO } from '../hooks/useSEO'
import { CONTACT } from '../utils/constants'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import './Tesekkur.css'

export default function Tesekkur() {
  const location = useLocation()
  const submitted = location.state?.submitted === true
  const title = submitted ? 'Talebiniz alındı' : 'Talep durumu doğrulanamadı'

  useSEO({
    title: 'Talep Durumu | Kade New Media',
    description: 'Kade New Media iletişim talebi durum bilgisi.',
    path: '/tesekkur',
    noindex: true,
  })

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
      })
    }
  }, [])

  return (
    <PageTransition>
      <section className="editorial-section section tesekkur-section">
        <div className="container tesekkur-container">
          <motion.div
            className="tesekkur-ikon-wrap"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
          >
            <HiOutlineCheckCircle size={72} />
          </motion.div>

          <FadeIn delay={0.2}>
            <span className="editorial-eyebrow">— Talep durumu</span>
            <h1 className="editorial-lead" style={{ maxWidth: '18ch', textAlign: 'center' }}>{title}</h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="editorial-subtitle" style={{ textAlign: 'center' }}>
              {submitted
                ? 'Mesajınızı aldık, kaydedildi.'
                : 'Bu sayfayı doğrudan açmış ya da yenilemiş görünüyorsunuz. Bu ekrandan daha önce gönderdiğiniz bir talebin durumunu göremiyoruz.'}
            </p>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div className="editorial-list-row" style={{ width: '100%' }}>
              <span className="editorial-list-idx"><HiOutlineMail size={18} /></span>
              <span className="editorial-list-body">
                <span className="editorial-list-label">{submitted ? 'Ek bilgi paylaşmak için' : 'Talebinizi doğrulamak veya yeniden iletmek için'}</span>
                <a className="editorial-list-desc" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.55}>
            <div className="editorial-actions" style={{ justifyContent: 'center', marginTop: 32 }}>
              <Link to="/" className="editorial-btn editorial-btn-ghost">
                Anasayfaya Dön
              </Link>
              <Link to="/iletisim" className="editorial-btn editorial-btn-primary">
                İletişim sayfasına git
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  )
}
