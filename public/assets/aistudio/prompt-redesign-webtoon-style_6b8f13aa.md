# PROMPT: Redesign Website Komik Bergaya Webtoon

> Tempel seluruh isi file ini ke AI builder (Google AI Studio, Cursor, dll). Isi bagian **[0. INPUT]** dulu sebelum dikirim.

---

## 0. INPUT (isi sebelum kirim)

- **Nama website:** `[NAMA_WEBSITE]`
- **Bahasa UI:** `[Indonesia / Inggris]`
- **Stack:** `[Next.js + Tailwind / React + Vite + Tailwind / dll]`
- **Kondisi saat ini:** `[redesign dari kode yang sudah ada / mulai dari nol]`
- **Warna brand:** pakai hijau terang sebagai warna aksen utama (lihat token di bawah). Boleh diganti jika saya sebutkan: `[WARNA_BRAND_OPSIONAL]`

---

## 1. PERAN & TUJUAN

Kamu adalah senior product designer + frontend engineer yang sangat paham pola UI platform komik vertikal (webtoon). Tugasmu: **mendesain ulang seluruh tampilan website komik saya agar terasa seperti platform webtoon profesional** — bersih, padat konten, mobile-first, fokus ke gambar cover dan pengalaman membaca scroll vertikal.

Targetnya **bukan** "website bagus ala template AI", tapi **UI produk nyata** yang terlihat dibuat oleh tim desain platform komik.

**Batasan hukum:** jangan memakai logo, nama, aset, atau gambar milik Webtoon/Naver. Cukup meniru *pola UX dan struktur layout*. Pakai nama `[NAMA_WEBSITE]` dan logo teks sederhana buatan sendiri.

---

## 2. ATURAN ANTI "AI SLOP" (WAJIB, PRIORITAS TERTINGGI)

Langgar satu saja = hasil dianggap gagal.

**DILARANG:**
- Gradient ungu/biru/pink (terutama di hero atau tombol), gradient mesh, blob, glow, neon.
- Glassmorphism / backdrop-blur dekoratif / kartu transparan melayang.
- Bayangan besar dan lembut di mana-mana. Pakai border tipis dan bayangan hanya jika fungsional (dropdown, modal).
- Sudut terlalu bulat di mana-mana. Cover komik **hampir persegi (radius 2–4px)**, bukan pill/kapsul.
- Emoji sebagai ikon (🔥⭐❤️). Pakai ikon SVG konsisten (Lucide / Phosphor, stroke seragam).
- Hero besar dengan headline marketing ("Discover amazing stories", "Welcome to…") dan 2 tombol CTA. Ini platform baca, **bukan landing page SaaS**.
- Section "Features / Why choose us / Testimonials / Newsletter".
- Teks Lorem ipsum, "Judul Komik 1", "Item 1". Pakai **data dummy yang realistis** (judul, genre, author, jumlah like, tanggal yang masuk akal).
- Animasi berlebihan (floating, bounce, parallax dekoratif, fade-in-up di semua elemen).
- Semua kartu dibuat sama persis dalam grid 3 kolom yang monoton. Variasikan format section seperti di bawah.
- Gaya "card dengan ikon di lingkaran berwarna pastel".
- Spasi tidak konsisten. Gunakan skala 4px (4, 8, 12, 16, 24, 32, 48).
- Memakai lebih dari 1 warna aksen. Sisanya netral (putih, abu, hitam).

**WAJIB:**
- Desain terasa **datar, tajam, padat informasi, dan fungsional**.
- Hirarki visual lewat **ukuran, ketebalan font, dan warna teks** — bukan lewat dekorasi.
- Setiap elemen punya fungsi (navigasi, info, aksi). Tidak ada elemen "pemanis" saja.
- Gambar cover adalah bintang utama. UI di sekelilingnya harus tenang dan netral.

---

## 3. DESIGN TOKENS

Definisikan sebagai CSS variables / Tailwind theme, lalu **pakai konsisten**, jangan hardcode.

