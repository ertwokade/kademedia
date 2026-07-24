# Kade AI Supabase Auth Statik Denetimi

Tarih: 24 Temmuz 2026  
Kapsam: `apps/kadeai` parola ile giriş/kayıt akışı ve Supabase public yapılandırması.

## Ortam değişkenleri

Kade AI aynı iki public değeri istemci, Route Handler, proxy ve server-side
Supabase istemcisinde kullanır:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase projesinin HTTP(S) API origin'i.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon/publishable anahtarı.
- `SUPABASE_SERVICE_ROLE_KEY`: Yalnızca sunucudaki admin/ödeme işleri için
  kullanılan yüksek yetkili anahtar. Public anahtarın alternatifi değildir ve
  tarayıcı paketine konulmamalıdır.

`apps/kadeai/.env.example` bu adları tutarlı biçimde belgeliyor. Çalışma
dizininde gerçek `apps/kadeai/.env` bulunmadığı için değerlerin hangi projeye
ait olduğu statik olarak doğrulanamadı. Örnek dosyadaki
`YOUR_PROJECT`/`YOUR_SUPABASE_ANON_KEY` değerleri artık geçerli yapılandırma
sayılmıyor.

`lib/supabase/publicConfig.ts` aşağıdaki kontrolleri tek yerde uygular:

1. URL ve public anahtar boş olamaz.
2. Örnek/placeholder değerler reddedilir.
3. URL mutlak bir HTTP(S) adresi olmalıdır.
4. URL yalnızca origin biçimine normalize edilir.

Bu doğrulayıcı browser client, server client, admin client, auth proxy,
login/recovery/callback ve health/config kontrollerinde kullanılır.

## Parola endpoint'inin durum kodları

Endpoint: `POST /kadeai/api/auth/password`

| Durum | Koşul |
|---|---|
| `400` | JSON, e-posta veya parola biçimi geçersiz; kayıt isteği Supabase tarafından iş kuralı nedeniyle reddedildi |
| `401` | Geçerli biçimdeki login isteğinde Supabase `invalid_credentials` benzeri bir kimlik reddi döndürdü veya e-posta doğrulanmadı |
| `429` | Yerel 5/10 dakika limiti ya da Supabase auth rate limit'i aşıldı |
| `503` | Supabase public yapılandırması eksik/geçersiz, istemci oluşturulamadı veya sağlayıcı geçici 5xx/timeout hatası verdi |

401 yanıtı hesap yok/yanlış parola ayrımını açıklamaz; bu ayrımı yapmak hesap
enumeration riski doğurur. `email_not_confirmed` kullanıcıya güvenli ve ayrı
bir yönlendirme olarak gösterilir. Sağlayıcı hata mesajı kullanıcı yanıtına
ve loga aynen yazılmaz; sunucu logunda yalnızca hata kodu ve HTTP durumu
tutulur.

## Statik olarak doğrulanamayan eşleşme

Kod, girilen gerçek hesabın Vercel'deki URL/anahtarın ait olduğu Supabase
projesinde bulunup bulunmadığını kanıtlayamaz. Kullanıcı şu kontrolü Supabase
Dashboard'dan yapmalıdır:

1. Project Settings → API bölümündeki Project URL ile
   `NEXT_PUBLIC_SUPABASE_URL` değerini karşılaştırın.
2. Aynı projedeki publishable/anon anahtar ile
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` değerini karşılaştırın.
3. Authentication → Users ekranında giriş yapılacak e-postanın bulunduğunu ve
   gerekiyorsa e-postasının doğrulandığını kontrol edin.
4. Authentication → URL Configuration içinde production Site URL ve callback
   adresinin `https://kadenewmedia.com/kadeai/auth/callback` ile uyumlu olduğunu
   kontrol edin.
5. Vercel env değişikliklerinden sonra yeni production build/deploy oluşturun;
   `NEXT_PUBLIC_*` değerleri build sırasında tarayıcı paketine gömülür.

Bu eşleşme doğrulanana kadar gerçek hesapla login başarısı dış sistem
blocker'ıdır.

## Test kanıtı

- `npm.cmd --prefix apps/kadeai run test:unit`: 26/26 geçti.
- `npm.cmd --prefix apps/kadeai run typecheck`: geçti.
- `npm.cmd --prefix apps/kadeai run lint`: geçti.
- `npm.cmd --prefix apps/kadeai run build`: Next.js 16.2.11 ile 41 statik
  sayfa üretimi dahil geçti.
- `npm.cmd --prefix apps/kadeai run test:bundle-secrets`: 3 sentetik canary ve
  3 yapılandırılmış secret için geçti.
- `npm.cmd --prefix apps/kadeai audit --omit=dev --audit-level=high`: 0
  güvenlik bulgusu.
- Unit testler eksik değer, placeholder, hatalı URL, geçerli origin
  normalizasyonu ve login `401/429/503` ayrımını kapsar.
