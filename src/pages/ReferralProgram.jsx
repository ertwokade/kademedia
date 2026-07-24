import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineArrowRight, HiOutlineShieldCheck } from 'react-icons/hi'
import { submitReferralApi } from '../api'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import { BreadcrumbSchema } from '../components/StructuredData'
import { useSEO } from '../hooks/useSEO'
import { usePublicContent } from '../hooks/usePublicContent'
import { REFERRAL_FALLBACK } from '../data/publicGrowthPages'
import './GrowthPages.css'

const EMPTY_FORM = {
  referrerName: '',
  referrerEmail: '',
  referrerPhone: '',
  leadName: '',
  leadEmail: '',
  leadPhone: '',
  leadCompany: '',
  service: '',
  notes: '',
  website: '',
  consent: false,
}

export default function ReferralProgram() {
  const { content } = usePublicContent('referralProgram', REFERRAL_FALLBACK)
  const [form, setForm] = useState(EMPTY_FORM)
  const [state, setState] = useState({ sending: false, tone: '', message: '' })
  const steps = Array.isArray(content.steps) ? content.steps.filter((item) => item?.baslik) : []
  const serviceOptions = Array.isArray(content.serviceOptions) ? content.serviceOptions.filter(Boolean) : []

  useSEO({
    title: 'Referans Programı | Kade New Media',
    description: 'Dijital iletişim desteğine ihtiyaç duyan bir işletmeyi açık izniyle Kade New Media ekibine yönlendirin.',
    keywords: 'Kade New Media referans programı, ajans yönlendirme',
    path: '/referans-programi',
  })

  const update = (event) => {
    const { name, type, checked, value } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!form.leadEmail.trim() && !form.leadPhone.trim()) {
      setState({ sending: false, tone: 'error', message: 'Önerdiğiniz kişi için e-posta veya telefon bilgilerinden birini girin.' })
      return
    }
    setState({ sending: true, tone: '', message: '' })
    try {
      await submitReferralApi(form)
      setForm(EMPTY_FORM)
      setState({ sending: false, tone: 'success', message: 'Yönlendirme kaydedildi. Ekibimiz uygunluk kontrolünden sonra sizinle iletişime geçecek.' })
    } catch (error) {
      setState({ sending: false, tone: 'error', message: error?.message || 'Yönlendirme şu anda gönderilemedi. Lütfen daha sonra tekrar deneyin.' })
    }
  }

  return (
    <PageTransition>
      <BreadcrumbSchema items={[
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Referans Programı', path: '/referans-programi' },
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
          <span className="editorial-eyebrow">— Nasıl işler?</span>
          <ul className="editorial-list">
            {steps.map((item, index) => (
              <li key={`${item.baslik}-${index}`}>
                <div className="editorial-list-row">
                  <span className="editorial-list-idx">{item.ikon || String(index + 1).padStart(2, '0')}</span>
                  <span className="editorial-list-body">
                    <span className="editorial-list-label">{item.baslik}</span>
                    <span className="editorial-list-desc">{item.aciklama}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="editorial-section section">
        <div className="container">
          <span className="editorial-eyebrow">— {content.rewardKicker}</span>
          <h2 className="editorial-lead" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}>{content.rewardTitle}</h2>
          <p className="editorial-subtitle">{content.rewardText}</p>
        </div>
      </section>

      <section className="editorial-section section">
        <div className="container">
          <span className="editorial-eyebrow">— Yönlendirme formu</span>
          <form className="growth-form" onSubmit={submit}>
            <div className="growth-form-grid">
              <div className="growth-field">
                <label htmlFor="referrer-name">Adınız</label>
                <input id="referrer-name" name="referrerName" value={form.referrerName} onChange={update} maxLength="120" required autoComplete="name" />
              </div>
              <div className="growth-field">
                <label htmlFor="referrer-email">E-posta adresiniz</label>
                <input id="referrer-email" name="referrerEmail" type="email" value={form.referrerEmail} onChange={update} maxLength="254" required autoComplete="email" />
              </div>
              <div className="growth-field">
                <label htmlFor="referrer-phone">Telefonunuz</label>
                <input id="referrer-phone" name="referrerPhone" type="tel" value={form.referrerPhone} onChange={update} maxLength="30" autoComplete="tel" />
              </div>
              <div className="growth-field">
                <label htmlFor="lead-name">Önerdiğiniz kişi</label>
                <input id="lead-name" name="leadName" value={form.leadName} onChange={update} maxLength="120" required />
              </div>
              <div className="growth-field">
                <label htmlFor="lead-email">Kişinin e-postası</label>
                <input id="lead-email" name="leadEmail" type="email" value={form.leadEmail} onChange={update} maxLength="254" />
              </div>
              <div className="growth-field">
                <label htmlFor="lead-phone">Kişinin telefonu</label>
                <input id="lead-phone" name="leadPhone" type="tel" value={form.leadPhone} onChange={update} maxLength="30" />
              </div>
              <div className="growth-field">
                <label htmlFor="lead-company">İşletme / marka</label>
                <input id="lead-company" name="leadCompany" value={form.leadCompany} onChange={update} maxLength="120" />
              </div>
              <div className="growth-field">
                <label htmlFor="referral-service">İlgilenilen hizmet</label>
                <select id="referral-service" name="service" value={form.service} onChange={update}>
                  <option value="">Seçiniz</option>
                  {serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div className="growth-field growth-field--wide">
                <label htmlFor="referral-notes">İhtiyaç hakkında kısa not</label>
                <textarea id="referral-notes" name="notes" value={form.notes} onChange={update} maxLength="1000" />
              </div>
              <div className="growth-field" aria-hidden="true" style={{ position: 'absolute', left: '-10000px' }}>
                <label htmlFor="referral-website">Web sitesi</label>
                <input id="referral-website" name="website" value={form.website} onChange={update} tabIndex="-1" autoComplete="off" />
              </div>
              <label className="growth-check growth-field--wide">
                <input name="consent" type="checkbox" checked={form.consent} onChange={update} required />
                Önerdiğim kişinin iletişim bilgilerini Kade New Media ile paylaşmak için açık izninin bulunduğunu onaylıyorum.
              </label>
            </div>

            <div className="editorial-actions" style={{ marginTop: 24 }}>
              <button className="editorial-btn editorial-btn-primary" type="submit" disabled={state.sending}>
                {state.sending ? 'Gönderiliyor…' : 'Yönlendirmeyi gönder'} <HiOutlineArrowRight size={16} />
              </button>
              <Link className="editorial-btn editorial-btn-ghost" to="/kvkk"><HiOutlineShieldCheck size={16} /> KVKK bilgisi</Link>
            </div>
            <p className="growth-status" data-tone={state.tone} role="status" aria-live="polite">{state.message}</p>
          </form>
        </div>
      </section>
    </PageTransition>
  )
}