### Warna (mode terang = default)

| Token | Nilai | Pemakaian |
|---|---|---|
| `--accent` | `#00D564` | Tombol utama, tab aktif, badge, link aktif |
| `--accent-hover` | `#00B957` | Hover/pressed |
| `--bg` | `#FFFFFF` | Latar halaman |
| `--bg-subtle` | `#F5F5F5` | Latar section/chip/skeleton |
| `--border` | `#E5E5E5` | Garis pemisah, border input |
| `--text` | `#1A1A1A` | Teks utama, judul |
| `--text-muted` | `#757575` | Author, tanggal, meta |
| `--text-faint` | `#A8A8A8` | Placeholder, disabled |
| `--danger` | `#E5484D` | Error, badge "baru" opsional |
| `--like` | `#FF4D4F` | Ikon hati aktif |

Mode gelap (opsional tapi disarankan, terutama untuk halaman baca): `--bg: #121212`, `--bg-subtle: #1E1E1E`, `--border: #2A2A2A`, `--text: #F2F2F2`, `--text-muted: #9A9A9A`. Accent tetap sama.

### Tipografi
- Font UI: **satu keluarga sans-serif geometris** (mis. Poppins atau Inter). Fallback: `system-ui, sans-serif`. Maksimal 2 weight utama: 400 dan 600/700.
- Judul komik di kartu: 14–15px / 600, **maksimal 2 baris** lalu ellipsis.
- Meta (author, genre, tanggal): 12–13px / 400, warna `--text-muted`.
- Judul halaman series: 22–28px / 700.
- Label tab/nav: 14px / 600, huruf kapital hanya untuk tab hari (SEN, SEL…).
- Line-height: 1.3 untuk judul, 1.5 untuk teks biasa. Letter-spacing normal.

### Layout & bentuk
- Container maksimal **1200px** (desktop) dengan padding horizontal 16px (mobile) / 24px (desktop).
- Radius: cover 4px, tombol 6px, input 6px, chip/tag 999px (hanya chip genre kecil), avatar bulat.
- Border: 1px solid `--border`. Bayangan hanya untuk dropdown/modal: `0 4px 16px rgba(0,0,0,.12)`.
- Transisi: 150ms ease, hanya untuk warna/opacity. Tanpa animasi lain.

---

## 4. KOMPONEN GLOBAL

### 4.1 Header (sticky)
- Tinggi 56px (mobile) / 64px (desktop), latar putih, border-bottom 1px.
- Kiri: logo teks `[NAMA_WEBSITE]` (bold, warna hitam, satu kata bisa berwarna aksen). Bukan gambar rumit.
- Tengah (desktop): menu **Beranda · Genre · Peringkat · Komunitas** dengan indikator garis bawah 2px `--accent` pada item aktif.
- Kanan: ikon cari, ikon notifikasi, avatar / tombol "Masuk".
- Mobile: logo kiri, ikon cari + menu hamburger kanan. Navigasi utama pindah ke **bottom tab bar**.
- Pencarian: ikon membuka overlay layar penuh (mobile) / dropdown lebar (desktop) dengan riwayat pencarian dan "populer sekarang".

### 4.2 Bottom Tab Bar (mobile only)
5 tab: **Beranda, Genre, Peringkat, Simpanan, Profil**. Ikon outline + label 10–11px. Tab aktif: ikon dan label `--accent`. Tinggi 56px + safe-area.

### 4.3 Kartu Komik (varian)
1. **Kartu vertikal standar** (grid): cover rasio **3:4**, di bawahnya judul (2 baris maks), nama author, dan baris meta (ikon hati kecil + jumlah like, mis. `1,2 jt`). Tanpa border/shadow di kartu, hanya gambar.
2. **Kartu peringkat**: angka besar (24–32px, bold) di kiri cover, cover kecil rasio 1:1 atau 3:4, judul + genre + author di kanan. Angka 1–3 berwarna `--accent`, sisanya hitam.
3. **Kartu daftar episode**: thumbnail 16:9 atau 1:1 di kiri (80–100px), kanan: judul episode, tanggal, jumlah like. Nomor episode `#12` di kanan.
4. **Kartu hero banner** (carousel): lihat bagian Beranda.

