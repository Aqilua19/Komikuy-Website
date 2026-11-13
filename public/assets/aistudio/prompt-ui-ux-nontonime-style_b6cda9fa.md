# PROMPT: Redesign UI/UX Layout Website Anime + Komik (Gaya "Nontonime")

> Tempel seluruh isi file ini ke AI coding (Google AI Studio / Cursor / dll) bersama source code website kamu.
> Tugas AI: **mengubah tampilan dan layout saja** supaya mirip desain referensi "Nontonime", untuk **dua konten sekaligus: Anime dan Komik**.

---

## 0. ATURAN MUTLAK (BACA DULU, JANGAN DILANGGAR)

Ini adalah **redesign presentasi**, bukan refactor. Logic yang sudah jalan harus tetap 100% utuh.

### DILARANG DIUBAH
- Semua kode **scraping / fetch data**: scraper, parser HTML, fungsi server (`*.server.ts`, `*.functions.ts`, API route, route handler), proxy, header/cookie/user-agent, retry, cache.
- **Query / data layer**: query key, `queryFn`, loader, SSR logic, revalidate, TanStack Query / SWR config.
- **Tipe data & bentuk response** (`types`, interface, mapper/adapter yang sudah ada). Jangan rename field, jangan ubah struktur object.
- **Routing**: nama route, path, param (`animeId`, `episodeId`, `chapterId`, dst), search param (`page`, `q`), redirect.
- **Penyimpanan lokal**: riwayat, watchlist/bookmark, subscribe/notifikasi, tema (localStorage key harus sama persis).
- Service worker, manifest PWA, env variable, middleware, konfigurasi build/deploy.
- Nama prop komponen yang dipakai logic. Kalau komponen lama menerima `anime`, komponen baru tetap menerima `anime`.

### BOLEH DIUBAH
- `className`, struktur markup JSX/HTML **di sekitar** data yang sudah ada.
- File CSS global / design token / font / ikon.
- Komponen presentasi (header, footer, nav, kartu, grid, list row, pagination, skeleton, empty/error state).
- Menambah komponen **murni tampilan** baru (misalnya `SectionTitle`, `Pill`, `Skeleton`, `ContentSwitch`) yang tidak melakukan fetch.
- Urutan blok di dalam halaman, selama data yang ditampilkan tetap sama.

### Kalau ragu
Jika sebuah perubahan menyentuh data, fetch, atau routing: **jangan dikerjakan**, tulis di bagian "Catatan" di akhir jawaban. Jangan menebak.

### Cara kerja yang diharapkan
1. Baca dulu struktur project, catat mana file logic dan mana file tampilan.
2. Kerjakan **file per file**. Untuk tiap file tampilkan kode lengkap yang berubah.
3. Di akhir, beri daftar: (a) file yang diubah, (b) file logic yang **tidak** disentuh, (c) hal yang butuh keputusan saya.
4. Pertahankan stack yang sudah dipakai. Kalau project pakai Tailwind, tulis styling pakai Tailwind. Jangan ganti framework atau library state.

---

## 1. KARAKTER DESAIN

Nama gayanya: **minimalis-lembut**. Bersih, hangat, terasa seperti aplikasi, bukan template.

- Sudut membulat besar, border tipis, bayangan sangat halus.
- Efek kaca (blur) **hanya** di tempat tertentu: header, bottom nav, dan badge di atas poster. Bukan di mana-mana.
- Satu warna aksen hangat (coral/merah-oranye) dipakai konsisten untuk ikon, link, tombol utama, dan state aktif.
- Poster adalah bintang utamanya. UI di sekelilingnya tenang.
- Tombol utama dan chip berbentuk **pill** (`rounded-full`). Kartu dan panel berbentuk **rounded-xl / 2xl**.
- Mobile-first. Di HP terasa seperti app (bottom tab bar), di desktop menjadi website dengan nav atas.

---

## 2. DESIGN TOKEN

