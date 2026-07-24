# Tüm Rotalar — `/` ile başlayan her şey (tek liste)

Koddan doğrudan çıkarıldı (`src/App.jsx`, `api/[...path].js`, `vercel.json`,
`apps/kadeai/app/**`, `apps/studio-web/app/**`). Güncelleme: 2026-07-24.
Dinamik segmentler (`:slug`, `:id`, `:handle`, `[projectId]`, `[exportId]`)
gerçek değerlerle çalışır.

**Özet:** Kök ~44 sayfa + 33 API · Kade AI 41 sayfa + 55 API · Kade Studio 4 sayfa + 11 API

---

## 1) Kök site — Public sayfalar (`kadenewmedia.com`)

| Yol | Açıklama |
|---|---|
| `/` | Ana sayfa — native React (`Home.jsx`), izole WebGL hero + editoryal içerik |
| `/hizmetler` | Hizmetler listesi |
| `/hizmetler/:slug` | Hizmet detayı (sosyal-medya-yonetimi, icerik-uretimi, reklam-yonetimi, video-produksiyon, strateji-danismanlik, web-sitesi-tasarimi) |
| `/new-media-ajansi` | New Media ajansı |
| `/paketler` | Paketler / fiyatlandırma |
| `/hakkimizda` | Hakkımızda |
| `/iletisim` | İletişim |
| `/teklif-al` | Teklif alma formu |
| `/kariyer` | Kariyer |
| `/sss` | Sık sorulan sorular |
| `/ekip` | Ekip |
| `/portfolio` | Portfolyo |
| `/partnerler` | Partnerler listesi |
| `/partnerler/:id` | Partner detayı |
| `/basari-hikayeleri` | Başarı hikayeleri (vaka çalışmaları) |
| `/referanslar` | Referanslar |
| `/blog` | Blog listesi |
| `/blog/:slug` | Blog yazı detayı |
| `/kade-kit-business` | Kade Kit Business |
| `/:handle` | Link-in-bio profil (örn. `/@kullanici`) |
| `/s/:slug` | Kısa link çözücü |
| `/kadirdemir` | Özel link profili |

## 2) Kök site — Kimlik & korumalı rotalar

