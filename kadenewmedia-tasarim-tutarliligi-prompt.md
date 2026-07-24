# Kade New Media — Tasarım Tutarlılığı: haoqi.design Kaynağını Doğru Şekilde Klonlayıp Tüm Siteye Yayma

## Bağlam (önce oku, sonra başla)

`kadenewmedia.com` şu anda **iki farklı tasarım dilinin üst üste bindirilmesinden** oluşuyor:

1. **Anasayfa (`/`)** — `vercel.json` içindeki `{"source":"/","destination":"/site.html"}` rewrite'ı yüzünden React router'a hiç girmiyor; `public/site.html`, **haoqi.design**'ın (Haoqi Wen'in kişisel portfolyo/tasarım sitesi) donmuş bir Next.js snapshot'ı. Canlı karşılaştırmayla doğrulandı: aynı "hello" 3D cursive WebGL hero animasyonu, aynı "I BRING CRAFT & TASTE TO DIGITAL WORK" başlık yapısı (Kade'de "BİZ MARKANI BÜYÜTÜYORUZ" olarak değiştirilmiş), aynı grid-cross dekoratif işaretler, aynı monospace etiketler. Hatta Haoqi'nin kendi portfolyo işi olan **"REUNIMOS™"** rozeti hâlâ DOM'da duruyor (temizlenmemiş kalıntı içerik — nav bar'ın üstüne bindiği için ayrıca görsel bug'a da yol açıyor).
   - `public/site.html` içine `<script id="kade-home-cleanup">` / `<style id="kade-pf">` enjekte edilerek, çalışma zamanında `MutationObserver` + `setInterval` polling ile DOM'a Kade navigasyonu/markası **hackle yamanmış**.
   - Kade rengi (krem/altın) elde etmek için canvas'a CSS filtre hilesi uygulanmış: `canvas{filter:sepia(.55) saturate(1.5) hue-rotate(-8deg) brightness(1.04) !important;}` — haoqi.design'ın orijinal light teması aslında gök mavisi, Kade'nin krem/altın tonu bu filtrenin ürünü.
   - Anasayfa görsel olarak: lacivert hero (turuncu 3D "hello" WebGL yazısı) → siyah bölüm (portre fotoğraf + altın cursive "Kade" imzası, büyük beyaz editoryal tipografi, altı çizili linkler). Tamamen **koyu, portfolyo-editoryal** bir estetik.

2. **Sitenin geri kalanı** (`/hizmetler`, `/hakkimizda`, `/portfolio`, `/paketler`, `/blog`, `/iletisim`, vb. — React router üzerinden `src/pages/*.jsx` + `src/styles/kade-yeni.css` + `src/index.css`) — **açık krem/altın** bir pazarlama-sitesi estetiği kullanıyor: `--bg-primary:#fbfaf4`, `--ky-gold:#e0a81f`, `TikTokSans` başlık fontu, `GeistMono`/`DepartureMono` monospace etiketler (`— HİZMETLERİMİZ` gibi), yuvarlatılmamış/düz kartlar, siyah kalın başlıklar, altın pill CTA butonları.

**Önemli tespit:** `kade-yeni.css` aslında haoqi.design'dan ilham alan bir tasarım sistemi zaten var (aynı font aileleri, aynı monospace etiket kalıbı) — yani "kaynak" fikri sitenin geri kalanına da bulaşmış, ama **anasayfa hâlâ ham/donmuş orijinal haoqi HTML'i**, geri kalan sayfalar ise **bu kaynaktan esinlenerek elle yeniden üretilmiş krem/altın bir yorum**. Sonuç: ziyaretçi `/`'den `/hizmetler`'e geçtiğinde iki farklı siteye geçmiş gibi hissediyor (koyu editoryal WebGL portfolyo → açık kart tabanlı kurumsal pazarlama sitesi).

Canlıda ayrıca doğrulandı: anasayfada nav'da **"İLETİŞİM" hâlâ iki kez** görünüyor (bu, `public/site.html` satır 23'teki `items` dizisinden `İLETİŞİM` kaldırılarak yerel olarak düzeltildi — commit `ab81449` — ama henüz `git push` yapılmadığı için canlıya yansımadı; bu prompt'u çalıştırmadan önce o push'un yapılmış olması gerekiyor, yoksa aynı reg resyonu tekrar görürsün).

