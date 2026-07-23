# haoqi.design — Sayfa Topolojisi (Faz 1 keşfi)

Kaynak: `https://haoqi.design/` (Playwright ile, 2026-07-23, viewport 1440 & 390).
Screenshot'lar: `docs/design-references/haoqi.design/`.

## Tek sayfa, tek scroll konteyneri

haoqi.design tek bir uzun sayfadır (SPA route yok; "WORK"/"CONTACT" sayfa-içi
anchor'dır, ayrı route değil — canlıda doğrulandı). `<section>` sayısı: 1
(içerik çoğunlukla grid `<div>`lerle kuruluyor).

## Bölümler (yukarıdan aşağı)

| # | Ad | Tür | Not |
|---|---|---|---|
| 0 | Sabit header/nav | fixed overlay | Sol: `HAOQI.DESIGN` logo + "Design & Engineering". Orta: "Thinking in systems. Designing with care." + intro paragrafı ("I'm Haoqi Wen, leading Design Engineering...") lime `01G75` aksanıyla. Sağ: `WORK · CONTACT · THEME[A] · SOUND[/]`. Monospace, uppercase, 700. |
| 1 | Hero — "hello" WebGL | akış, tam ekran (`h-dvh`) | **2 WebGL canvas** (`getContext('webgl')` → true). Mavi krom kıvrık "hello" 3D yazı. Arkada gök-mavisi + diyagonal ışık huzmesi. Fixed canvas `inset:0 -z-1`. Üstünde dev uppercase editoryal başlık ("I BRING CRAFT & … TO DIGITAL WORK") lime glitch aksanlarıyla (`/PG`, `4%T/`). Grid-cross `+` dekoratif işaretleri. Alt monospace koordinat etiketleri (`GMT+8 CN 16:52 31°C`, `0720 X 0450 Y`, globe ikonu). |
| 2 | Seçili işler (`#selected-work`) | akış | Editoryal iş listesi; her satır altı-çizili inline link (`reunimos™`, `aDrive`, `Teambition` — **haoqi'nin kendi işleri, Kade'de kaldırılmalı**). |
| 3 | Büyük tipografi ara-bölüm | sticky | Dev uppercase kelimeler (haoqi'de "…", Kade snapshot'ında "MARKA İLE BÜYÜT"). |
| 4 | Footer (`#contact`) | akış, tam ekran | Dev uppercase ("BİRLİKTE HARİKA İŞLER BAŞARALIM" — Kade lokalize), e-posta linki, monospace. |

## Kade snapshot'ındaki durum (bu keşiften önce)

Kade'nin `/` adresi bu sayfanın **donmuş Next.js kopyasıydı** (`public/site.html`),
üzerine `MutationObserver`+`setInterval` ile Kade nav'ı/markası enjekte edilmiş,
canvas'a `sepia(.55) saturate(1.5) hue-rotate(-8deg)` filtresi uygulanarak
gök-mavisi tema krem/altına çevrilmişti. "reunimos™" kalıntısı DOM'da duruyordu.

## Bu oturumda uygulanan

- Anasayfa native React'e (`src/pages/Home.jsx`) taşındı.
- Hero (Bölüm 0-1) **izole** edildi: `public/hero.html` = donmuş bundle'ın
  yalnızca hero'su (WebGL canvas + hero grid), DOM-patch script'leri kaldırılmış,
  hero dışı bölümler CSS ile gizlenmiş → React Home içinde iframe olarak.
- Bölüm 2-4 native editoryal React bileşenlerine dönüştürüldü (gerçek Navbar +
  hizmet listesi + CTA + gerçek Footer).
- `public/site.html`, DOM-patch hack'leri, `/`→site.html rewrite'ı (vercel.json
  + vite.config.js) kaldırıldı.
