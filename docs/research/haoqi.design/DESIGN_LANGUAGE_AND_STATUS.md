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

### ⏳ Kalan — Seçenek B'nin ana gövdesi (39 diğer sayfa)
Kullanıcı **Seçenek B**'yi seçti: tüm site editoryal dile. Bu oturumda
**anasayfa desen olarak** kuruldu; kalan ~39 sayfanın (hizmetler, hakkımızda,
paketler, blog, iletişim, portfolio, ekip, kariyer, sss, referanslar,
partnerler, kvkk/gizlilik/çerez/telif, teklif-al, müşteri paneli parçaları vb.)
kart-tabanlı düzenden editoryal düzene geçirilmesi **büyük, iteratif bir iş**
— tek oturumda görsel-QA ile bitirilemez, dürüstçe kalan olarak işaretlendi.

**Kalan iş için desen (Home.jsx'ten):**
1. Kart yerine editoryal liste/grid; ince `--ky-line` ayraçlar.
2. Monospace eyebrow (`— BAŞLIK`), dev clamp tipografi, altı-çizili inline linkler.
3. Buton: altın pill (`.home-btn-primary` kalıbı) — tüm sayfalarda aynı radius/padding/font.
4. Bölüm ritmi: `.section` + üst `--ky-line` border.

## 3. Önemli not — "koyu" vs "krem"
Keşifte doğrulandı: **haoqi'nin gerçek teması açık/krem** (`#fbfaf4`), koyu değil.
Kade'nin mevcut paleti zaten haoqi'yle neredeyse aynı. Dolayısıyla Seçenek B'nin
gerçek işi renk değişimi değil, **editoryal MUAMELE'nin** (tipografi ölçeği,
kartsızlık, altı-çizgi linkler, monospace etiketler, grid estetiği) tüm sayfalara
yayılması. Bu, "tutarlılık" hedefine renk-devrimi olmadan ulaşır ve riski düşürür.