## Görev

`/clone-website` skill'ini (`.claude/skills/clone-website/SKILL.md`) kullanarak **haoqi.design'ı doğru ve eksiksiz şekilde çıkar (extract)**, ardından bu çıkarılan tasarım sistemini **anasayfayı native bir React bileşenine dönüştürerek** ve **sitenin geri kalanındaki `kade-yeni.css` tasarım diliyle uyumlu hale getirerek** tüm `kadenewmedia.com`'a tutarlı şekilde yay.

Bu, skill'in varsayılan senaryosu olan "sıfırdan Next.js+shadcn iskeletine birebir klon" değil — **mevcut bir Vite+React çok sayfalı siteye entegrasyon**. Aşağıdaki adaptasyonları uygula.

### Adım 0 — Skill'in ön koşullarını adapte et

`/clone-website` skill'inin "Pre-Flight" adımı `npm run build` ile Next.js+shadcn iskeletinin var olduğunu varsayıyor — bu proje Vite+React. Skill'i şu şekilde kullan:

- **Phase 1 (Reconnaissance)**'ı skill'in tarif ettiği gibi birebir uygula: `https://haoqi.design/` için tam sayfa screenshot (desktop 1440px + mobile 390px), font/renk/favicon çıkarımı, **Mandatory Interaction Sweep** (scroll/click/hover/responsive taramaları — özellikle "hello" WebGL hero'nun scroll'a nasıl tepki verdiği, tema toggle'ının `THEME[D]→[A]→[L]` döngüsü, WORK linkinin in-page anchor scroll olup ayrı route olmadığı zaten doğrulandı), ve **Page Topology** çıkarımı.
- Çıktıları skill'in belirttiği gibi `docs/research/haoqi.design/` altına yaz: `PAGE_TOPOLOGY.md`, `BEHAVIORS.md`, `docs/research/components/*.spec.md`, `docs/design-references/haoqi.design/*.png`.
- **Phase 2 (Foundation Build)**'i Next.js'e özgü kısımlarını (`next/font`, shadcn token eşlemesi) atla — bunun yerine çıkarılan font/renk/spacing değerlerini mevcut `src/styles/kade-yeni.css` ve `src/index.css` içindeki CSS custom property'lerle **karşılaştır ve birleştir** (aşağıda Adım 2).
- SVG ikon çıkarımı, asset indirme scripti (`scripts/download-assets.mjs` mantığı), ve component spec dosyası şablonu skill'de tarif edildiği gibi aynen kullanılabilir — hedef klasörleri `src/embedded/haoqi-assets/` veya benzeri bir Vite-uyumlu konuma yönlendir.

### Adım 1 — Anasayfayı gerçek bir React bileşenine dönüştür

Amaç: `public/site.html` + DOM-patch hack'ini tamamen ortadan kaldırmak.

1. Skill'in Phase 3 metodolojisiyle (extract → spec dosyası → dispatch) anasayfanın her bölümünü (hero/"hello" WebGL, siyah portre bölümü, footer) `docs/research/components/*.spec.md` olarak belgele.
2. Bu spec'lerden yola çıkarak `src/pages/Home.jsx` (yeni) oluştur — mevcut `src/components/Navbar.jsx`'in kanonik `NAV_LINKS` dizisini (6 link, İLETİŞİM tekrarı yok) kullanmalı, DOM-patch script'ine ihtiyaç duymamalı.
3. "hello" 3D cursive WebGL hero'yu gerçek bir React bileşenine (Three.js/React Three Fiber veya orijinaldeki teknoloji neyse onunla) yeniden inşa et — spec dosyasındaki tam geometri/materyal/animasyon değerleriyle. Eğer kapsam/performans nedeniyle tam WebGL yeniden inşası çok büyükse, bunu açıkça bir sınırlama olarak raporla ve yüksek kaliteli video/canvas fallback'i alternatif olarak sun — kullanıcıya onaylat, sessizce basitleştirme.
4. "REUNIMOS™" rozetini ve haoqi.design'a ait diğer tüm kalıntı içerikleri (varsa) tamamen kaldır — bunlar Kade'ye ait değil.
5. `vercel.json`'daki `{"source":"/","destination":"/site.html"}` rewrite'ını kaldır, `public/site.html` dosyasını ve içindeki `kade-home-cleanup`/`kade-pf` enjeksiyon script'lerini sil. Anasayfa artık `react-router-dom` üzerinden normal bir route olmalı.

### Adım 2 — Tasarım dilini birleştir (asıl "tutarlılık" işi)

Bu adım ürünsel bir karar gerektiriyor — otomatik karar verme, aşağıdaki iki seçeneği kullanıcıya sun ve onayını al:

- **Seçenek A (önerilen, daha az risk):** Anasayfanın hero'su haoqi.design'ın koyu/editoryal WebGL karakterini korur (bu, sitenin en güçlü/özgün görsel anı — tamamen kaldırmak marka kimliğini zayıflatır), **ama** hero'nun altındaki tüm içerik blokları (istatistikler, hizmet özetleri, CTA'lar) `kade-yeni.css`'teki krem/altın kart sistemine, `TikTokSans`/`GeistMono` tipografisine ve mevcut spacing/radius token'larına geçirilir. Böylece kullanıcı hero'dan aşağı kaydırdığında `/hizmetler`, `/hakkimizda` gibi sayfalara yumuşak bir geçiş hisseder.
- **Seçenek B (daha büyük iş):** Tüm site (40+ sayfa) haoqi.design'ın koyu/editoryal diline geçirilir — bu, `kade-yeni.css` ve `src/index.css`'teki mevcut krem/altın sistemin büyük ölçüde yeniden yazılması anlamına gelir; çok daha yüksek riskli ve kapsamlı.

