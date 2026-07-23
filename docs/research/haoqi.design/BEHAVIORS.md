# haoqi.design — Davranış Bibliyografyası (Faz 1 keşfi)

Playwright ile çıkarıldı (2026-07-23). Etkileşim modeli her bölüm için not edildi.

## Global

- **Font:** `tiktok, sans-serif` (TikTokSans) — Kade zaten kullanıyor (`kade-yeni.css`).
- **Ölçüm:** body 16px / 24px satır; editoryal paragraf **60.48px / 60.48px** (leading 1.0, weight 400).
- **Nav:** 16px, weight 700, uppercase, monospace hissi.
- **Renkler (canlı, açık tema):** metin `rgb(0,0,0)`, muted `rgba(54,54,48,0.6)`, zemin **`rgb(251,250,244)` (krem #fbfaf4)**, siyah ara-bölüm `rgb(0,0,0)`, lime aksan (glitch).
- **Link kalıbı:** `text-decoration: underline rgba(54,54,48,0.32)`, `text-underline-offset: 4.84px` — ince, editoryal altı-çizgi.
- **KRİTİK BULGU:** haoqi'nin varsayılan teması **açık/krem** (gök-mavisi hero arkaplanı + krem gövde), Kade'nin sandığı gibi "koyu" değil. "Koyu" izlenimi lacivert WebGL hero + tek siyah ara-bölümden geliyor. Kade'nin krem/altın paleti haoqi'ninkiyle neredeyse aynı — fark palette değil **editoryal muamele**.

## Etkileşimler

| Davranış | Model | Mekanizma / not |
|---|---|---|
| "hello" hero | WebGL/canvas, time-driven | 2 canvas, sürekli 3D animasyon; scroll'la hafif tepki. **DOM-çıkarımı uygulanamaz** (shader/geometri). |
| Tema toggle | click | `THEME[D]→[A]→[L]` döngüsü (Dark/Auto/Light). |
| SOUND toggle | click | Ses aç/kapat. |
| WORK / CONTACT | sayfa-içi anchor | Ayrı route değil; smooth scroll. |
| Inline iş linkleri | hover | Altı-çizgi rengi koyulaşır. |
| Editoryal başlık glitch | time-driven | Lime aksanlı karakterler periyodik değişiyor (glitch efekti). |
| Grid-cross `+` işaretleri | statik | Dekoratif, grid kesişimlerinde. |
| Monospace koordinat etiketleri | time-driven (saat) | `GMT+8 CN 16:52 31°C` canlı saat. |

## Kade editoryal dile taşınırken korunacak kalıplar

1. **Monospace eyebrow etiketleri** (`— NE YAPIYORUZ`) — Kade'de `--ky-mono` (GeistMono) ile.
2. **Dev editoryal tipografi** — clamp ile 2.6rem→7.5rem, leading ~1.0, letter-spacing negatif.
3. **İnce altı-çizili inline linkler** — kart yerine editoryal liste.
4. **Grid-cross / koordinat estetiği** — teknik, minimal his.
5. **Renk:** haoqi'nin lime aksanı yerine Kade altını (`--ky-gold #e0a81f`); zemin ortak krem.
