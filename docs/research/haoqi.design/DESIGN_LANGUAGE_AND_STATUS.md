# haoqi Editoryal Dili — Token'lar, Uygulama Durumu ve Kalan Kapsam

## 1. Tek kaynak token'lar (mevcut — `src/styles/kade-yeni.css`)

Kade zaten haoqi'den esinlenen bir token sistemi taşıyor. Anasayfanın yeni
native bileşenleri de **bu değişkenleri** kullanır (kendi sabit değerlerini
tanımlamaz):

| Token | Değer | Rol |
|---|---|---|
| `--bg-primary` | `#fbfaf4` | Krem zemin (haoqi ile aynı) |
| `--ky-ink` | `#17130a` | Neredeyse siyah metin |
| `--ky-gold` | `#e0a81f` | Marka altını (haoqi'nin lime aksanının karşılığı) |
| `--ky-gold-deep` | `#c8901a` | Hover/koyu altın |
| `--ky-line` | `rgba(23,19,10,0.11)` | İnce ayraç çizgileri |
| `--ky-mono` | `GeistMono` | Monospace eyebrow/etiket/buton |
| font (display) | `TikTokSans` | Editoryal başlık |

## 2. Uygulama durumu (bu oturum)

### ✅ Tamamlandı — Anasayfa native React'e taşındı
- `src/pages/Home.jsx` yeniden yazıldı: gerçek `<Navbar/>` (6 kanonik link, **tekrar yok**) + izole WebGL hero (iframe) + editoryal hizmet listesi (01–06, altın index, altı-çizili satırlar) + dev tipografi CTA + gerçek `<Footer/>`.
- `src/pages/Home.css`'e editoryal stiller eklendi (yalnızca token'larla).
- **WebGL hero izole edildi:** `public/hero.html` = donmuş bundle'ın yalnızca hero'su (canvas + hero grid + gerekli `_next` chunk'ları), DOM-patch script'leri (`kade-home-cleanup` 12.9KB + `kade-pf` IIFE 3.6KB) kaldırıldı, hero dışı bölümler CSS ile gizlendi. Home içinde iframe → **hydration #418 hatası artık iframe'e izole** (ana React ağacı temiz; donmuş bundle'ın kendi hatası iframe içinde kalıyor — "orijinali izole et" kararının kabul edilen ödünü).
- `public/site.html` silindi; `/`→site.html rewrite'ı `vercel.json` ve `vite.config.js`'ten kaldırıldı; `scripts/serve-dist.mjs` `/`→app.html'e güncellendi. `public/_next/` (WebGL chunk'ları) korundu.
- **Doğrulama:** `npm run legacy:build` ✓; Playwright duman testi ✓ (Navbar 6 link/tekrar yok, iframe canvas render=1, editoryal 6 hizmet, `isFrozenSite:false`). Screenshot: `docs/design-references/kade-home-native-desktop.png`.

### ✅ Devam — Seçenek B, 2. oturum: 16 sayfa editoryal desene geçti
Desen artık paylaşılan sınıflarda: `src/styles/kade-yeni.css` içinde
`.editorial-eyebrow`, `.editorial-lead`, `.editorial-subtitle`,
`.editorial-list` (+ `-link`/`-row`/`-idx`/`-body`/`-label`/`-desc`/
`-tags`/`-tag`/`-arrow`), `.editorial-display-title`, `.editorial-btn`
(+ `-primary`/`-ghost`). Home.jsx'in `home-*` sınıfları buraya taşındı,
tek kaynak oldu — yeni sayfalar bu sınıfları import gerekmeden kullanır
(global CSS).

Bu oturumda dönüştürülen sayfalar (hero + ana kart/grid gövdesi):
`Services.jsx` (hizmetler), `About.jsx` (hakkımızda — hikaye/logo
animasyonu bilinçli korundu), `Portfolio.jsx` (hero+CTA; pf-tiles zaten
yakındı), `Packages.jsx` (hero+SSS; fiyat kartları bilinçli korundu),
`Contact.jsx` (hero+iletişim bilgisi; form korundu), `SSS.jsx`
(hero+accordion), `Blog.jsx` (hero+yazı listesi, küçük görselli),
`Team.jsx` (hero+ekip listesi), `Careers.jsx`/`Referanslar.jsx`/
`Partners.jsx` (yalnız hero+CTA — gövdeleri zaten pf-tiles/pf-proc
desenindeydi), `KVKK/Gizlilik/CerezPolitikasi/TelifHaklari.jsx`
(paylaşılan `Legal.css` üzerinden — glass-card kaldırıldı, düz
`--ky-line` üst çizgili konteyner + mono eyebrow h2), `QuoteRequest.jsx`
(yalnız hero — sihirbaz gövdesi bilinçli korundu).

**Bilinçli olarak dokunulmayan yerler (kural değil, istisna):**
- Fiyat/paket karşılaştırma kartları (Packages.jsx) — liste formatı
  karşılaştırma UX'ini zayıflatır.
- Fonksiyonel formlar (Contact.jsx form, QuoteRequest.jsx sihirbazı) —
  state/validasyon içeren etkileşimli akışlar; yapısal risk yüksek.
- About.jsx'teki animasyonlu logo/hikaye bölümü — kart değil, özgün
  marka anı.
- Hukuki düz yazı gövdesi (KVKK vb. metin içeriği) — liste formatına
  uygun değil, yalnızca konteyner/başlık stili değişti.

**Kalan — henüz dokunulmayan public sayfalar:** `ServiceDetail.jsx`,
`PartnerDetail.jsx`, `BlogDetail.jsx`, `CaseStudies.jsx`,
`NewMediaAgency.jsx`, `LinkProfile.jsx`, `Tesekkur.jsx` ve gated alanlar
(`CustomerPortal.jsx`, `Admin.jsx`, Organizasyon Kiti panelleri, giriş
sayfaları) — bunlar bu oturumun kapsamı dışında bırakıldı, ayrı bir
dalga gerektirir.

**Desen (değişmedi, referans):**
1. Kart yerine editoryal liste/grid; ince `--ky-line` ayraçlar (istisnalar yukarıda).
2. Monospace eyebrow (`— BAŞLIK`), dev clamp tipografi, altı-çizili inline linkler.
3. Buton: altın pill (`.editorial-btn-primary`) — tüm sayfalarda aynı radius/padding/font.
4. Bölüm ritmi: `.section` + üst `--ky-line` border (`.editorial-section`).

**Doğrulama notu:** Bu oturumda `npm run build` bu sandboxta çalıştırılamadı
(node_modules eksik ikili dosyalar). Her dosya için parantez/süslü parantez
dengesi script ile kontrol edildi, ancak gerçek bir derleme/görsel QA
(Phase 5) yapılmadı — deploy sonrası canlıda kontrol edilmeli.

## 3. Önemli not — "koyu" vs "krem"
Keşifte doğrulandı: **haoqi'nin gerçek teması açık/krem** (`#fbfaf4`), koyu değil.
Kade'nin mevcut paleti zaten haoqi'yle neredeyse aynı. Dolayısıyla Seçenek B'nin
gerçek işi renk değişimi değil, **editoryal MUAMELE'nin** (tipografi ölçeği,
kartsızlık, altı-çizgi linkler, monospace etiketler, grid estetiği) tüm sayfalara
yayılması. Bu, "tutarlılık" hedefine renk-devrimi olmadan ulaşır ve riski düşürür.
