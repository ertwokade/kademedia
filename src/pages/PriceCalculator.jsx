import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineArrowRight, HiOutlineCalculator } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import { BreadcrumbSchema } from '../components/StructuredData'
import { useSEO } from '../hooks/useSEO'
import { usePublicContent } from '../hooks/usePublicContent'
import { calculateEstimatedMonthlyPrice } from '../lib/priceCalculator'
import { PRICE_CALCULATOR_FALLBACK } from '../data/publicGrowthPages'
import './GrowthPages.css'

const formatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
})

export default function PriceCalculator() {
  const { content } = usePublicContent('priceCalculator', PRICE_CALCULATOR_FALLBACK)
  const [selection, setSelection] = useState({
    platforms: 2,
    posts: 12,
    reels: 4,
    ads: false,
    reporting: 'monthly',
  })

  useSEO({
    title: 'Dijital Pazarlama Fiyat Hesaplama | Kade New Media',
    description: 'Platform, içerik, video, reklam yönetimi ve raporlama kapsamına göre tahmini aylık hizmet bedelini hesaplayın.',
    keywords: 'sosyal medya fiyat hesaplama, dijital pazarlama maliyeti, ajans fiyat hesaplama',
    path: '/fiyat-hesaplama',
  })

  const estimate = useMemo(
    () => calculateEstimatedMonthlyPrice(content, selection),
    [content, selection],
  )

  const updateNumber = (key) => (event) => {
    setSelection((current) => ({ ...current, [key]: Number(event.target.value) }))
  }

  return (
    <PageTransition>
      <BreadcrumbSchema items={[
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Fiyat Hesaplama', path: '/fiyat-hesaplama' },
      ]} />

      <section className="editorial-section section">
        <div className="container">
          <FadeIn><span className="editorial-eyebrow">— Kapsam tahmini</span></FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="editorial-lead">İhtiyacın büyüklüğünü fiyat konuşmadan önce görünür kılın.</h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="editorial-subtitle">
              Hesaplama, yönetim ve üretim kapsamını karşılaştırmak için hazırlanmış yaklaşık bir çalışma aracıdır.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="editorial-section section" style={{ borderTop: 'none' }}>
        <div className="container">
          <FadeIn>
            <form className="growth-form" onSubmit={(event) => event.preventDefault()}>
              <div className="growth-form-grid">
                <div className="growth-field">
                  <label htmlFor="calculator-platforms">Yönetilecek platform</label>
                  <input id="calculator-platforms" type="number" min="1" max="12" value={selection.platforms} onChange={updateNumber('platforms')} />
                </div>
                <div className="growth-field">
                  <label htmlFor="calculator-posts">Aylık statik içerik</label>
                  <input id="calculator-posts" type="number" min="0" max="200" value={selection.posts} onChange={updateNumber('posts')} />
                </div>
                <div className="growth-field">
                  <label htmlFor="calculator-reels">Aylık kısa video</label>
                  <input id="calculator-reels" type="number" min="0" max="100" value={selection.reels} onChange={updateNumber('reels')} />
                </div>
                <div className="growth-field">
                  <label htmlFor="calculator-reporting">Raporlama sıklığı</label>
                  <select
                    id="calculator-reporting"
                    value={selection.reporting}
                    onChange={(event) => setSelection((current) => ({ ...current, reporting: event.target.value }))}
                  >
                    <option value="monthly">Aylık</option>
                    <option value="biweekly">İki haftada bir</option>
                    <option value="weekly">Haftalık</option>
                  </select>
                </div>
                <label className="growth-check growth-field--wide">
                  <input
                    type="checkbox"
                    checked={selection.ads}
                    onChange={(event) => setSelection((current) => ({ ...current, ads: event.target.checked }))}
                  />
                  Reklam hesabı kurulumu, optimizasyonu ve raporlaması kapsama dahil olsun.
                </label>
              </div>

              <div className="growth-result" aria-live="polite">
                <span className="editorial-eyebrow"><HiOutlineCalculator aria-hidden="true" /> Tahmini aylık hizmet bedeli</span>
                <strong>{formatter.format(estimate)}</strong>
                <p className="growth-page-note">{content.disclaimer || PRICE_CALCULATOR_FALLBACK.disclaimer}</p>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>

      <section className="editorial-section section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="editorial-display-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>Bağlayıcı kapsamı birlikte çıkaralım.</h2>
          <p className="editorial-subtitle" style={{ margin: '0 auto 32px' }}>Tahmini seçiminizi gerçek hedef, ekip ve takvim bilgisiyle yazılı teklife dönüştürelim.</p>
          <div className="editorial-actions" style={{ justifyContent: 'center' }}>
            <Link to="/teklif-al" className="editorial-btn editorial-btn-primary">Teklif al <HiOutlineArrowRight size={16} /></Link>
            <Link to="/paketler" className="editorial-btn editorial-btn-ghost">Hizmet kapsamları</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