Pakai warna format **oklch**. Daftarkan sebagai CSS variable di `:root` (light) dan `.dark` (dark), lalu petakan ke utility (`bg-background`, `text-primary`, dst.).

### Default tema: **dark**. Light tersedia lewat toggle.
Tambahkan script kecil di `<head>` yang membaca localStorage dan memasang class `dark` sebelum render, supaya tidak berkedip. **Pakai key tema yang sudah ada di project saya.**

### Warna

| Token | Light | Dark |
|---|---|---|
| `--background` | `oklch(0.985 0.006 90)` | `oklch(0.16 0.02 265)` |
| `--foreground` | `oklch(0.21 0.02 260)` | `oklch(0.96 0.005 250)` |
| `--card` | `oklch(1 0 0)` | `oklch(0.21 0.024 265)` |
| `--card-foreground` | `oklch(0.21 0.02 260)` | `oklch(0.96 0.005 250)` |
| `--primary` | `oklch(0.62 0.19 25)` | `oklch(0.68 0.18 28)` |
| `--primary-foreground` | `oklch(0.99 0.005 90)` | `oklch(0.15 0.02 265)` |
| `--secondary` | `oklch(0.95 0.015 60)` | `oklch(0.27 0.03 265)` |
| `--secondary-foreground` | `oklch(0.28 0.03 260)` | `oklch(0.96 0.005 250)` |
| `--muted` | `oklch(0.955 0.008 90)` | `oklch(0.27 0.03 265)` |
| `--muted-foreground` | `oklch(0.52 0.02 260)` | `oklch(0.7 0.02 260)` |
| `--accent` | `oklch(0.93 0.03 60)` | `oklch(0.3 0.04 265)` |
| `--accent-foreground` | `oklch(0.25 0.03 260)` | `oklch(0.96 0.005 250)` |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |
| `--border` | `oklch(0.9 0.01 90)` | `oklch(1 0 0 / 12%)` |
| `--input` | `oklch(0.9 0.01 90)` | `oklch(1 0 0 / 15%)` |
| `--ring` | sama dengan `--primary` | sama dengan `--primary` |

`theme-color` meta: `#d94f3b`.

### Radius
`--radius: 0.75rem`. Turunannya: `sm = radius-4px`, `md = radius-2px`, `lg = radius`, `xl = radius+4px`, `2xl = radius+8px`.

### Font
- **Display** (judul, logo, section title): **Sora**, weight 600 dan 700, `letter-spacing: -0.02em`.
- **Body / UI**: **Manrope**, weight 400, 500, 600.
- Muat lewat Google Fonts dengan `display=swap`. Beri fallback `ui-sans-serif, system-ui, sans-serif`.
- Aktifkan `-webkit-font-smoothing: antialiased`.

### Ikon
**Font Awesome 6.5.x** (class `fa-solid` / `fa-regular`). Satu keluarga ikon saja. Dilarang emoji sebagai ikon UI.

### Utility kustom (wajib ada)
```css
.glass {
  background-color: color-mix(in oklch, var(--color-background) 85%, transparent);
  backdrop-filter: blur(8px);
}
.press-soft { transition: transform .15s ease, opacity .15s ease; }
.press-soft:active { transform: scale(.97); opacity: .9; }
```
Semua elemen yang bisa ditekan (tombol, pill, tab) memakai `press-soft`.

### Skala teks
- Judul halaman / hero: `font-display text-3xl sm:text-4xl font-bold tracking-tight`
- Section title: `font-display text-xl font-semibold tracking-tight`
- Judul kartu: `text-sm font-semibold leading-snug line-clamp-2`
- Meta / caption: `text-xs font-medium text-muted-foreground`
- Label kecil di panel: `text-xs font-semibold uppercase tracking-wide text-muted-foreground`
- Label bottom nav: `text-[11px] font-medium`

---

## 3. LAYOUT GLOBAL

