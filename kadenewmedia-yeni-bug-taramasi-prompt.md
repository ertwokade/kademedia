# Kade New Media — Yeni Bug Taraması (2. Tur) — Claude Code / Codex Ortak Prompt

Bu dosya hem Claude Code hem OpenAI Codex CLI'da çalışacak şekilde yazıldı:
özel bir tool/MCP/slash-command söz dizimi kullanmaz, yalnızca dosya yolu +
komut + doğrulama adımlarından oluşur. Repo kökünde (`kademedia/`) çalıştır.

## Bağlam — önce oku

- Bu, `kadenewmedia.com`'un **ikinci** bug taraması. Birinci turun kapsamlı
  bulguları ve kök-neden analizleri `CLAUDE_CODE_KADE_MASTER_PROMPT_TR.md`
  dosyasında (repo kökünde) duruyor — Ö0-Ö9 arası öncelikli maddeler orada.
  Bu dosyayı çalıştırmadan önce o dosyayı da oku; bu tur onun **eki**dir,
  yerine geçmez.
- `feat/site-dark-editorial` branch'i (haoqi.design editoryal tasarım dilinin
  16 sayfaya yayılması) `origin`'e push edildi ama **main'e merge edilmedi**.
  Yani şu an canlıda `/hizmetler`, `/hakkimizda`, `/paketler` vb. sayfalar
  **eski kart-tabanlı tasarımda** — bu bir bug değil, sadece hangi tasarımın
  "güncel" sayıldığını karıştırmamak için not.
- Ö0 (Kade AI girişi, `/kadeai/login` sonrası 401) bu turda **tekrar canlı
  test edilmedi** (kimlik bilgisi gerektiriyor, bu oturumda kullanıcı
  girmedi). Hâlâ açık kabul et, Supabase proje/hesap eşleşmesini
  `apps/kadeai/.env` ve Supabase Dashboard üzerinden kontrol ederek başla.

## YENİ BULGU — Öncelik 1: Lazy/az-ziyaret edilen sayfalarda çok saniyeli boş ekran

**Semptom (canlıda tekrar tekrar doğrulandı):** Aşağıdaki rotalara
gidildiğinde sayfa **yalnızca navbar** gösterir, gövde içeriği (başlık,
açıklama, butonlar) **3 saniyede hâlâ görünmüyor**, ancak **~8 saniyede**
tam olarak render oluyor:

- `*` (bilinmeyen route → `src/pages/NotFound.jsx`, 404) — `App.jsx`'te
  `<LazyRoute>` ile SARILMAMIŞ, yani lazy-chunk gecikmesi değil.
- `/401`, `/403`, `/429`, `/bakim` (`src/components/ErrorStatePage.jsx`
  üzerinden — `Unauthorized.jsx`, `Forbidden.jsx`, `TooManyRequests.jsx`,
  `Maintenance.jsx`) — bunlar `<LazyRoute>` ile sarılı (`src/App.jsx`
  satır ~261-264).
- `/:handle` (`src/pages/LinkProfile.jsx`, örn. `/@kadirdemir`) — aynı
  semptom.

**Neden bug:** `src/components/PageTransition.jsx`'in geçiş süresi kodda
`duration: 0.32` olarak tanımlı (satır 15) — yani içerik en geç ~0.3-0.5
saniyede görünür olmalı. Gerçekte 3 saniyede hâlâ boş, ~8 saniyede tam
render oluyor: **kodlanan süre ile gerçek davranış arasında 15-20x fark
var.** `getComputedStyle` ile ölçüldüğünde nihai durumda `opacity:1`,
`filter:none`, `visibility:visible` doğru — yani CSS/animasyon hedefi
doğru ama **oraya ulaşmak anormal uzun sürüyor**. Bu, kalıcı bir CSS
hatası değil, bir **performans/gecikme** hatası.

**Bilinen ilişkili geçmiş:** `PageTransition.jsx` satır 3-7'deki yorum,
daha önce "canlıda 2-4 sn'lik asılı blur" sorunu olduğunu ve blur
miktarının 10px→3px, süresinin 0.55→0.32'ye düşürülerek "çözüldüğünü"
söylüyor. Bu tur bunun **tam çözülmediğini**, hâlâ (daha da uzun,
gözlemlenen ~3-8sn) bir gecikme olduğunu gösteriyor.

**Araştırma/olası kök nedenler (doğrulanmadı, sırayla dene):**
1. Ana sayfa (`/`) `public/hero.html` (veya eski `site.html`) içinde bir
   Three.js/WebGL canvas çalıştırıyor (`THREE.WebGLRenderer`). Bu
   sekmeden başka bir sayfaya geçildiğinde canvas/context düzgün temizlenmiyor
   olabilir ve GPU/ana iş parçacığı sonraki sayfa geçişlerinde bloklanıyor
   olabilir — Chrome DevTools Performance panelinde `/`'den başka bir
   sayfaya geçişi profilleyerek doğrula (uzun bir "Layout"/"Composite"
   veya "Script" bloğu var mı bak).