Hangi seçenek seçilirse seçilsin, ortak yapılacaklar:

- `src/styles/kade-yeni.css` satır 11-27 ve 185-199'daki mevcut design token'ları (`--ky-gold`, `--ky-ink`, `--ky-mono`, `--font: 'TikTokSans'`) **tek kaynak (single source of truth)** yap — anasayfanın yeni React bileşenleri de bu değişkenleri kullanmalı, kendi hardcoded renk/font değerlerini tanımlamamalı.
- `docs/research/haoqi.design/BEHAVIORS.md`'de çıkarılan monospace etiket kalıbını (`— HİZMETLERİMİZ` tarzı eyebrow label'lar, zaten `kade-yeni.css`'te var) anasayfadaki karşılık gelen etiketlerle birebir eşleştir.
- Anasayfadaki buton/CTA stillerini (`GİRİŞ →` gibi) sitenin geri kalanındaki `.primary-btn`/pill buton stiliyle aynı `border-radius`, `padding`, `font-family` değerlerine getir.

### Adım 3 — Temizlik ve doğrulama

1. `public/site.html`'i ve `vercel.json` rewrite'ını kaldırdıktan sonra `npm run build` ve (mümkünse) `npm run legacy:build`'in temiz geçtiğini doğrula.
2. Skill'in **Phase 5 (Visual QA Diff)** adımını uygula: yeni anasayfayı hem `haoqi.design` ile (hero'nun sadakati için) hem de kendi `/hizmetler`, `/hakkimizda` sayfalarınla (tasarım tutarlılığı için) yan yana karşılaştır — masaüstü (1440px) ve mobil (390px).
3. Konsolda hydration/React uyarısı olmadığını doğrula (eski kurulumda `#418` hydration hatası vardı — kaynağı donmuş Next.js DOM'unun React router ile çakışmasıydı; yeni native bileşende bu sorunun kalmadığını teyit et).
4. `src/components/Navbar.jsx`'teki nav linklerinin anasayfada da (artık kendi native bileşeni olarak) birebir aynı 6 link olduğunu, tekrar/eksik olmadığını doğrula.
5. Değişiklikleri ayrı bir branch'te yap, `git push` işlemini **kullanıcının kendisi** yapacak (bu sandbox'ta GitHub kimlik bilgisi yok).

## Tamamlandığında raporla

- Kaç bölüm/bileşen inşa edildi, kaç spec dosyası yazıldı (skill'in "Completion" bölümündeki formatla).
- Seçenek A/B'den hangisinin uygulandığı.
- "hello" WebGL hero'nun tam mı yoksa fallback ile mi yeniden inşa edildiği.
- Kalan bilinen boşluklar/sınırlamalar (varsa).
- Build durumu (`npm run build` sonucu) ve görsel QA'da bulunan farklılıklar.