```
<div class="flex min-h-screen flex-col bg-background">
  <SiteHeader />        <!-- sticky -->
  <main class="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
    <Outlet />          <!-- isi halaman -->
  </main>
  <SiteFooter />
  <BottomNav />         <!-- fixed, hanya < lg -->
</div>
```

### Lebar container per jenis halaman
| Halaman | Container |
|---|---|
| Beranda, Detail, Ongoing/Tamat/Genre list, Watchlist | `mx-auto max-w-7xl px-4 py-8` |
| Nonton / Baca | `mx-auto max-w-4xl px-4 py-8` (reader komik: `max-w-3xl`) |
| Jadwal | `mx-auto max-w-4xl px-4 py-8` |
| Pencarian | `mx-auto max-w-2xl px-4 py-8` |
| Antar section | `space-y-10` (di dalam section: `space-y-3` atau `space-y-4`) |

### Breakpoint
- `< 640`: 2 kolom grid, bottom tab bar, header ringkas.
- `sm 640`: grid 3 kolom.
- `lg 1024`: nav atas muncul, bottom nav hilang, grid 5 kolom.
- `xl 1280`: grid 6 kolom.

Uji di lebar 360px. Tidak boleh ada scroll horizontal di body.

---

## 4. KOMPONEN (spesifikasi detail)

### 4.1 Header (`SiteHeader`)
- `glass sticky top-0 z-40 border-b border-border`, tinggi `h-16`, isi `mx-auto max-w-7xl px-4 flex items-center gap-3`.
- Kiri: logo 28x28 `rounded-lg` + nama situs `font-display text-lg font-semibold tracking-tight`.
- **Switch konten Anime | Komik** (komponen presentasi baru): segmented pill kecil di sebelah logo, di desktop. Item aktif `bg-secondary text-secondary-foreground`, nonaktif `text-muted-foreground`. Hanya `Link` ke route yang **sudah ada**. Di mobile, switch ini dipindah ke baris tipis di bawah header atau ke dalam bottom nav (pilih salah satu yang paling rapi).
- Nav desktop (`hidden lg:flex ml-6 gap-1`): item `rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground`, aktif `bg-secondary text-secondary-foreground`.
- Kanan (`ml-auto flex gap-2`): tombol bulat 36x36 `rounded-full border border-border bg-card hover:bg-accent` untuk **cari**, **toggle tema**, dan (mobile saja) **menu titik tiga**.
- Menu "Lainnya" di mobile: panel di bawah header `border-t bg-background px-4 py-3`, judul `text-xs font-semibold uppercase tracking-wide text-muted-foreground`, isi `grid grid-cols-3 gap-2` berupa kartu kecil `rounded-xl border bg-card px-2 py-3` dengan ikon `text-primary` di atas label. Isinya hanya item yang **tidak** ada di bottom nav.

### 4.2 Bottom Nav (`BottomNav`, hanya < lg)
- `glass fixed inset-x-0 bottom-0 z-40 flex border-t border-border pb-[env(safe-area-inset-bottom)]`.
- 5 tab: Home, Jadwal, Riwayat, Download/Unduhan (atau Bookmark untuk komik), Profil.
- Tiap tab `flex-1 flex-col items-center gap-1 py-2`, ikon `text-lg`, label `text-[11px] font-medium`. Aktif `text-primary`, nonaktif `text-muted-foreground`. Home memakai pencocokan exact.

### 4.3 Section Title
`flex items-center gap-2 font-display text-xl font-semibold tracking-tight` dengan ikon di depan berwarna `text-primary`. Di sisi kanan (kalau ada): link "Lihat semua" `text-sm font-medium text-primary hover:underline`, sejajar lewat `flex items-center justify-between`.