| Yol | Açıklama |
|---|---|
| `/giris` | Giriş hub'ı |
| `/giris/danismanlik` | Danışmanlık/müşteri girişi |
| `/admin` | Admin paneli (oturum korumalı) |
| `/musteri-panel` | Müşteri paneli |
| `/proje-takip` | Proje takip (müşteri korumalı) |
| `/organizasyon-kiti` | Organizasyon Kiti (guard'lı) |
| `/organizasyon-kiti/plan/fractional-new-media-director` | Plan sayfası |

## 3) Kök site — Hukuki & hata/durum sayfaları

| Yol | Açıklama |
|---|---|
| `/kvkk` | KVKK aydınlatma metni |
| `/gizlilik` | Gizlilik politikası |
| `/cerez-politikasi` | Çerez politikası |
| `/telif-haklari` | Telif hakları |
| `/tesekkur` | Teşekkür / dönüşüm sayfası |
| `/401` | Yetkisiz |
| `/403` | Erişim engellendi |
| `/429` | Çok fazla istek |
| `/bakim` | Bakım sayfası |
| `*` | 404 (bilinmeyen tüm rotalar) |

## 4) Kök site — Yönlendirme & statik

| Yol | Hedef / not |
|---|---|
| `/links` | → `kadirardademir.com/links` (301) |
| `/kadelinks` | → `kadirardademir.com/links` (301) |
| `/kadelinks/:path*` | → `kadirardademir.com/links` (301) |
| `/robots.txt` | Statik |
| `/sitemap.xml` | → `/api/sitemap` (dinamik üretim) |
| `/hero.html` | İzole WebGL hero (anasayfa iframe kaynağı) |

## 5) Kök site — API uçları (`/api/*`)

| Yol | İşlev |
|---|---|
| `/api/auth` | Admin girişi / oturum / CSRF / şifre değiştirme |
| `/api/customer-auth` | Müşteri kayıt / giriş / oturum |
| `/api/customer-portal` | Müşteri paneli verisi |
| `/api/customers` | Müşteri yönetimi (admin) |
| `/api/users` | Kullanıcı yönetimi (admin) |
| `/api/shopier` | Ödeme webhook + sipariş listesi + iade |
| `/api/coupons` | Kupon/kampanya CRUD |
| `/api/system-health` | Sistem sağlığı |
| `/api/blog` | Blog CRUD + public liste |
| `/api/partners` | Partner CRUD + public liste |
| `/api/content` | Site içeriği / CMS |
| `/api/media` | Medya kütüphanesi |
| `/api/linkprofiles` | Link profilleri |
| `/api/shortlinks` | Kısa linkler |
| `/api/crm` | CRM |
| `/api/proposals` | Teklifler |
| `/api/subscriptions` | Abonelikler |
| `/api/surveys` | Anketler |
| `/api/referrals` | Referanslar |
| `/api/reminders` | Hatırlatıcılar (cron: günlük 06:00) |
| `/api/tasks` | Görevler |
| `/api/client` | Müşteri kaynakları (subscriptions/surveys) |
| `/api/ops` | Teklif talebi / fatura / onboarding / e-posta şablonu / ayarlar |
| `/api/messages` | Mesajlar |
| `/api/contact` | İletişim formu |
| `/api/newsletter` | Newsletter (contact → action) |
| `/api/notifications` | Bildirimler + aktivite logu |
| `/api/calendar-invite` | Takvim daveti (ICS) |
| `/api/chat` | AI sohbet / içerik üretimi (Gemini) |
| `/api/sitemap` | Dinamik sitemap üretimi |
| `/api/seed` | İlk admin oluşturma (prod'da varsayılan kapalı) |

---

## 6) Kade AI — Sayfalar (`kadenewmedia.com/kadeai/*`)

| Yol | Açıklama |
|---|---|
| `/kadeai` | Ana sayfa |
| `/kadeai/login` · `/kadeai/logout` · `/kadeai/auth` · `/kadeai/auth/callback` | Kimlik |
| `/kadeai/onboarding` | Onboarding |
| `/kadeai/reset-password` | Şifre sıfırlama |
| `/kadeai/dashboard` | Panel ana sayfası |

**Dashboard araçları** (`/kadeai/dashboard/*`):
`ab-test` · `ai-thumbnail` · `analytics` · `bio-link` · `bulk` · `calendar` · `carousel` · `clickbait-detector` · `clip-generator` · `collab-mail` · `comment-analysis` · `competitor` · `content-plan` · `description` · `dubbing` · `faq` · `hashtag` · `history` · `hook` · `ideas` · `operations` · `packages` · `performance` · `quote-extractor` · `retention-analysis` · `settings` · `shopier` · `social-audit` · `templates` · `text-generator` · `thread` · `title` · `trends` · `video-factory` · `viral-score` · `youtube-seo`

## 7) Kade AI — API uçları (`/kadeai/api/*`)

| Grup | Yollar |
|---|---|
| Kimlik | `/kadeai/api/auth/{logout, password, recovery, recovery-session, update-password}` |
| Üretim (AI) | `/kadeai/api/generate/{analytics, bio-link, bulk, carousel, clickbait-detector, clips, collab-mail, comment-analysis, competitor, content-plan, description, faq, hashtag, hook, ideas, performance, quote-extractor, retention-analysis, social-audit, text-generator, thread, title, translate, trends, tts, viral-score, youtube-seo}` |
| Ödeme | `/kadeai/api/payments/{checkout, status, webhook}` · `/payments/shopier/redirect` · `/payments/admin/{custom-offer, pricing}` |
| Medya | `/kadeai/api/{image, video, transcribe}` |
| Diğer | `/kadeai/api/{assistant, calendar, config, env-status, health, history, operations-state, packages, profile, templates}` · `/backend/health` · `/youtube/comments` |

---

## 8) Kade Studio (`apps/studio-web` — ayrı ürün, ayrı domain)

**Sayfalar:** `/` · `/login` · `/projects/new` · `/editor/[projectId]`

**API:** `/api/auth/login` · `/api/health` · `/api/projects` · `/api/projects/[projectId]` · `/api/projects/[projectId]/{commands, exports, history, versions}` · `/api/exports/[exportId]/download` · `/api/uploads/{complete, presign}`
