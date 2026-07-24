# Codex'e ver — canlı tarayıcı GEREKTİRMEYEN görevler

Bu dosyayı, interaktif tarayıcı/DevTools erişimi olmayan Codex CLI
oturumuna ver. İçindekiler kod okuma, dosya düzenleme, `npm run build`/
lint/typecheck/unit test çalıştırma ve (istersen) Playwright'ı headless
script olarak kurup çalıştırmakla çözülür — canlı, interaktif bir
tarayıcı oturumu şart değil. Render-gecikmesi bug'ı (görsel/zamanlama
profili gerektiriyor) bu dosyada YOK — o ayrı dosyada, Claude Code'a
gidecek.

Repo kökü: `kademedia/`.

## 1) Ana görev — mevcut büyük master prompt

Repo kökündeki `CLAUDE_CODE_KADE_MASTER_PROMPT_TR.md` dosyasını oku ve
uygula. Bu, Kade New Media + Kade AI ekosistemini üretime hazır hâle
getiren kapsamlı bir mühendislik planı (paket/fiyat/ödeme sistemi, admin
panel modülleri, hukuki sayfalar, güvenlik denetimi, SEO/redirect, mobil/
erişilebilirlik, vb. — 25 bölüm). Dosyanın kendi "0. Görevin niteliği" ve
"1. Bağlayıcı çalışma kuralları" bölümlerindeki talimatları (Türkçe
raporlama, blocker kaydı, güvenli çalışma kuralları, kalite kapıları)
aynen uygula. Bu dosya adında "Claude Code" geçiyor ama içerik araç-
agnostik — dosya adına takılma, doğrudan uygula.

**Not:** Bu master prompt'un bir kısmı (Ö0-Ö9 öncelikli maddeler) önceki
oturumlarda kısmen uygulanmış olabilir — `git log --oneline` ile son
commit'leri incele (özellikle `ab81449`, `edde1e1`, `5516bc4` ve sonrası),
zaten yapılmış işi tekrar etme, kaldığı yerden devam et.

## 2) Ek görev — Kade AI login (Ö0) statik taraf

`apps/kadeai/` altında Supabase auth konfigürasyonunu (`.env`,
`.env.example`, `lib/supabase*` dosyaları) incele:
- `NEXT_PUBLIC_SUPABASE_URL` ve ilgili anahtarların doğru/tutarlı
  tanımlandığını kontrol et.
- `apps/kadeai/app/api/auth/password/route.ts` (veya güncel karşılığı)
  içindeki 401 dönüş mantığını oku, hangi koşulda 401 döndüğünü net
  şekilde belgeleyip kod tarafında yapılabilecek bir iyileştirme varsa
  yap (örn. daha açıklayıcı hata mesajı, yanlış env fallback'i).
- **Gerçek hesap/Supabase-proje eşleşmesi kod tarafından doğrulanamaz** —
  bunu kullanıcının Supabase Dashboard'dan kontrol etmesi gerektiğini
  raporunda açıkça belirt, kod değişikliği bunu çözmüyorsa "blocker"
  olarak kaydet.

## 3) Ek görev — feat/site-dark-editorial branch durumu

`git log main..feat/site-dark-editorial --oneline` ile bu branch'in
main'e göre farkını incele (16 sayfalık editoryal tasarım dönüşümü içeriyor,
push edilmiş ama merge edilmemiş). Şunu yap:
- `npm run build` (veya `npm run legacy:build`) bu branch üzerinde
  gerçekten temiz geçiyor mu doğrula (önceki oturumda bu sandboxta
  node_modules eksik olduğu için hiç çalıştırılamamıştı — bunu ilk kez
  gerçek bir build ile doğrulamak değerli).
- Build geçerse ve konflik yoksa, kullanıcıya merge için hazır olduğunu
  raporla (merge işlemini kullanıcı onayı olmadan yapma).
- `docs/research/haoqi.design/DESIGN_LANGUAGE_AND_STATUS.md` dosyasında
  belirtilen "kalan sayfalar" listesini (ServiceDetail, PartnerDetail,
  BlogDetail, CaseStudies, NewMediaAgency, LinkProfile, Tesekkur ve gated
  alanlar) aynı editoryal desenle devam ettirebilirsin — dosyadaki
  "Desen (referans)" bölümünü ve "bilinçli dokunulmayan yerler" listesini
  takip et.

## Doğrulama

Her görev için: `npm run build`, mevcut varsa `npm run lint`/`typecheck`/
test komutlarını çalıştır, sonucu (geçti/geçmedi + hata özeti) raporunda
belirt. Canlı görsel doğrulama gerektiren hiçbir iddiada bulunma
("görsel olarak düzgün görünüyor" deme) — bu, ayrı Claude Code görevinin
kapsamında.