### 4.4 Kartu Poster (`AnimeCard` dan versi komik)
```
<a class="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm
          transition-all hover:-translate-y-0.5 hover:shadow-md">
  <div class="relative aspect-[2/3] overflow-hidden bg-muted">
    <img class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
    <!-- badge skor: kiri atas -->
    <span class="glass absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold">
      <i class="fa-solid fa-star mr-1 text-primary"></i>8.5
    </span>
  </div>
  <div class="space-y-1 p-3">
    <h3 class="line-clamp-2 text-sm font-semibold leading-snug">Judul</h3>
    <p class="text-xs font-medium text-muted-foreground">12 episode</p>
  </div>
</a>
```
- Rasio poster **2:3**. Selalu `loading="lazy"` dan `bg-muted` sebagai placeholder.
- Badge hanya tampil kalau datanya memang ada. Jangan mengarang data.
- Versi komik: meta diganti `Ch. 123` / status. Boleh ada badge kanan bawah `glass` untuk tipe (Manga / Manhwa / Manhua) **kalau field-nya tersedia dari scraper**. Kalau tidak tersedia, jangan dipaksakan.

### 4.5 Grid Poster
`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6`. Kosong: teks tengah `py-12 text-center text-sm text-muted-foreground`.

### 4.6 Baris List (`AnimeListRow`, dipakai di pencarian)
`flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:bg-accent`. Poster `h-20 w-14 rounded-lg object-cover`, judul `line-clamp-2 text-sm font-semibold`, meta `text-xs text-muted-foreground` (bintang `text-primary`), chevron kanan `text-xs text-muted-foreground`.

### 4.7 Pill / Chip
- Info (skor, studio, tahun, tipe, durasi, views): `inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold`, ikon `text-primary`. Baris pill **scroll horizontal** tanpa scrollbar.
- Genre: pill yang sama tapi `hover:bg-accent` dan berupa link.
- Pilihan (kualitas/server): aktif `bg-primary text-primary-foreground`, nonaktif `border bg-card hover:bg-accent`. Server aktif boleh pakai `bg-secondary`.

### 4.8 Tombol
- **Primary**: `press-soft inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90`.
- **Secondary / outline**: `rounded-full border border-border bg-card text-card-foreground shadow-sm hover:bg-accent`. State aktif (misal sudah subscribe) `bg-secondary text-secondary-foreground`.
- **Ikon bulat**: 36 atau 40 px, `rounded-full border bg-card`. Untuk bookmark di detail: 52px, ikon `fa-regular` lalu `fa-solid` saat tersimpan.
- Di mobile tombol utama `w-full`, di `sm` ke atas `w-auto`.
- Disabled: `opacity-40` atau `opacity-60` dan `cursor-not-allowed`.

### 4.9 Pagination
Tengah, `flex items-center justify-center gap-3 py-8`. Tombol "Sebelumnya" dan "Berikutnya" berbentuk pill outline dengan chevron, teks tengah `text-sm text-muted-foreground`: "Halaman X dari Y".

### 4.10 State
- **Loading**: spinner `fa-circle-notch fa-spin text-2xl text-primary` + label `text-sm font-semibold` di tengah, `py-20`. Untuk grid, ganti dengan **skeleton** kartu 2:3 (`bg-muted animate-pulse rounded-xl`) supaya layout tidak loncat.
- **Error**: kartu `rounded-xl border bg-card px-6 py-14 text-center shadow-sm`, ikon `fa-triangle-exclamation text-destructive`, pesan muted, tombol primary "Coba lagi" (memanggil fungsi retry yang **sudah ada**).
- **Kosong**: teks muted di tengah.

### 4.11 Footer
`mt-16 border-t border-border bg-card`, isi `max-w-7xl px-4 py-8 text-sm text-muted-foreground`: nama situs `font-display text-base font-bold text-foreground`, lalu satu paragraf disclaimer (`max-w-xl leading-relaxed`) bahwa data dan konten berasal dari pihak ketiga.

---

## 5. HALAMAN

