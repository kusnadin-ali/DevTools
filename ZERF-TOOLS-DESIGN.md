# Zerf Tools — Rancangan Desain

> Developer utilities hub, terinspirasi dari alfath.tech, dengan identitas visual sendiri: **Retro-Vintage x Card-Based**.

---

## 1. Konsep & Positioning

**Nama:** Zerf Tools
**Tagline (draft):** "Klasik di tampilan, modern di dalam." / "Old-school look, new-school tools."
**Deskripsi singkat:** Kumpulan utilitas developer (formatter, converter, encoder, dll) yang berjalan sepenuhnya di browser — cepat, privat, gratis — dibungkus dalam nuansa visual retro-vintage dengan layout card-based yang bersih.

**Diferensiasi dari alfath.tech:**
- alfath.tech = minimalis modern, flat, netral.
- Zerf Tools = hangat, bertekstur, ada karakter "vintage" (garis ganda, stempel/badge, kertas tua, tipografi tebal) tapi tetap terasa modern lewat card grid yang rapi.

---

## 2. Design Philosophy: Retro-Vintage x Card-Based

Prinsip yang dipegang supaya dua gaya ini nyatu, bukan tabrakan:

- **Vintage lewat detail, bukan lewat clutter.** Card tetap grid modern (shadow lembut, radius konsisten), tapi border ganda tipis, sudut sedikit "paper-cut", dan aksen stempel/badge memberi rasa retro.
- **Warna hangat, bukan neon.** Base palette cenderung cream/kertas tua + coklat tua, dengan FF5722 sebagai satu-satunya warna kontras yang "berteriak" (dipakai sangat selektif: CTA, ikon aktif, highlight).
- **Tekstur halus.** Grain/noise tipis atau subtle halftone pattern di background hero — opsional, jangan sampai mengganggu keterbacaan.
- **Tipografi berkarakter.** Heading pakai slab-serif/serif tebal (kesan mesin tik/poster retro), body & UI tetap sans-serif supaya tetap mudah dibaca. Kode/monospace untuk elemen teknis (contoh: nama tool, snippet).
- **Micro-interactions old-school:** transisi hover seperti "tombol ditekan" (translate + shadow mengecil), bukan efek glassmorphism/blur modern.

---

## 3. Color Palette

Warna kontras utama: **`#FF5722`** (Deep Orange — dipakai sebagai *accent/CTA color*, bukan warna dominan).

| Role | Warna | Hex | Catatan |
|---|---|---|---|
| Primary Accent (contrast) | Burnt Orange | `#FF5722` | CTA button, active state, badge, link hover |
| Accent Dark (hover/pressed) | Deep Rust | `#C43E1C` | State hover/active dari accent |
| Background utama | Vintage Cream | `#F4E9D8` | Pengganti putih polos, kesan kertas tua |
| Background card | Paper White | `#FBF4E8` | Sedikit lebih terang dari background |
| Text utama | Espresso | `#3B2A22` | Ganti hitam pekat, lebih hangat |
| Text sekunder | Coklat Pudar | `#7A6252` | Deskripsi, caption |
| Secondary accent | Mustard | `#D9A441` | Ikon sekunder, garis dekoratif |
| Tertiary accent | Petrol Teal | `#256D6B` | Kontras dingin penyeimbang orange, dipakai minim |
| Border / garis | Coklat Tua | `#C9B79C` | Border ganda vintage, divider |
| Success | Olive Green | `#6B7A3A` | Status sukses (tetap dalam nuansa retro) |
| Error | Brick Red | `#9C3B2C` | Status error |

**Dark mode (opsional, tetap "vintage"):**

| Role | Hex |
|---|---|
| Background | `#241A15` |
| Card | `#2E2119` |
| Text utama | `#F0E4D3` |
| Accent | `#FF5722` (tetap sama, tetap menonjol di background gelap) |

> Aturan pemakaian: FF5722 maksimal ±10% dari luas layar (tombol, badge, ikon aktif, underline judul). Selebihnya didominasi cream/coklat supaya kesan vintage tidak "kalah" oleh warna terang.

---

## 4. Typography

| Elemen | Font (rekomendasi) | Karakter |
|---|---|---|
| Heading / Logo | `Fraunces`, `Playfair Display`, atau `Bitter` (slab-serif retro) | Tebal, sedikit kondensasi, kesan poster jadul |
| Body text | `Inter` atau `Work Sans` | Netral, mudah dibaca, kontras dengan heading |
| Kode / nama tool / label teknis | `JetBrains Mono` atau `IBM Plex Mono` | Kesan "terminal", cocok utilitas dev |

**Skala tipografi (contoh):**
- H1 (Hero title): 48–56px, bold, letter-spacing sedikit rapat
- H2 (Section title): 32px
- H3 (Card title): 20px, semi-bold
- Body: 16px
- Caption/meta: 13px

---

## 5. Struktur Halaman (Homepage)