### 4.4 Badge & Label
- `UP` (episode baru hari ini): kotak kecil 16×16, latar `--accent`, teks putih, radius 2px.
- `BARU`, `TAMAT`, `HIATUS`: teks 10–11px bold, border 1px, tanpa warna mencolok.
- Genre chip: teks 12px, latar `--bg-subtle`, radius 999px, padding 4×10.

### 4.5 Tombol
- Primer: latar `--accent`, teks putih, tinggi 44px, radius 6px, font 600.
- Sekunder: latar putih, border 1px `--border`, teks `--text`.
- Ghost/ikon: tanpa latar, area klik minimal 44×44px.
- State wajib: hover, active, focus-visible (outline 2px `--accent`, offset 2px), disabled, loading (spinner kecil, bukan skeleton).

---

## 5. HALAMAN & SPESIFIKASI

### 5.1 Beranda (`/`)
Urutan section dari atas ke bawah:

1. **Banner carousel**: lebar penuh, rasio 16:9 (mobile) / 21:9 (desktop, dalam container). Gambar promosi dengan overlay gelap tipis di bawah untuk teks: judul, tagline 1 baris, genre. Indikator berupa **garis/angka kecil "1 / 6"** di pojok kanan bawah, bukan titik-titik besar. Auto-play 5 detik, berhenti saat hover/sentuh, bisa swipe. Tanpa tombol CTA besar. Seluruh banner bisa diklik.
2. **Tab hari update**: `SEN SEL RAB KAM JUM SAB MIN TAMAT`. Tab hari ini otomatis aktif. Tab aktif: teks hitam + garis bawah 3px `--accent`; tidak aktif: abu. Bisa scroll horizontal di mobile.
3. **Grid update hari terpilih**: kartu vertikal standar. 3 kolom (mobile) / 5–6 kolom (desktop). Badge `UP` di pojok kiri atas cover jika update hari ini. Gap 12px (mobile) / 16px (desktop).
4. **Section "Peringkat Teratas"**: daftar kartu peringkat, dibagi tab `Hari ini / Minggu ini / Bulan ini`. Layout 2 kolom di desktop (1–5 dan 6–10), 1 kolom di mobile.
5. **Section horizontal scroll** per genre/tema (mis. "Romansa Populer", "Aksi & Fantasi", "Komedi Ringan"): judul section kiri, "Lihat semua >" kanan, baris kartu yang bisa di-scroll horizontal dengan scroll-snap. Tampilkan sebagian kartu terakhir terpotong agar jelas bisa digeser.
6. **Section "Terakhir dibaca"** (jika login): kartu horizontal dengan progress "Lanjutkan Ep. 23".
7. **Footer** ringkas: tautan (Tentang, Bantuan, Kebijakan Privasi, Syarat), hak cipta 1 baris. Latar `--bg-subtle`. Tanpa kolom newsletter.

### 5.2 Halaman Genre (`/genre/[slug]`)
- Baris chip genre scrollable di atas (Semua, Romansa, Fantasi, Aksi, Drama, Komedi, Thriller, Slice of Life, dll). Chip aktif: latar hitam, teks putih.
- Dropdown/segmented urutan: **Populer · Terbaru · Like terbanyak**.
- Grid kartu vertikal dengan **infinite scroll** (atau tombol "Muat lebih banyak"), skeleton saat memuat.