### 5.1 Beranda
Urutan blok (`space-y-10`):
1. **Hero** (`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-secondary to-card p-8 shadow-sm`)
   - Opsional video latar `object-cover` (autoplay, muted, loop, playsInline) + overlay `bg-gradient-to-br from-background/90 via-background/75 to-background/50`.
   - Isi: H1 display, paragraf `max-w-2xl text-sm leading-relaxed text-muted-foreground`, dua CTA pill: satu primary (dengan ikon), satu outline.
   - Hormati `prefers-reduced-motion`: matikan video, pakai gradient saja.
2. **Lanjutkan Nonton / Lanjut Baca**: hanya tampil kalau ada riwayat. Baris scroll horizontal (`-mx-4 flex gap-3 overflow-x-auto px-4`, scrollbar disembunyikan), kartu `w-32 shrink-0`, poster 2:3 `rounded-xl`, hover menampilkan ikon play di tengah dengan overlay tipis, judul `line-clamp-2 text-xs font-medium`.
3. **Sedang Tayang / Update Terbaru**: section title + "Lihat semua" + grid poster.
4. **Baru Tamat / Populer**: sama.
Untuk situs anime + komik: pisahkan dua blok besar (Anime lalu Komik), masing-masing dengan section title dan "Lihat semua" sendiri. Jangan menggabungkan data keduanya.

### 5.2 Detail (anime atau komik)
- **Backdrop** `h-64 sm:h-80`: poster `object-cover` penuh, overlay `bg-gradient-to-t from-background via-background/50 to-transparent`. Di mobile backdrop full-bleed (`-mx-4`), di `sm` jadi kartu `rounded-2xl border`.
- Badge status kiri atas `glass rounded-full px-3 py-1 text-xs font-semibold` dengan ikon `text-primary` (siaran untuk ongoing, centang untuk tamat).
- Judul menimpa bagian bawah backdrop: `-mt-14 sm:-mt-16`, `font-display text-2xl sm:text-4xl font-bold`, di bawahnya judul alternatif/Jepang `text-sm text-muted-foreground`.
- Baris pill info (scroll horizontal) lalu chip genre (wrap).
- Baris aksi: tombol primary "Tonton Episode X" / "Lanjut Eps X" (komik: "Baca Chapter X" / "Lanjut Chapter X"), tombol subscribe/ikuti outline, tombol bookmark bulat 52px. Mobile menumpuk vertikal (`flex-col`), `sm` ke atas sejajar.
- Chip batch download (`rounded-lg bg-accent px-3 py-2 text-sm font-semibold`) kalau ada.
- **Sinopsis**: judul `font-display text-xl`, teks `line-clamp-4` + tombol "Selengkapnya / Sembunyikan" `text-primary` dengan chevron. Logic expand cukup state lokal tampilan.
- **Daftar Episode / Chapter**: list `divide-y divide-border rounded-xl border bg-card shadow-sm`. Tiap baris: "Episode N" (atau "Chapter N") `text-sm font-semibold`, views kecil dengan ikon mata, tanggal `text-xs text-muted-foreground`, tombol "Tonton/Baca" pill `h-9 text-xs`. Item yang sedang aktif/terakhir dibaca: `bg-accent/60` dan tombol berwarna primary. Untuk komik dengan ratusan chapter, beri **max-height + scroll internal** atau tombol urut (terbaru/terlama) sebagai tampilan.
- **Rekomendasi**: grid poster.

### 5.3 Nonton Episode
Container `max-w-4xl`, `space-y-6`:
1. Player `aspect-video w-full overflow-hidden rounded-xl border bg-black`. State menunggu: spinner + teks "Menyiapkan pemutar video". Cara player memilih sumber **tidak diubah**.
2. Judul `font-display text-lg sm:text-xl font-bold`, di bawahnya meta kecil (Episode N, views).
3. **Panel Kualitas + Server**: `rounded-xl border bg-card p-4 shadow-sm`, dua kelompok dengan label uppercase kecil, isi pill pilihan.
4. Baris aksi: Share, Download (outline), dan di kanan (`ml-auto`) tombol bulat 40px prev (outline) dan next (primary filled).
5. **Episode List**: panel kartu dengan header (judul + link "Lihat detail"), isi grid nomor `grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-2`, kotak `aspect-square rounded-lg`, aktif `bg-primary`, tinggi maksimal `max-h-72` scroll.
6. Kartu info anime: poster `h-28 w-20 rounded-lg` + judul (link) + sinopsis 3 baris.

