# Claude Code'a ver — bu görev CANLI TARAYICI erişimi gerektirir

Bu dosyayı, Chrome DevTools/Playwright MCP'si bağlı olan Claude Code
oturumuna ver. İçindeki tek görev **görsel/zamanlama doğrulaması**
gerektiriyor — sadece kod okuyarak çözülemez, gerçek bir tarayıcıda
Performance profili çıkarmak şart. Codex'e verme (bkz. ayrı dosya).

Repo kökü: `kademedia/`.

## Görev — render-gecikmesi bug'ını profille ve düzelt

**Semptom (canlı `kadenewmedia.com`'da tekrar tekrar doğrulandı):**
Aşağıdaki rotalara gidildiğinde sayfa **yalnızca navbar** gösterir,
gövde (başlık/açıklama/butonlar) 3 saniyede hâlâ görünmüyor, ~8 saniyede
tam render oluyor:

- `*` → `src/pages/NotFound.jsx` (404) — `<LazyRoute>` ile sarılı DEĞİL.
- `/401`, `/403`, `/429`, `/bakim` → `src/components/ErrorStatePage.jsx`
  üzerinden (`Unauthorized.jsx`, `Forbidden.jsx`, `TooManyRequests.jsx`,
  `Maintenance.jsx`) — `<LazyRoute>` ile sarılı (`src/App.jsx` ~261-264).
- `/:handle` → `src/pages/LinkProfile.jsx` (örn. `/@kadirdemir`).

`getComputedStyle` ile ölçüldüğünde nihai durum doğru (`opacity:1`,
`filter:none`) — yani hedef CSS doğru, sadece oraya ulaşmak **anormal
uzun sürüyor**. `src/components/PageTransition.jsx` satır 15'te
`duration: 0.32` yazıyor; gerçekte 3sn+'de hâlâ boş.

**Bilinen geçmiş:** `PageTransition.jsx` satır 3-7'deki kod yorumu, daha
önce "canlıda 2-4 sn'lik asılı blur" sorunu olduğunu ve blur/süre
azaltılarak "çözüldüğünü" iddia ediyor — bu tur bunun **tam çözülmediğini**
gösteriyor.

### Adımlar

1. Yerel `npm run dev` başlat. Chrome DevTools Performance panelini aç,
   kayda başla, `/`'ye git (WebGL "hello" hero'nun yüklendiği anasayfa),
   sonra `/bakim`'e geç, kaydı durdur. Ana iş parçacığında (Script/Layout/
   Paint/Idle) nerede takıldığını bul.
2. Aynı testi `/`'ye hiç uğramadan (temiz sekme, direkt `/bakim`'e git)
   tekrarla — eğer bu sefer hızlıysa, kök neden anasayfadaki WebGL
   context'in (`public/hero.html` veya `site.html`, Three.js canvas)
   düzgün temizlenmemesi/GPU kaynağını tutmaya devam etmesidir.
3. `src/App.jsx`'teki route/sayfa geçiş sarmalayıcısında (`AnimatePresence`
   varsa `mode` ayarını) kontrol et — geçişlerin üst üste binip
   bloklanmasına yol açıyor olabilir.
4. Kök nedeni bulduğunda düzelt (muhtemel: WebGL canvas/context'i route
   değişiminde `dispose()` ile temizlemek, veya `AnimatePresence
   mode="wait"` eklemek, veya `PageTransition`'ın blur'unu tamamen
   kaldırmak).
5. **Doğrulama (tarayıcıda, gerçek zamanlı):** `/`'den `/bakim`, `/401`,
   `/403`, `/429`, rastgele bir 404 URL'i ve `/@kadirdemir`'e sırayla git;
   her birinin **1 saniye içinde** tam render olduğunu göz/DevTools ile
   doğrula. Öncesi/sonrası saniye ölçümünü raporda yaz.

### Rapor formatı

```
Kök neden: ...
Değişen dosya(lar): ...
Öncesi (sn) / Sonrası (sn): 404=.../..., 401=.../..., bakım=.../..., @handle=.../...
Kalan risk: ...
```