### 5.3 Halaman Detail Series (`/series/[slug]`)
- **Header series**: latar blur dari cover (blur kuat + overlay gelap 50%, **ini satu-satunya tempat blur diperbolehkan**), cover rasio 3:4 di kiri (mobile: di tengah atas), kanan: genre (teks kecil), judul (besar, putih), author, ringkasan angka dengan ikon SVG (jumlah pembaca, pelanggan, rating bintang).
- **Baris aksi**: tombol utama **"Baca Episode 1"** (atau "Lanjutkan Ep. N"), tombol sekunder **"Simpan/Langganan"** (ikon bookmark/hati), ikon bagikan.
- **Sinopsis**: 3 baris dengan "Selengkapnya" untuk expand.
- **Info jadwal**: "Update tiap Senin" + chip genre/tag.
- **Daftar episode**: baris kartu episode (thumbnail kiri, judul, tanggal, like, nomor `#`). Urutan terbaru → terlama dengan toggle urutan. Episode sudah dibaca: thumbnail/judul diredupkan (opacity 0.5). Episode berbayar/terkunci: ikon gembok kecil.
- Tab di bawah header: **Episode · Info · Komentar**.
- Bagian "Mungkin kamu suka": baris horizontal scroll kartu vertikal.

### 5.4 Halaman Baca / Viewer (`/series/[slug]/episode/[n]`) — PALING KRITIS
Ini jantung pengalaman webtoon. Ikuti detail ini dengan ketat:

- **Kolom baca tunggal**, lebar maksimal **720–800px**, di tengah layar. Di mobile: lebar penuh tanpa padding.
- Panel/gambar komik **ditumpuk vertikal tanpa celah sama sekali** (`display:block`, tanpa margin/gap, `line-height:0` di wrapper) agar sambungan antar panel mulus.
- Latar di luar kolom: abu sangat terang `#F0F0F0` (mode terang) atau `#000` (mode gelap) pada desktop.
- **Lazy load** setiap gambar (`loading="lazy"`), beri `width/height` atau `aspect-ratio` agar tidak ada layout shift, tampilkan placeholder abu saat memuat.
- **Header baca**: sticky, tinggi 48px, hanya judul series (kiri, tombol kembali), judul episode di tengah, ikon menu kanan. **Otomatis menyembunyikan diri saat scroll turun dan muncul saat scroll naik / tap layar.**
- **Bottom bar baca**: muncul/hilang bersamaan dengan header. Isi: tombol ◀ episode sebelumnya, ikon daftar episode (membuka bottom sheet), ikon hati (like) dengan jumlah, ikon komentar dengan jumlah, ▶ episode berikutnya.
- **Progress bar tipis** 2px `--accent` di paling atas layar menunjukkan progres scroll.
- **Akhir episode**: blok penutup berisi tombol besar "Episode Berikutnya" (primer), tombol like/bagikan, lalu 2–3 rekomendasi series. Di bawahnya preview 3 komentar teratas + "Lihat semua komentar".
- Simpan posisi baca terakhir (lokal) dan tawarkan "Lanjutkan dari tempat terakhir".
- Pintasan keyboard desktop: `←` `→` ganti episode, `Spasi`/`↓` scroll, `Esc` tutup panel.

### 5.5 Halaman Peringkat (`/ranking`)
Tab: Hari ini / Minggu ini / Bulan ini / Genre. Daftar kartu peringkat 1 kolom penuh dengan angka besar. Indikator naik/turun posisi (panah kecil + angka) dengan warna netral/hijau/merah halus.

### 5.6 Pencarian, Simpanan, Profil (ringkas tapi lengkap)
- **Pencarian**: input besar, hasil dalam daftar (cover kecil + judul + author + genre), filter genre/status.
- **Simpanan/Langganan**: tab "Langganan · Riwayat · Unduhan(opsional)", grid kartu dengan badge `UP` untuk episode baru.
- **Profil/Login**: form bersih, label di atas input, error inline berwarna `--danger`, tanpa ilustrasi dekoratif.

---

## 6. STATE & POLISH (jangan dilewati)