### 5.4 Baca Chapter (komik) — layout baru, tanpa logic baru
- Container `max-w-3xl mx-auto`, latar mengikuti `bg-background` (dark default).
- Gambar halaman ditumpuk vertikal, **tanpa celah**, lebar penuh, `loading="lazy"`, tiap gambar punya placeholder `bg-muted` dengan `min-height` supaya tidak layout shift.
- Top bar tipis `glass sticky top-0` berisi tombol kembali, judul komik + chapter, tombol daftar chapter. Boleh auto-hide saat scroll turun (state tampilan saja).
- Bar bawah melayang (`fixed bottom`, `glass rounded-full`) berisi prev / pilih chapter / next, tombol next berwarna primary. Hormati `safe-area-inset-bottom`.
- Progress tipis di atas `h-0.5 bg-primary` mengikuti scroll (murni UI).
- Di akhir chapter: dua tombol besar "Chapter sebelumnya" dan "Chapter berikutnya" + link kembali ke detail.
Cara gambar diambil dan urutannya **tidak diubah**, hanya dibungkus tampilan ini.

### 5.5 Jadwal
`max-w-4xl space-y-8`. Per hari: judul `font-display text-base font-bold` + jumlah (`text-xs text-muted-foreground`), isi list `divide-y rounded-xl border bg-card shadow-sm`. **Hari ini** diberi `border-primary/40` dan label "(Hari Ini)" berwarna primary. Baris: poster `h-16 w-12 rounded-lg`, judul `line-clamp-2 text-sm font-medium`, chevron kanan.

### 5.6 Pencarian
`max-w-2xl`. Form `flex gap-2`: input pill `h-11 flex-1 rounded-full border bg-card px-4 text-sm focus:border-primary`, tombol primary pill dengan ikon cari. Hasil memakai `AnimeListRow`, header hasil `text-xs font-semibold uppercase tracking-wide text-muted-foreground`. State awal dan tidak ditemukan berupa teks muted di tengah. Kalau situs punya pencarian anime dan komik, beri tab kecil (pill) untuk memilih jenis, dengan memakai query yang sudah ada.

### 5.7 Genre
Grid `grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5`. Tiap genre pill besar `rounded-full border bg-card px-4 py-3 text-center text-sm font-medium hover:bg-accent`.

### 5.8 Ongoing / Tamat / list lain
Section title + grid poster + pagination (4.9).

### 5.9 Riwayat, Watchlist/Bookmark, Profil, Download
Ikuti pola yang sama: container `max-w-7xl` (atau `max-w-3xl` untuk Profil), section title berikon, kartu `rounded-xl border bg-card shadow-sm`, list `divide-y`, tombol pill. Pengaturan di Profil (tema, notifikasi) memakai baris kartu dengan switch/tombol di kanan. Logic tiap halaman tidak diubah.

---

## 6. MOTION & INTERAKSI

- Hover kartu: naik `-translate-y-0.5` + `shadow-md`; poster `scale-105` durasi 300ms.
- Tekan: `press-soft` di semua elemen interaktif.
- Transisi warna `transition-colors` (150ms). Tidak ada animasi yang lebih dramatis dari itu.
- Spinner hanya untuk loading, bukan hiasan.
- `prefers-reduced-motion`: matikan zoom poster, video hero, dan transisi transform.

---

## 7. RESPONSIF & AKSESIBILITAS

