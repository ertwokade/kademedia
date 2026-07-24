// KÖK NEDEN (canlı + CPU-throttle profiliyle doğrulandı): Önceki sürüm
// framer-motion ile JS/rAF-tabanlı opacity animasyonu yapıyordu. Shell
// sayfalarındaki dekoratif partikül canvas'ı (KadeParticleCanvas) ana
// thread'i doyurunca framer-motion'ın rAF döngüsü aç kalıyor, içerik
// opacity ~0'da saniyelerce (3-8 sn) takılı kalıyordu — "yalnızca navbar
// görünür" semptomu buydu.
//
// Çözüm: geçişi tamamen CSS animasyonuna taşı. CSS `opacity`/`transform`
// animasyonları COMPOSITOR üzerinde çalışır; ana thread meşgul olsa bile
// tamamlanır. Böylece içerik görünürlüğü artık canvas yüküyle yarışmaz.
// framer-motion ve blur filtresi kaldırıldı (blur zaten pahalıydı).
export default function PageTransition({ children }) {
  return <div className="page-wrapper page-reveal">{children}</div>
}
