# Uygulama Değişiklik Günlüğü (şartname §32.19)

`CLAUDE_CODE_KADE_MASTER_PROMPT_TR.md` şartnamesi kapsamında yapılan
tüm değişikliklerin commit-bazlı özeti. Her madde gerçek bir commit'e
bağlı — bkz. `git log`.

## Faz 0/1 — Envanter ve temel doğrulama

- `3f02093` — Gereksinim izlenebilirlik matrisi, mevcut durum denetimi, rota envanteri, 26 Haziran legacy sürüm karşılaştırması oluşturuldu.

## Faz 2 — Mimari kararlar

- `d22eaae` — 4 bağlayıcı mimari karar (Kade Studio = video editör tabanı, kadeai araçları genişletilecek, iki ticaret sistemi birleştirilmeyecek, npm lockfile birincil), tasarım sistemi denetimi, 401/403/429/bakım sayfaları eklendi.

## Faz 3 — Ticaret ve ödeme güvenliği

- `94ccc9c` — Sitemap tamlığı/doğruluğu düzeltildi (eksik statik sayfalar + dinamik blog/partner URL'leri eklendi, var olmayan `/roi-hesaplayici` rota referansı kaldırıldı).
- `7c23382` — Marka `sameAs`/sosyal profil boşluğu blocker olarak kaydedildi.
- `0c9d2fb` — Teklif durum makinesi (§8.5 alt kümesi) + audit log şema genişletmesi migration olarak hazırlandı.
- `6aa4076` — **Gerçek boşluk kapatıldı:** Shopier iade/chargeback durumu hiç ele alınmıyordu. Kod incelemesiyle Shopier'in otomatik iade webhook'u olmadığı doğrulandı; admin-taraflı manuel iade işaretleme + otomatik paket pasifleştirme eklendi.
- `640b734` — **Gerçek boşluk kapatıldı:** `/blog/:slug` ve `/partnerler/:id` tamamen NotFound stub'ıydı (sitemap'in ürettiği URL'ler 404 veriyordu). Gerçek CMS içeriğine bağlandı.

## Faz 4 — Admin panel

- `dbbe744` — Roller/izinler yönetim modülü (30 modüllük izin matrisi) + `users.js`'te gerçek bir Supabase alan-adı regresyonu düzeltildi (`mapUser()` eksikti, düzenle/sil canlıda çalışmıyordu).
- `1759407` — Güvenlik olayları logu (başarısız giriş/rate-limit → "Güvenlik" filtresi) + `logActivity()`'nin iki senkron olmayan kopyası birleştirildi + `notifications.js`'teki mapping bugları (Aktivite Logu "NaN dk önce" gösteriyordu) düzeltildi.
- `6345493` — Sistem Sağlığı admin modülü (Supabase bağlantı durumu, env değişkeni var/yok, sunucu bilgisi — gerçek değerler hiç döndürülmüyor).
- `0db9583` — Feature flags modülünün bilinçli olarak kurulmadığı gerekçesiyle belgelendi (somut kullanım senaryosu yok).
- `3cfeb62` — Kupon/Kampanya admin modülü (şema + saf doğrulama mantığı + 9 unit test + tam CRUD) — checkout'a bilinçli olarak kablolanmadı.
- `56d36c0` — Add-on yönetiminin mevcut çoklu-paket sistemiyle zaten karşılandığı doğrulandı (yeniden inşa edilmedi).
- `5ab3733` — 44 modüllük admin panel kapsam matrisi (`docs/06`) — 24/44 Var, 11/44 Kısmen, 9/44 Yok.

## Faz 7 — İş modeli kararları

- `7a89eca` — Odoo değerlendirmesi: **kurulmayacak** kararı, gerekçeli (mevcut CRM/teklif/fatura sistemleri ihtiyacı zaten karşılıyor).
- `e60d549` — Referans ürün analizi (rekt/YouMind/ChatCut) — 15 fikir sınıflandırıldı, kredi/kullanım modeli önceliği doğrulandı.

## Faz 8 (erken başlangıç) — Güvenlik

- `4e0a32f` — Kod-seviyesi güvenlik denetimi (`docs/07`). **Gerçek açık bulundu ve kapatıldı:** `chat.js`'te `adminMode` yalnızca "herhangi bir admin" kontrol ediyordu, spesifik `aiContent` iznini değil — viewer rolü UI'yı atlayıp yüksek limitli AI kanalını kullanabilirdi.
- `686d04f` — Rate-limit mimarisi doğrulandı (Upstash Redis + production'da fail-closed fallback).
- Aynı turda: `docs/THREAT_MODEL_TR.md` (§23'ün ~50 maddelik kontrol listesi tek tek ele alındı), `npm audit fix` ile 2 düşük önem bağımlılık açığı düzeltildi.

## Hukuki

- `21a3432` — Hukuki uyumluluk kontrol listesi (`docs/08`) — 19 public hukuki sayfa maddesinin envanteri (4 var/onay bekliyor, 15 yok). En kritik bulgu: Shopier ile gerçek satış canlıyken Mesafeli Satış Sözleşmesi/Cayma-İptal-İade sayfaları hiç yok.

## Altyapı (planlanmamış, acil)

- `20e23d8` — **Üretim kesintisi giderildi:** Vercel Framework Preset yanlışlıkla "Services" olarak ayarlıydı (PR #8 denemesinden kalma, git'te karşılığı yok), her deployment 2-3 saniyede hata veriyordu. `vercel.json`'a `"framework": "vite"` eklenerek düzeltildi, canlı deployment ile doğrulandı.

## 24 Temmuz 2026 — Statik Codex devam çalışması (henüz commit edilmedi)

- Kade AI Supabase public env doğrulaması tek kaynağa taşındı; boş,
  placeholder ve geçersiz URL değerleri login/proxy/client/server katmanlarında
  fail-closed davranıyor.
- Parola login hata eşlemesi düzeltildi: kimlik reddi `401`, rate limit `429`,
  config/sağlayıcı kesintisi `503`. Sağlayıcı hata mesajı loga aynen yazılmıyor.
- Altı kalan public pazarlama sayfası paylaşılan editoryal desene geçirildi:
  ServiceDetail, PartnerDetail, BlogDetail, CaseStudies, NewMediaAgency,
  Tesekkur.
- `/@link` ve gated paneller ürün/operasyon işlevleri nedeniyle bilinçli
  tasarım istisnası olarak belgelendi.
- `feat/site-dark-editorial` için gerçek `legacy:build` engeli kapandı.
- Route denetleyicisindeki dinamik blog/partner yanlış negatifleri giderildi.
  Ardından `/fiyat-hesaplama`, `/basin`, `/neden-biz`,
  `/referans-programi`, `/podcast-webinar` ve `/bulten-arsivi` public
  sayfaları CMS, SEO, sitemap, footer ve statik HTML üretimine bağlandı;
  envanter artık 169/169.
- Fiyat hesaplayıcı server-yönetimli katsayılarla çalışan güvenli tahmin
  fonksiyonuna bağlandı. Basın/yayın fallback'leri doğrulanmamış örnek haber,
  sayı veya etkinlik göstermiyor.
- Public referans formunun yanlış admin-yetkisi bağı kaldırıldı; açık rıza,
  honeypot, saatlik IP rate limit'i ve sunucu tarafı iletişim doğrulaması
  eklendi.
- Windows üzerinde Playwright web sunucusunu ve bundle-secret build komutunu
  başlatan scriptler `.cmd`/npm CLI uyumlu hale getirildi.
- Kade AI bağımlılıkları Next.js 16.2.11 ile hizalandı; güvenlik yamalı
  `postcss` 8.5.22 ve `sharp` 0.35.3 kontrollü override edildi. Production
  audit sonucu 0 bulgudur.
- Doğrulama: legacy build, lint, 27 unit test, 70 Playwright senaryosu,
  Kade AI lint/typecheck/26 unit test/production build/client-secret taraması
  geçti. Kök Studio entegrasyon testi yerel PostgreSQL olmadığı için çalışmadı
  ve blocker #20 olarak kaydedildi.
- Canlı tarayıcıda altı yeni rota 1440px ve 390px genişlikte doğrulandı;
  yatay taşma görülmedi ve fiyat hesaplayıcının etkileşimli sonucu kontrol
  edildi.

## Bu oturumdan önce (önceki turlar, referans için)

- `9c2a6aa` — Admin paket fiyatlandırması `/paketler` sayfasına gerçek bağlandı.
- `542a2c8` — Shopier test düzeltmesi, server-only kusur giderme.
- MongoDB→Supabase tam veri taşıması (bu changelog'un kapsamı dışındaki daha eski commit'lerde).

## Doğrulama disiplini

Her commit öncesi: `npx eslint . --ext .js,.jsx` (baseline 25 hata/7 uyarı,
hiç artmadı), `node --test tests/unit/*.test.js` (24/24, oturum başında
15/24'ten büyüdü — 9 yeni kupon testi eklendi), `npx vite build` veya
`npx vercel build`. Canlı Supabase kredensiyali olmadığı için hiçbir
değişiklik gerçek veriye karşı uçtan uca test edilemedi — bu, tüm
belgelerde açıkça belirtildi, "test edildi" diye yanlış iddia edilmedi.