- Target sentuh minimal 36px, utamakan 40 sampai 44px untuk aksi penting.
- Semua tombol ikon punya `aria-label` bahasa Indonesia.
- Fokus keyboard terlihat: `focus-visible:ring-2 ring-ring`.
- Kontras teks memenuhi WCAG AA di light dan dark. Teks di atas gambar selalu di atas overlay gradient atau badge `glass`.
- Semua `<img>` punya `alt` (judul). Gambar di bawah fold memakai `loading="lazy"`.
- Hormati `env(safe-area-inset-*)` di header, bottom nav, dan bar melayang.
- Body tidak boleh scroll horizontal. Baris yang memang scroll horizontal menyembunyikan scrollbar (`[scrollbar-width:none] [&::-webkit-scrollbar]:hidden`).

---

## 8. ANTI "AI SLOP" (supaya hasilnya tidak terlihat generik)

- Jangan pakai gradient ungu/biru neon, glow, atau bayangan tebal. Aksen hanya satu: coral di token `--primary`.
- Blur kaca hanya di header, bottom nav, dan badge di atas poster. Kartu biasa **tidak** glass.
- Tidak ada emoji sebagai ikon, tidak ada ilustrasi dekoratif yang tidak diminta, tidak ada teks lorem atau data palsu.
- Jangan semuanya rata tengah. Judul dan konten rata kiri, hanya state kosong/loading/error yang di tengah.
- Spacing konsisten dari skala yang sama (4, 8, 12, 16, 24, 40). Jangan campur angka acak.
- Satu keluarga ikon, dua keluarga font, satu skala radius.
- Jangan menambah section, statistik, testimoni, atau fitur yang tidak ada datanya di scraper saya.
- Teks UI memakai bahasa Indonesia yang natural dan singkat ("Lihat semua", "Lanjut Eps 5", "Coba lagi"), bukan terjemahan kaku.

---

## 9. PEMETAAN ANIME ke KOMIK

| Anime | Komik |
|---|---|
| Episode | Chapter |
| Pemutar video | Reader vertikal (5.4) |
| Lanjutkan Nonton | Lanjut Baca |
| Sedang Tayang | Update Terbaru |
| Baru Tamat | Tamat |
| Studio, durasi | Pengarang, tipe (Manga/Manhwa/Manhua) **jika ada di data** |
| Kualitas + Server | (tidak ada, panel dihilangkan) |
| Batch download | (hilangkan kecuali memang ada fitur unduh) |

Identitas visual (token, font, kartu, header, nav) **sama persis** untuk anime dan komik supaya terasa satu produk.

---

## 10. CHECKLIST SEBELUM SELESAI

- [ ] Tidak ada file scraper / server function / query / type / route-param / localStorage key yang berubah (tunjukkan buktinya di ringkasan).
- [ ] Semua halaman tetap bisa dibuka dan menampilkan data yang sama seperti sebelumnya.
- [ ] Dark dan light sama-sama rapi, tanpa kedipan saat pertama load.
- [ ] Tampilan benar di 360px, 768px, 1280px. Tidak ada scroll horizontal.
- [ ] Bottom nav hanya di < lg, header nav hanya di >= lg.
- [ ] Loading memakai skeleton atau spinner, error punya tombol "Coba lagi", kosong punya teks.
- [ ] Hari ini di Jadwal tersorot, item aktif di daftar episode/chapter tersorot.
- [ ] Reader komik: gambar lazy, tanpa layout shift, bar atas/bawah tidak menutupi konten.
- [ ] Tidak ada warna hardcode di luar token.

---

## 11. FORMAT JAWABAN YANG SAYA MAU

1. Ringkasan singkat: mana file logic (tidak disentuh) dan mana file tampilan (akan diubah).
2. Perubahan CSS/token dan font (satu file).
3. Komponen bersama (header, bottom nav, kartu, grid, pill, state, footer).
4. Halaman satu per satu: Beranda, Detail, Nonton/Baca, Jadwal, Pencarian, Genre, list, lalu halaman sisanya.
5. Catatan: hal yang tidak bisa dikerjakan tanpa menyentuh logic, beserta pertanyaan untuk saya.

Mulai dari langkah 1.