- **Loading:** skeleton persegi abu `--bg-subtle` dengan bentuk sama persis seperti konten asli (cover 3:4, 2 baris teks). Bukan spinner di tengah halaman.
- **Empty state:** teks singkat + 1 tombol aksi, ikon SVG sederhana (mis. "Belum ada komik yang disimpan" → "Jelajahi komik").
- **Error state:** pesan jelas + tombol "Coba lagi".
- **Gambar gagal dimuat:** fallback latar abu + ikon gambar kecil, jangan ikon rusak browser.
- **Hover (desktop):** kartu cover cukup naik opacity judul ke aksen atau overlay 5%, **tanpa** scale/lift/shadow besar.
- **Dark mode:** toggle di profil/menu, hormati `prefers-color-scheme`.

---

## 7. RESPONSIF

- Mobile-first. Titik patah: `640px`, `1024px`, `1280px`.
- Grid kartu: 3 kolom (<640), 4 (640–1023), 5 (1024–1279), 6 (≥1280).
- Target sentuh minimal 44×44px. Tidak boleh ada scroll horizontal pada halaman (selain baris carousel yang disengaja).
- Gambar cover memakai `aspect-ratio` + `object-fit: cover`.

---

## 8. AKSESIBILITAS & PERFORMA

- Kontras teks minimal WCAG AA. Teks putih di atas `--accent` hanya untuk teks tebal/besar; jika kontras kurang, pakai teks hitam di atas hijau.
- Semua ikon-tombol punya `aria-label`. Gambar cover punya `alt` berisi judul.
- Fokus keyboard terlihat jelas di semua elemen interaktif.
- Hormati `prefers-reduced-motion` (matikan auto-play carousel).
- Gunakan `next/image` atau `<img>` dengan `srcset`/`sizes`; cover di grid jangan dimuat dalam resolusi penuh.

---

## 9. DATA DUMMY

Siapkan minimal **12 series** dengan data realistis (judul bahasa Indonesia/Inggris yang masuk akal, author, genre, jumlah like seperti `1,2 jt`, `843 rb`, jadwal update, status). Tiap series punya ≥ 8 episode dengan tanggal berurutan. Untuk gambar, pakai placeholder berwarna solid dengan rasio yang benar atau layanan placeholder dan **buat mudah diganti** ke gambar asli lewat satu file data (`/data/comics.ts` atau `.json`).

---

## 10. STRUKTUR KODE

- Pisahkan komponen: `Header`, `BottomTabBar`, `ComicCard`, `RankCard`, `EpisodeRow`, `DayTabs`, `HeroCarousel`, `Viewer`, `Skeleton`, dll.
- Token warna/spasi di satu tempat (tailwind config / `globals.css`).
- Tidak ada inline style acak, tidak ada angka ajaib berulang.
- Komentar singkat hanya di bagian yang tidak jelas.

---

## 11. CARA KERJA (URUTAN OUTPUT)

1. Tulis **ringkasan rencana** singkat (maks 10 baris): struktur halaman + komponen yang akan dibuat. Jangan bertanya balik, buat asumsi wajar dan sebutkan.
2. Implementasikan **semua halaman di Bagian 5** sekaligus, bukan hanya beranda.
3. Pastikan seluruh item **Definition of Done** terpenuhi.

---

## 12. DEFINITION OF DONE (cek sebelum selesai)

- [ ] Tidak ada gradient dekoratif, glassmorphism, emoji sebagai ikon, atau hero marketing.
- [ ] Hanya satu warna aksen (hijau), sisanya netral.
- [ ] Cover memakai rasio 3:4 dan radius kecil; judul maksimal 2 baris.
- [ ] Beranda punya banner carousel, tab hari, grid update, peringkat, dan section scroll horizontal.
- [ ] Halaman baca: kolom tunggal, panel tanpa celah, header/bottom bar auto-hide, progress bar, lazy load.
- [ ] Bottom tab bar di mobile, header navigasi di desktop.
- [ ] Skeleton, empty, error, dan fallback gambar tersedia.
- [ ] Responsif 360px–1440px tanpa scroll horizontal halaman.
- [ ] Dark mode berfungsi.
- [ ] Data dummy realistis, tidak ada Lorem ipsum.
- [ ] Tidak ada aset/logo/nama milik Webtoon.