2. `LazyRoute`'un `Suspense fallback={<PageLoader />}` bileşeni
   (`src/App.jsx` satır 73-78) — `PageLoader`'ın kendisi gecikmeli
   render oluyor olabilir; `PageLoader` bileşenini incele.
3. `framer-motion`'ın `AnimatePresence` kullanımı (route değişiminde
   eski sayfanın exit animasyonu ile yeni sayfanın enter animasyonu aynı
   anda çakışıyor olabilir) — `App.jsx`'te route'ları saran
   `AnimatePresence` var mı, `mode="wait"` mi yoksa değil mi kontrol et;
   yanlış mod ayarı geçişlerin üst üste binip ana iş parçacığını
   tıkamasına yol açabilir.
4. Bu 5 sayfa (`NotFound`, `Unauthorized`, `Forbidden`, `TooManyRequests`,
   `Maintenance`) hepsi ortak `ErrorStatePage.jsx`'i kullanıyor — ortak
   bileşende olası bir senkron/ağır hesaplama (`useSEO` hook'u, örn.)
   her render'da tekrar çalışıyor olabilir; `useSEO` içeriğini incele.

**Doğrulama adımları:**
1. Yerel `npm run dev` ile `/`, ardından `/bakim`'e git; Chrome DevTools
   Performance kaydı al, gecikmenin nerede olduğunu (Script/Layout/Paint/
   Idle) bul.
2. Kök nedeni düzelt (muhtemelen WebGL context temizliği veya
   AnimatePresence mod ayarı).
3. Düzeltmeden sonra `/bakim`, `/401`, `/403`, `/429`, 404 (rastgele bir
   URL) ve `/@kadirdemir` sayfalarına art arda git; her birinin **1
   saniye içinde** tam render olduğunu doğrula.
4. Ayrıca `/`'den DİREKT bu sayfalara geçişi test et (WebGL hipotezini
   izole etmek için) VE `/hizmetler` gibi WebGL'siz bir sayfadan geçişi
   test et — eğer yalnızca `/`'den sonra yavaşsa, kök neden WebGL
   temizliği demektir.

## Genel tarama notları (bu turda kontrol edilen, bug bulunmayan rotalar)

Aşağıdakiler canlıda kontrol edildi, **görsel/işlevsel bug bulunmadı**
(içerik doğru, sadece yukarıdaki genel render-gecikmesi geçerli):
`/new-media-ajansi`, `/basari-hikayeleri` (kasıtlı olarak boş —
"doğrulanmış vaka çalışması yok" metni doğru davranış), `/kade-kit-business`
(erişim kısıtlı mesajı doğru davranış), `/kadeai` → `/kadeai/login`
yönlendirmesi çalışıyor, anasayfa nav'da artık **tekrar yok** (`İLETİŞİM`
tek kez görünüyor — önceki turda düzeltilen regresyon canlıda doğrulandı,
commit `ab81449` deploy olmuş).

## Kapsam dışı bırakılanlar (bu turda test edilemedi)

- Kade AI dashboard araçları (33+ araç) — giriş yapılamadığı için
  içerik/işlev testi yapılamadı.
- Müşteri paneli, admin paneli, Organizasyon Kiti, proje takip — oturum
  gerektiriyor, bu turda tekrar girilmedi.
- Kade Studio (`apps/studio-web`) — ayrı domain, `kadenewmedia.com`
  üzerinden erişilemiyor, `vercel.json`'da bağlı değil (bkz. master
  prompt'taki ilgili not).
- `/kadeai/dashboard/*` altındaki 33 araç sayfası tek tek gezilmedi.

## Tamamlandığında raporla

- Render-gecikmesi hatasının gerçek kök nedeni (profil sonucu) ve hangi
  dosyada neyin değiştiği.
- Düzeltme sonrası 6 sayfanın (404/401/403/429/bakım/@handle) render
  süresi ölçümü (öncesi/sonrası, saniye cinsinden).
- Ö0 (Kade AI login) için Supabase tarafında bulunan somut bilgi (proje
  URL'i doğru mu, hesap tabloda var mı) — kod değişikliği gerekmiyorsa
  bunu açıkça belirt.
- Bu tur kapsamı dışında bırakılan alanlardan (yukarıdaki liste) herhangi
  birine rastgele göz atıp yeni bir şey bulursan ayrıca not et.