```
┌─────────────────────────────────────────────┐
│  HEADER                                      │
│  [Logo: Zerf Tools]   Nav (Tools, About)     │
│                        [Theme] [Lang] toggle │
├─────────────────────────────────────────────┤
│  HERO SECTION                                │
│  - Badge kecil bergaya "stempel": "v1.0"     │
│  - H1: Value proposition                     │
│  - Subteks singkat                           │
│  - CTA button (warna FF5722)                 │
│  - Elemen dekoratif retro (garis, pola)      │
├─────────────────────────────────────────────┤
│  TOOLS GRID ("Available Tools")              │
│  ┌────────┐ ┌────────┐ ┌────────┐            │
│  │ Card 1 │ │ Card 2 │ │ Card 3 │  ...       │
│  └────────┘ └────────┘ └────────┘            │
├─────────────────────────────────────────────┤
│  FEATURE CALLOUTS (3 kolom)                  │
│  Fast | Private | Open Source                │
├─────────────────────────────────────────────┤
│  FOOTER                                      │
│  Logo mini · Sitemap · Copyright · Sosial    │
└─────────────────────────────────────────────┘
```

---

## 6. Komponen UI

### Tool Card
- Background: `Paper White (#FBF4E8)`
- Border: 1.5px solid `#C9B79C` + inner border tipis (efek "double border" khas kartu vintage)
- Radius: 10–12px (cukup lembut, tidak terlalu tajam / tidak terlalu bulat)
- Shadow: soft drop shadow warm-tone (`rgba(59,42,34,0.15)`), bukan shadow abu-abu netral
- Header card: ikon tool dalam kotak kecil bersudut, warna ikon mustard/teal bergantian, hover jadi `#FF5722`
- Isi: nama tool (slab-serif), deskripsi singkat (sans-serif), tag kategori kecil (mono, uppercase, letter-spacing lebar — gaya label kaleng vintage)
- CTA: tombol "Buka Tool →" dengan underline animasi atau border tebal `#FF5722` yang solid saat hover
- Hover effect: card naik sedikit (`translateY(-4px)`) + shadow membesar, transisi cepat (150–200ms) — bukan efek blur/glass

### Badge / Stempel
- Elemen dekoratif seperti "stempel pos" untuk menandai tool baru (`NEW`), populer (`POPULAR`), atau versi beta
- Bentuk: lingkaran atau segi delapan bergerigi (badge klasik), border putus-putus (dashed), rotasi ringan (-6° hingga 6°)
- Warna: outline `#FF5722` di atas background cream

### Button
- Primary: background `#FF5722`, teks cream, radius kecil (6–8px), shadow bawah tebal 2–3px warna `#C43E1C` (efek retro "3D press")
- Saat diklik: shadow hilang + tombol turun 2px (simulasi tombol fisik ditekan)
- Secondary: outline coklat tua, transparan, hover isi mustard tipis

### Navigasi Header
- Background cream sedikit beda dari body (atau border-bottom tebal 2px coklat)
- Logo: wordmark "Zerf Tools" dengan aksen bentuk kecil (mis. persegi miring warna FF5722 di belakang huruf Z)
- Toggle tema: ikon matahari/bulan versi line-art retro

### Tekstur Background
- Opsional: subtle grain/noise overlay (opacity 3–5%) di seluruh halaman untuk kesan "kertas lama"
- Hero section bisa punya pola halftone dots tipis warna mustard/teal di sudut sebagai dekorasi

---

## 7. Daftar Tools (v1 — mengikuti kategori alfath.tech, bisa dikembangkan)

1. JSON Formatter — validasi, format, minify
2. JSON Diff — perbandingan dua JSON berdampingan
3. Base64 Encoder/Decoder
4. Image Converter — PNG, JPG, WebP
5. URL Encoder/Decoder
6. Timestamp Converter
7. Code Playground/Compiler — multi-bahasa (opsional untuk v1, berat di infra)

**Ide tambahan khas Zerf Tools (opsional, differentiator):**
8. Color Palette Extractor (dari gambar)
9. Regex Tester
10. Markdown Previewer

---

## 8. Feature Callouts (3 kolom di bawah tools grid)

| Ikon | Judul | Deskripsi singkat |
|---|---|---|
| ⚡ | Fast | Semua proses jalan di browser, tanpa upload ke server |
| 🔒 | Private | Data kamu tidak pernah keluar dari perangkat |
| 📖 | Open Source | Kode terbuka, transparan, bisa dikontribusi |

*(Ikon final sebaiknya versi line-art custom, bukan emoji, supaya konsisten dengan gaya retro.)*

---

## 9. Responsive Behavior

- **Desktop (≥1024px):** grid tools 3 kolom
- **Tablet (768–1023px):** grid 2 kolom
- **Mobile (<768px):** 1 kolom, nav header jadi hamburger dengan slide-down bergaya "kertas terbuka"

---

## 10. Rekomendasi Tech Stack (ringan, tidak mengikat)

- Frontend: React / Next.js atau Vue — bebas, disesuaikan preferensi
- Styling: Tailwind CSS (custom theme dengan palette di atas) atau CSS Modules
- Font loading: self-host / Google Fonts (`Fraunces` + `Inter` + `JetBrains Mono`)
- Icon: custom SVG line-art set (hindari icon set generic modern seperti Material Icons agar konsisten dengan tema retro)
- Semua tool logic client-side (tanpa backend) — konsisten dengan positioning "privat & cepat"

---

## 11. Langkah Selanjutnya

- [ ] Finalisasi logo/wordmark "Zerf Tools"
- [ ] Buat moodboard visual (referensi vintage poster, kartu pos, label kaleng jadul)
- [ ] Desain 1 tool card + hero section di Figma sebagai acuan sebelum coding
- [ ] Setup project (pilih framework) + Tailwind theme config dengan palette di atas
- [ ] Implementasi 2–3 tools pertama (JSON Formatter, Base64, URL Encoder) sebagai MVP
