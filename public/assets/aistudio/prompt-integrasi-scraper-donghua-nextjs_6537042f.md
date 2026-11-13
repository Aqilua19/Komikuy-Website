# Prompt MD — Integrasi Scraper Donghua (anichin-api) ke Website Anime Next.js

> **Untuk Nizar (bukan bagian prompt):**
> 1. Tempel **semua isi di bawah garis `=== MULAI PROMPT ===`** ke Google AI Studio.
> 2. Setelah kode jadi, isi `.env.local` (lihat Langkah 2), lalu tes URL di Langkah 6.
> 3. Kode TypeScript di prompt ini sudah dicek: `tsc` strict lolos, `next build` (Next 16) sukses, dan 20 tes dengan HTML tiruan lolos. **Belum dites ke situs anichin asli** (tidak ada akses internet saat dibuat), jadi kalau hasilnya kosong/403, cek tabel Troubleshooting di bagian akhir.
> 4. Dari repo asli, scraper ini **bergantung pada Cloudflare cookie** yang di-hardcode dan sudah basi. Di versi ini cookie diambil dari `.env.local`. Cara ambil: buka situs sumber di browser → F12 → Application → Cookies → salin nilai `cf_clearance`, dan salin User-Agent browser yang sama (ketik `navigator.userAgent` di Console).

=== MULAI PROMPT ===

# PERAN & TUJUAN

Kamu adalah senior Next.js engineer. Tugasmu: **menambahkan fitur "Donghua" ke website anime Next.js yang sudah ada**, dengan scraper yang di-port dari repo Python `asmindev/anichin-api` (Flask + BeautifulSoup) ke **TypeScript murni di dalam project Next.js**. Tidak ada server Python, tidak ada proses terpisah: semuanya berjalan lewat Route Handlers Next.js dan fungsi server.

Hasil akhir harus: (1) `npm run build` sukses tanpa error TypeScript, (2) semua endpoint `/api/donghua/*` mengembalikan JSON, (3) ada halaman Donghua (beranda, pencarian, genre, detail seri, nonton) yang tampil memakai komponen & gaya website yang sudah ada.

# ATURAN KERAS (jangan dilanggar)

1. **Jangan mengubah, memindahkan, atau menghapus** logic scrape, route API, halaman, atau komponen yang sudah ada. Semua kode baru bersifat **tambahan** dan hidup di prefix `donghua` (folder `src/lib/donghua/`, route `/api/donghua/*`, halaman `/donghua/*`). Satu-satunya edit ke file lama yang diperbolehkan: menambah **satu link menu "Donghua"** di navbar/sidebar yang sudah ada, dan menambah variabel ke `.env.example` bila file itu ada.
2. **Salin kode di Langkah 3 PERSIS apa adanya** (isi, nama file, nama export). Jangan diringkas, jangan "dioptimalkan", jangan diganti library (mis. jangan ganti cheerio ke library lain), jangan ditambah `any`. Kode itu sudah lolos `tsc --strict` dan `next build`.
3. **Dilarang** memakai Python, `eval`, `child_process`, atau `puppeteer/playwright`. Scraping hanya lewat `fetch` + `cheerio`.
4. **Dilarang** menulis cookie, token, atau API key langsung di kode. Semua dari `process.env` (lihat Langkah 2).
5. Semua file scraper/route berjalan di **Node.js runtime** (bukan Edge). Jangan hapus `export const runtime = "nodejs"`.
6. Jangan meninggalkan placeholder seperti `// TODO`, `// ...kode lainnya`, atau "implementasikan sendiri". Setiap file harus lengkap.
7. Tulis semua teks UI dalam **Bahasa Indonesia**.

# LANGKAH 0 — Audit project dulu (WAJIB sebelum menulis kode)

Baca dan catat:
- `package.json`: **versi Next.js** (14 / 15 / 16), versi React, ada Tailwind atau tidak, package manager (npm/pnpm/yarn).
- Struktur: pakai **App Router** (`src/app` atau `app`) atau Pages Router? Ada alias `@/*` di `tsconfig.json`? Folder source-nya `src/` atau root?
- Komponen yang sudah ada dan bisa dipakai ulang: kartu anime/poster, grid, navbar, skeleton/loading, pemutar video, tombol, pagination, dan token desain (warna, font, radius).
- Cara project saat ini menampilkan gambar (`next/image` atau `<img>`).

**Penyesuaian otomatis** berdasarkan audit:
- Jika project **tanpa folder `src/`**: tulis semua path di bawah **tanpa awalan `src/`** (mis. `lib/donghua/...`, `app/api/donghua/...`) dan pastikan alias `@/*` menunjuk ke root. Jangan mengubah alias yang sudah ada; sesuaikan import `@/lib/donghua` agar tetap benar.
- Jika project memakai **Pages Router**: tetap buat `app/api/donghua/*` hanya jika App Router juga ada; kalau benar-benar hanya Pages Router, tulis ulang route sebagai `pages/api/donghua/*.ts` dengan handler `(req, res)` yang memanggil fungsi yang sama dari `lib/donghua`. Jangan menebak: laporkan pilihanmu di ringkasan akhir.
- Jika **Next.js 14**: pada route dinamis, ganti tipe `params` dari `Promise<{ slug: string }>` menjadi `{ slug: string }` dan hapus `await` pada `params`. Untuk Next 15/16 biarkan seperti kode (di sana `params` adalah Promise).
- Jangan menginstal ulang atau menaikkan versi Next/React.

# LANGKAH 1 — Dependensi

Install hanya dua paket ini (dengan package manager yang dipakai project):

```bash
npm install cheerio domhandler
```

`domhandler` dibutuhkan eksplisit karena `utils.ts` dan `cards.ts` memakai `import type { AnyNode } from "domhandler"`. Jangan install paket lain untuk scraping.

# LANGKAH 2 — Environment variables

Buat/update `.env.local` (dan tambahkan nama variabelnya, tanpa nilai rahasia, ke `.env.example` jika ada):

```env
# Situs sumber. Ganti jika domain berubah.
DONGHUA_BASE_URL=https://anichin.club

# WAJIB bila sumber memakai Cloudflare. Nilai diambil dari browser yang sama:
#   User-Agent  -> ketik navigator.userAgent di Console browser
#   Cookie      -> F12 > Application > Cookies > salin nilai cf_clearance
DONGHUA_USER_AGENT=
DONGHUA_CF_COOKIE=cf_clearance=ISI_DI_SINI

# Opsional: hanya untuk endpoint /api/donghua/video-source (link file video langsung)
DONGHUA_VIDEO_API=https://fastsavenow.com/wp-json/aio-dl/video-data/
DONGHUA_VIDEO_TOKEN=a9c0082f6f8e3d7d5a00924c93ffe2deb6a42080ae9a8d25af54dc0b0d46e458

# Opsional
DONGHUA_TIMEOUT_MS=15000
```

Pastikan `.env.local` ada di `.gitignore` (jangan commit cookie).

# LANGKAH 3 — Tulis file backend (salin PERSIS)

Buat semua file berikut. Urutan sudah memperhatikan dependensi antar file.

### File 1/24 — `src/lib/donghua/types.ts`

```ts
export interface HomeCard {
  title: string;
  type: string;
  headline: string;
  eps: number | null;
  thumbnail: string;
  slug: string;
}

export interface ListCard {
  title: string;
  type: string;
  headline: string;
  status: string;
  thumbnail: string;
  slug: string;
}

export interface HomeSection {
  section: string;
  cards: HomeCard[];
}

export interface HomeResponse {
  results: HomeSection[];
  page: number;
  total: number;
  source: string;
}

export interface SearchResponse {
  results: ListCard[];
  query: string;
  total: number;
  source: string;
}

export interface Genre {
  name: string;
  slug: string;
}

export interface GenresResponse {
  genres: Genre[];
  total: number;
  source: string;
}

export interface GenreResponse {
  results: ListCard[];
  slug: string;
  page: number;
  total: number;
  source: string;
}

export interface AnimeListResponse {
  results: ListCard[];
  total: number;
  source: string;
}

export interface Sinopsis {
  title: string;
  paragraphs: string[];
}

export interface InfoEpisode {
  slug: string;
  subtitle: string;
  date: string;
  episode: string | null;
  thumbnail: string;
}

export interface InfoResult {
  name: string;
  thumbnail: string;
  genre: string[];
  rating: string | null;
  sinopsis: Sinopsis;
  episode: InfoEpisode[];
  /** Field dinamis dari situs: status, studio, released, duration, type, dst. */
  [key: string]: unknown;
}

export interface InfoResponse {
  result: InfoResult;
  source: string;
}

export interface Player {
  name: string;
  url: string;
}

export interface EpisodeListItem {
  name: string;
  thumbnail: string;
  slug: string;
  subtitle: string | null;
  date: string;
  episode: string;
}

export interface EpisodeResult {
  name: string;
  genre: string[];
  rating: string | null;
  sinopsis: string;
  thumbnail: string | null;
  episode: EpisodeListItem[];
  players: Player[];
  root: string;
  [key: string]: unknown;
}

export interface EpisodeResponse {
  result: EpisodeResult;
  source: string;
}

export interface VideoSourceResponse {
  source: string;
  embed: string;
  data: Record<string, unknown>;
}
```

### File 2/24 — `src/lib/donghua/errors.ts`

```ts
export type DonghuaErrorCode =
  | "CLOUDFLARE_BLOCKED"
  | "UPSTREAM_ERROR"
  | "NOT_FOUND"
  | "PARSE_ERROR"
  | "TIMEOUT"
  | "BAD_REQUEST"
  | "CONFIG_ERROR";

export class DonghuaError extends Error {
  code: DonghuaErrorCode;
  status: number;

  constructor(code: DonghuaErrorCode, message: string, status: number) {
    super(message);
    this.name = "DonghuaError";
    this.code = code;
    this.status = status;
  }
}
```

### File 3/24 — `src/lib/donghua/config.ts`

```ts
const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/** Dibaca saat dipanggil (bukan saat module load) supaya aman di dev & serverless. */
export function getConfig() {
  return {
    baseUrl: (process.env.DONGHUA_BASE_URL || "https://anichin.club").replace(/\/+$/, ""),
    userAgent: process.env.DONGHUA_USER_AGENT || DEFAULT_UA,
    cfCookie: process.env.DONGHUA_CF_COOKIE || "",
    videoApi:
      process.env.DONGHUA_VIDEO_API || "https://fastsavenow.com/wp-json/aio-dl/video-data/",
    videoToken: process.env.DONGHUA_VIDEO_TOKEN || "",
    timeoutMs: Number(process.env.DONGHUA_TIMEOUT_MS || 15000),
  };
}
```

### File 4/24 — `src/lib/donghua/http.ts`

```ts
import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import { getConfig } from "./config";
import { DonghuaError } from "./errors";

const CACHE_TTL_MS = 60_000;
const memoryCache = new Map<string, { expires: number; html: string }>();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function looksLikeCloudflare(html: string): boolean {
  return (
    /<title>\s*Just a moment/i.test(html) ||
    html.includes("cf-browser-verification") ||
    html.includes("/cdn-cgi/challenge-platform")
  );
}

export function buildUrl(path: string, query?: Record<string, string | string[]>): string {
  const { baseUrl } = getConfig();
  const clean = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(baseUrl + clean);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      const values = Array.isArray(value) ? value : [value];
      for (const v of values) url.searchParams.append(key, v);
    }
  }
  return url.toString();
}

export function requestHeaders(): Record<string, string> {
  const { baseUrl, userAgent, cfCookie } = getConfig();
  const headers: Record<string, string> = {
    "User-Agent": userAgent,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
    Referer: baseUrl + "/",
  };
  if (cfCookie) headers["Cookie"] = cfCookie;
  return headers;
}

/** Ambil HTML mentah dengan timeout, retry 1x, dan deteksi blokir Cloudflare. */
export async function fetchHtml(
  path: string,
  query?: Record<string, string | string[]>,
): Promise<{ html: string; url: string }> {
  const url = buildUrl(path, query);
  const cached = memoryCache.get(url);
  if (cached && cached.expires > Date.now()) return { html: cached.html, url };

  const { timeoutMs } = getConfig();
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        headers: requestHeaders(),
        redirect: "follow",
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
      });
      const html = await res.text();

      if (res.status === 404) {
        throw new DonghuaError("NOT_FOUND", "Halaman tidak ditemukan di sumber.", 404);
      }
      if (res.status === 403 || res.status === 503 || looksLikeCloudflare(html)) {
        throw new DonghuaError(
          "CLOUDFLARE_BLOCKED",
          "Sumber memblokir request (Cloudflare). Isi DONGHUA_CF_COOKIE dan DONGHUA_USER_AGENT di .env.local dengan nilai dari browser kamu.",
          502,
        );
      }
      if (!res.ok) {
        throw new DonghuaError("UPSTREAM_ERROR", `Sumber membalas status ${res.status}.`, 502);
      }

      memoryCache.set(url, { expires: Date.now() + CACHE_TTL_MS, html });
      if (memoryCache.size > 200) {
        const oldest = memoryCache.keys().next().value;
        if (oldest) memoryCache.delete(oldest);
      }
      return { html, url };
    } catch (err) {
      if (err instanceof DonghuaError) throw err;
      lastError = err;
      if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
        throw new DonghuaError("TIMEOUT", "Sumber terlalu lama merespons.", 504);
      }
      if (attempt === 0) await sleep(500);
    }
  }

  const detail = lastError instanceof Error ? lastError.message : String(lastError);
  throw new DonghuaError("UPSTREAM_ERROR", `Gagal menghubungi sumber: ${detail}`, 502);
}

export async function loadHtml(
  path: string,
  query?: Record<string, string | string[]>,
): Promise<{ $: CheerioAPI; url: string }> {
  const { html, url } = await fetchHtml(path, query);
  return { $: cheerio.load(html), url };
}
```

### File 5/24 — `src/lib/donghua/utils.ts`

```ts
import type { Cheerio, CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";

export type Sel = Cheerio<AnyNode>;

const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  januari: 1, februari: 2, maret: 3, mei: 5, juni: 6, juli: 7,
  agustus: 8, oktober: 10, desember: 12,
};

/** Segmen path terakhir: "https://x.com/seri/abc/" -> "abc" */
export function slugFromUrl(href: string): string {
  try {
    const path = new URL(href, "https://placeholder.local").pathname;
    const parts = path.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : "";
  } catch {
    return "";
  }
}

/** Path penuh tanpa slash di awal/akhir: "/a/b/" -> "a/b" */
export function pathFromUrl(href: string): string {
  try {
    return new URL(href, "https://placeholder.local").pathname.replace(/^\/+|\/+$/g, "");
  } catch {
    return "";
  }
}

export function normalizeUrl(u: string): string {
  const url = u.trim();
  if (url.startsWith("//")) return "https:" + url;
  return url;
}

/** Prioritaskan atribut lazy-load; abaikan placeholder data: URI. */
export function imgSrc($img: Sel): string {
  const candidates = [
    $img.attr("data-lazy-src"),
    $img.attr("data-src"),
    $img.attr("src"),
  ];
  for (const c of candidates) {
    if (c && !c.startsWith("data:")) return normalizeUrl(c);
  }
  return "";
}

/** Teks langsung milik elemen (tanpa teks anak-anaknya). */
export function ownText($el: Sel): string {
  return $el.clone().children().remove().end().text().replace(/\s+/g, " ").trim();
}

export function toSnakeKey(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, "_");
}

/** "July 31, 2023" / "Juli 31, 2023" -> "7/31/2023". Gagal parse -> string asli. */
export function parseDateLong(input: string): string {
  const m = input.trim().match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (!m) return input.trim();
  const month = MONTHS[m[1].toLowerCase()];
  if (!month) return input.trim();
  return `${month}/${parseInt(m[2], 10)}/${m[3]}`;
}

export function decodeBase64(value: string): string {
  return Buffer.from(value, "base64").toString("utf-8");
}

/**
 * Situs menyembunyikan <select name="mirror"> di dalam script:
 *   var X = ["base64", ...]; X.forEach(v => H += String.fromCharCode(parseInt(atob(v).replace(/\D/g,'')) - 77824757));
 *   document.write(decodeURIComponent(escape(H)));
 * Fungsi ini meniru itu TANPA eval (JSON.parse saja).
 */
export function decodeObfuscatedScript(js: string): string {
  const m = js.match(/var\s+\w+\s*=\s*(\[[^\]]+\])\s*;[\s\S]*?\)\s*-\s*(\d+)/);
  if (!m) return "";
  let arr: unknown;
  try {
    arr = JSON.parse(m[1]);
  } catch {
    return "";
  }
  if (!Array.isArray(arr)) return "";
  const offset = parseInt(m[2], 10);
  const codes: number[] = [];
  for (const v of arr) {
    if (typeof v !== "string") continue;
    const digits = decodeBase64(v).replace(/\D/g, "");
    if (!digits) continue;
    codes.push(parseInt(digits, 10) - offset);
  }
  if (codes.length === 0) return "";
  const raw = String.fromCharCode(...codes);
  // escape() + decodeURIComponent() di JS asli = "anggap string sebagai byte UTF-8"
  if (codes.every((c) => c >= 0 && c < 256)) {
    return Buffer.from(raw, "latin1").toString("utf-8");
  }
  return raw;
}

/** Ambil dokumen yang berisi <select> mirror, mendekode script obfuscated bila ada. */
export function resolvePlayerDoc($: CheerioAPI, loadFn: (html: string) => CheerioAPI): CheerioAPI {
  let decoded = "";
  $("script").each((_, el) => {
    if (decoded) return;
    const text = $(el).html() || "";
    if (text.includes("document.write(decodeURIComponent(escape(")) {
      decoded = decodeObfuscatedScript(text);
    }
  });
  return decoded ? loadFn(decoded) : $;
}

export function extractInfoDetails($: CheerioAPI, scope: Sel): Record<string, string> {
  const out: Record<string, string> = {};
  scope.find("div.info-content div.spe span").each((_, el) => {
    const text = $(el).text().trim();
    const idx = text.indexOf(":");
    if (idx === -1) return;
    const key = toSnakeKey(text.slice(0, idx));
    const value = text.slice(idx + 1).trim();
    if (key && value) out[key] = value;
  });
  return out;
}

export function extractGenres($: CheerioAPI, scope: Sel): string[] {
  const genres: string[] = [];
  scope.find("div.genxed a").each((_, el) => {
    const t = $(el).text().trim();
    if (t) genres.push(t);
  });
  return genres;
}

/** "Rating 8.5" -> "8.5"; fallback ke div.numscore. */
export function extractRating($: CheerioAPI, scope: Sel): string | null {
  const box = scope.find("div.rating").first();
  if (!box.length) return null;
  const parts = box.find("strong").first().text().trim().split(/\s+/);
  if (parts.length > 1 && parts[1]) return parts[1];
  const num = box.find("div.numscore").first().text().trim();
  return num || null;
}
```

### File 6/24 — `src/lib/donghua/scrapers/cards.ts`

```ts
import type { CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";
import type { ListCard } from "../types";
import { imgSrc, ownText, slugFromUrl } from "../utils";

export interface RawCard {
  title: string;
  type: string;
  headline: string;
  statusText: string;
  thumbnail: string;
  slug: string;
}

/** Parser kartu <article> yang dipakai Home, Search, Genre, dan Anime list. */
export function parseCard($: CheerioAPI, el: AnyNode): RawCard | null {
  const $item = $(el);

  const $link = $item.find("a[title][href]").first().length
    ? $item.find("a[title][href]").first()
    : $item.find("a[href]").first();
  const href = $link.attr("href");
  if (!href) return null;
  const slug = slugFromUrl(href);
  if (!slug) return null;

  const $tt = $item.find("div.tt").first();
  const headline = $tt.find("h2").first().text().trim() || "Unknown";
  const title = ownText($tt) || $link.attr("title")?.trim() || headline;

  return {
    title,
    type: $item.find("div.typez").first().text().trim() || "Unknown",
    headline,
    statusText: $item.find("span.epx").first().text().trim() || "Unknown",
    thumbnail: imgSrc($item.find("img").first()),
    slug,
  };
}

export function toListCard(raw: RawCard): ListCard {
  return {
    title: raw.title,
    type: raw.type,
    headline: raw.headline,
    status: raw.statusText,
    thumbnail: raw.thumbnail,
    slug: raw.slug,
  };
}

/** Container daftar: `div.bixbox div.listupd` (fallback `div.listupd`). */
export function listArticles($: CheerioAPI): AnyNode[] {
  let wrapper = $("div.bixbox").first().find("div.listupd").first();
  if (!wrapper.length) wrapper = $("div.listupd").first();
  return wrapper.find("article").toArray();
}
```

### File 7/24 — `src/lib/donghua/scrapers/home.ts`

```ts
import type { HomeCard, HomeResponse, HomeSection } from "../types";
import { loadHtml } from "../http";
import { parseCard } from "./cards";

export async function getHome(page = 1): Promise<HomeResponse> {
  const path = page > 1 ? `/page/${page}/` : "/";
  const { $, url } = await loadHtml(path);

  const results: HomeSection[] = [];
  $("div.bixbox.bbnofrm").each((_, sec) => {
    const $sec = $(sec);
    const name =
      $sec
        .find("div.releases")
        .first()
        .children()
        .first()
        .text()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_") || "unknown";

    const cards: HomeCard[] = [];
    $sec.find("article").each((__, art) => {
      const raw = parseCard($, art);
      if (!raw) return;
      const digits = raw.statusText.replace(/\D/g, "");
      cards.push({
        title: raw.title,
        type: raw.type,
        headline: raw.headline,
        eps: digits ? parseInt(digits, 10) : null,
        thumbnail: raw.thumbnail,
        slug: raw.slug,
      });
    });

    if (cards.length) results.push({ section: name, cards });
  });

  return { results, page, total: results.length, source: url };
}
```

### File 8/24 — `src/lib/donghua/scrapers/search.ts`

```ts
import type { SearchResponse } from "../types";
import { loadHtml } from "../http";
import { listArticles, parseCard, toListCard } from "./cards";

export async function searchDonghua(query: string): Promise<SearchResponse> {
  const { $, url } = await loadHtml("/", { s: query });
  const results = listArticles($)
    .map((el) => parseCard($, el))
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .map(toListCard);
  return { results, query, total: results.length, source: url };
}
```

### File 9/24 — `src/lib/donghua/scrapers/genres.ts`

```ts
import type { GenreResponse, GenresResponse, Genre } from "../types";
import { loadHtml } from "../http";
import { listArticles, parseCard, toListCard } from "./cards";

function titleCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export async function listGenres(): Promise<GenresResponse> {
  const { $, url } = await loadHtml("/anime");
  const seen = new Set<string>();
  const genres: Genre[] = [];
  $('input[name="genre[]"][value]').each((_, el) => {
    const value = ($(el).attr("value") || "").trim();
    if (!value || seen.has(value)) return;
    seen.add(value);
    genres.push({ name: titleCase(value), slug: value });
  });
  return { genres, total: genres.length, source: url };
}

export async function getGenre(slug: string, page = 1): Promise<GenreResponse> {
  const query: Record<string, string | string[]> = { "genre[]": slug };
  if (page > 1) query.page = String(page);
  const { $, url } = await loadHtml("/anime", query);
  const results = listArticles($)
    .map((el) => parseCard($, el))
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .map(toListCard);
  return { results, slug, page, total: results.length, source: url };
}
```

### File 10/24 — `src/lib/donghua/scrapers/anime-list.ts`

```ts
import type { AnimeListResponse } from "../types";
import { loadHtml } from "../http";
import { listArticles, parseCard, toListCard } from "./cards";

/** params diteruskan apa adanya ke /anime (mis. genre[], status, type, order, page). */
export async function getAnimeList(
  params: Record<string, string[]> = {},
): Promise<AnimeListResponse> {
  const { $, url } = await loadHtml("/anime", params);
  const results = listArticles($)
    .map((el) => parseCard($, el))
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .map(toListCard);
  return { results, total: results.length, source: url };
}
```

### File 11/24 — `src/lib/donghua/scrapers/info.ts`

```ts
import type { InfoEpisode, InfoResponse, Sinopsis } from "../types";
import { loadHtml } from "../http";
import { DonghuaError } from "../errors";
import {
  extractGenres,
  extractInfoDetails,
  extractRating,
  imgSrc,
  parseDateLong,
  pathFromUrl,
} from "../utils";

/** Slug bisa hidup di /{slug}, /seri/{slug}/, atau /anime/{slug}/ tergantung tema situs. */
const CANDIDATE_PATHS = (slug: string) => [`/${slug}/`, `/seri/${slug}/`, `/anime/${slug}/`];

export async function getInfo(slug: string): Promise<InfoResponse> {
  for (const path of CANDIDATE_PATHS(slug)) {
    let loaded;
    try {
      loaded = await loadHtml(path);
    } catch (err) {
      if (err instanceof DonghuaError && err.code === "NOT_FOUND") continue;
      throw err;
    }
    const { $, url } = loaded;
    const $infox = $("div.infox").first();
    if (!$infox.length) continue;

    const name = $infox.find('h1.entry-title[itemprop="name"]').first().text().trim() || "Unknown Title";
    const thumbnail = imgSrc($("div.thumb img").first());

    const $syn = $('div.entry-content[itemprop="description"]').first();
    const sinopsis: Sinopsis = {
      title: $syn.find("h1").first().text().trim(),
      paragraphs: $syn.length
        ? $syn
            .find("p")
            .toArray()
            .map((p) => $(p).text().trim())
            .filter(Boolean)
        : [],
    };
    if ($syn.length && sinopsis.paragraphs.length === 0) {
      const whole = $syn.text().trim();
      if (whole) sinopsis.paragraphs = [whole];
    }

    const episode: InfoEpisode[] = [];
    $("div.eplister ul li").each((i, li) => {
      const $li = $(li);
      const href = $li.find("a").first().attr("href");
      if (!href) return;
      const dateText = $li.find("div.epl-date").first().text().trim();
      episode.push({
        slug: pathFromUrl(href).split("/").filter(Boolean).pop() || "",
        subtitle: $li.find("div.epl-title").first().text().trim() || `Episode ${i + 1}`,
        date: dateText ? parseDateLong(dateText) : "Unknown Date",
        episode: $li.find("div.epl-num").first().text().trim() || null,
        thumbnail,
      });
    });

    return {
      result: {
        ...extractInfoDetails($, $infox),
        name,
        thumbnail,
        genre: extractGenres($, $infox),
        rating: extractRating($, $.root()),
        sinopsis,
        episode,
      },
      source: url,
    };
  }

  throw new DonghuaError("NOT_FOUND", "Donghua tidak ditemukan.", 404);
}
```

### File 12/24 — `src/lib/donghua/scrapers/episode.ts`

```ts
import * as cheerio from "cheerio";
import type { EpisodeListItem, EpisodeResponse, Player } from "../types";
import { loadHtml } from "../http";
import { DonghuaError } from "../errors";
import {
  decodeBase64,
  extractGenres,
  extractInfoDetails,
  extractRating,
  imgSrc,
  normalizeUrl,
  parseDateLong,
  resolvePlayerDoc,
  slugFromUrl,
} from "../utils";

export async function getEpisode(slug: string): Promise<EpisodeResponse> {
  const { $, url } = await loadHtml(`/${slug}/`);
  const $infox = $("div.infox").first();
  if (!$infox.length) {
    throw new DonghuaError("NOT_FOUND", "Episode tidak ditemukan atau layout situs berubah.", 404);
  }

  // --- players (mirror) ---
  const $player = resolvePlayerDoc($, (html) => cheerio.load(html));
  const players: Player[] = [];
  $player('select[name="mirror"] option, select.mirror option').each((_, opt) => {
    const value = $player(opt).attr("value");
    if (!value) return;
    try {
      const $frag = cheerio.load(decodeBase64(value));
      const src = $frag("iframe").first().attr("src");
      if (src) players.push({ name: $player(opt).text().trim(), url: normalizeUrl(src) });
    } catch {
      /* lewati opsi yang rusak */
    }
  });

  // --- thumbnail ---
  let thumbnail: string | null = imgSrc($("div.thumbnail img").first()) || null;
  if (!thumbnail) thumbnail = imgSrc($("div.thumb img").first()) || null;

  // --- daftar episode lain ---
  const episode: EpisodeListItem[] = [];
  $("div.episodelist ul li").each((_, li) => {
    const $li = $(li);
    const $img = $li.find("img.ts-post-image").first();
    const href = $li.find("a").first().attr("href");
    if (!$img.length || !href) return;

    const headline = $li.find("div.playinfo span").first().text().replace(/\s+/g, " ").trim();
    let eps = "Unknown";
    let subtitle: string | null = null;
    let date = "";
    if (headline.startsWith("Ep")) {
      const parts = headline.split(" - ").map((p) => p.trim());
      eps = (parts[0] || "").replace(/\D/g, "") || "Unknown";
      subtitle = parts.length > 2 ? parts[1] || null : null;
      const rawDate = parts.length > 2 ? parts[2] : parts[1] || "";
      date = rawDate ? parseDateLong(rawDate) : "";
    }

    episode.push({
      name: $img.attr("title") || "Unknown",
      thumbnail: imgSrc($img),
      slug: slugFromUrl(href),
      subtitle,
      date,
      episode: eps,
    });
  });

  // --- slug seri induk ---
  let root = "unknown";
  const crumbs = $("div.ts-breadcrumb li");
  const crumbHref = crumbs.length > 1 ? crumbs.eq(1).find("a").attr("href") : undefined;
  if (crumbHref) root = slugFromUrl(crumbHref) || root;
  else {
    const lastYear = $("span.year a").last().attr("href");
    if (lastYear) root = slugFromUrl(lastYear) || root;
  }

  return {
    result: {
      ...extractInfoDetails($, $infox),
      name: $infox.find('h2[itemprop="partOfSeries"]').first().text().trim() || "Unknown Episode",
      genre: extractGenres($, $infox),
      rating: extractRating($, $infox),
      sinopsis: $("div.desc.mindes").first().text().replace(/\s+/g, " ").trim(),
      thumbnail,
      episode,
      players,
      root,
    },
    source: url,
  };
}
```

### File 13/24 — `src/lib/donghua/scrapers/video-source.ts`

```ts
import * as cheerio from "cheerio";
import type { VideoSourceResponse } from "../types";
import { fetchHtml, requestHeaders } from "../http";
import { getConfig } from "../config";
import { DonghuaError } from "../errors";
import { decodeBase64, normalizeUrl, resolvePlayerDoc } from "../utils";

/**
 * Cari mirror OK.ru di halaman episode, lalu minta link file video langsung
 * ke layanan pihak ketiga (DONGHUA_VIDEO_API). OPSIONAL: pemutar utama sebaiknya
 * memakai `players[].url` dari endpoint episode (iframe).
 */
export async function getVideoSource(slug: string): Promise<VideoSourceResponse> {
  const cfg = getConfig();
  if (!cfg.videoToken) {
    throw new DonghuaError("CONFIG_ERROR", "DONGHUA_VIDEO_TOKEN belum diisi di .env.local.", 500);
  }

  const { html, url } = await fetchHtml(`/${slug}/`);
  const $player = resolvePlayerDoc(cheerio.load(html), (h) => cheerio.load(h));

  let embed = "";
  $player('select[name="mirror"] option, select.mirror option').each((_, opt) => {
    if (embed) return;
    const label = $player(opt).text().trim();
    const value = $player(opt).attr("value");
    if (!value || !/ok\.?ru/i.test(label)) return;
    const src = cheerio.load(decodeBase64(value))("iframe").first().attr("src");
    if (src) embed = normalizeUrl(src);
  });
  if (!embed) {
    throw new DonghuaError("NOT_FOUND", "Mirror OK.ru tidak tersedia untuk episode ini.", 404);
  }

  const videoUrl = embed.replace("videoembed", "video");
  let res: Response;
  try {
    res = await fetch(cfg.videoApi, {
      method: "POST",
      headers: {
        "User-Agent": requestHeaders()["User-Agent"],
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ url: videoUrl, token: cfg.videoToken }).toString(),
      cache: "no-store",
      signal: AbortSignal.timeout(cfg.timeoutMs),
    });
  } catch {
    throw new DonghuaError("UPSTREAM_ERROR", "Layanan sumber video tidak bisa dihubungi.", 502);
  }
  if (!res.ok) {
    throw new DonghuaError("UPSTREAM_ERROR", `Layanan sumber video membalas status ${res.status}.`, 502);
  }

  let data: Record<string, unknown>;
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    throw new DonghuaError("PARSE_ERROR", "Balasan layanan sumber video bukan JSON.", 502);
  }

  if (Array.isArray(data.medias)) {
    data.medias = data.medias.map((m: unknown) => {
      if (m && typeof m === "object" && typeof (m as { url?: unknown }).url === "string") {
        try {
          const u = new URL((m as { url: string }).url);
          u.searchParams.set("ct", "4");
          return { ...(m as object), url: u.toString() };
        } catch {
          return m;
        }
      }
      return m;
    });
  }

  return { source: url, embed, data };
}
```

### File 14/24 — `src/lib/donghua/index.ts`

```ts
export * from "./types";
export * from "./errors";
export { getHome } from "./scrapers/home";
export { searchDonghua } from "./scrapers/search";
export { listGenres, getGenre } from "./scrapers/genres";
export { getAnimeList } from "./scrapers/anime-list";
export { getInfo } from "./scrapers/info";
export { getEpisode } from "./scrapers/episode";
export { getVideoSource } from "./scrapers/video-source";
```

### File 15/24 — `src/lib/donghua/route-helpers.ts`

```ts
import { NextResponse } from "next/server";
import { DonghuaError } from "./errors";

export function ok(data: unknown, ttlSeconds = 300) {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": `public, s-maxage=${ttlSeconds}, stale-while-revalidate=${ttlSeconds * 2}`,
    },
  });
}

export function fail(err: unknown) {
  if (err instanceof DonghuaError) {
    return NextResponse.json(
      { message: err.message, code: err.code, error: err.message },
      { status: err.status, headers: { "Cache-Control": "no-store" } },
    );
  }
  const message = err instanceof Error ? err.message : "Internal server error";
  return NextResponse.json(
    { message, code: "INTERNAL_ERROR", error: message },
    { status: 500, headers: { "Cache-Control": "no-store" } },
  );
}

export function parsePage(raw: string | null): number {
  if (!raw) return 1;
  if (!/^\d{1,4}$/.test(raw)) throw new DonghuaError("BAD_REQUEST", "Parameter page harus angka.", 400);
  return Math.max(1, parseInt(raw, 10));
}

export function assertSlug(slug: string): string {
  const s = decodeURIComponent(slug).trim();
  if (!/^[a-z0-9][a-z0-9._-]{0,199}$/i.test(s)) {
    throw new DonghuaError("BAD_REQUEST", "Slug tidak valid.", 400);
  }
  return s;
}
```

### File 16/24 — `src/lib/donghua/client.ts`

```ts
/**
 * Helper murni (tanpa import Node/cheerio) -> aman dipakai di Server maupun Client Component.
 */

export type Result<T> = { data: T; error: null } | { data: null; error: string };

/** Bungkus pemanggilan lib di Server Component agar halaman tidak crash saat sumber error. */
export async function safe<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { data: await fn(), error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
    return { data: null, error: message };
  }
}

/** Slug episode biasanya memuat "-episode-<angka>"; selain itu dianggap halaman seri. */
export function isEpisodeSlug(slug: string): boolean {
  return /-episode-\d+/i.test(slug);
}

export function donghuaHref(slug: string): string {
  return isEpisodeSlug(slug)
    ? `/donghua/watch/${encodeURIComponent(slug)}`
    : `/donghua/series/${encodeURIComponent(slug)}`;
}

/** Untuk Client Component (mis. kotak pencarian): panggil API internal. */
export async function fetchDonghua<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`/api/donghua${path}`, { signal });
  const body = (await res.json().catch(() => null)) as { message?: string } | null;
  if (!res.ok) throw new Error(body?.message || `Request gagal (${res.status}).`);
  return body as T;
}
```

### File 17/24 — `src/app/api/donghua/home/route.ts`

```ts
import type { NextRequest } from "next/server";
import { getHome } from "@/lib/donghua";
import { fail, ok, parsePage } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const page = parsePage(request.nextUrl.searchParams.get("page"));
    return ok(await getHome(page), 300);
  } catch (err) {
    return fail(err);
  }
}
```

### File 18/24 — `src/app/api/donghua/search/route.ts`

```ts
import type { NextRequest } from "next/server";
import { DonghuaError, searchDonghua } from "@/lib/donghua";
import { fail, ok } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const q = (request.nextUrl.searchParams.get("q") || "").trim();
    if (!q) throw new DonghuaError("BAD_REQUEST", "Parameter q (kata kunci) wajib diisi.", 400);
    if (q.length > 100) throw new DonghuaError("BAD_REQUEST", "Kata kunci terlalu panjang.", 400);
    return ok(await searchDonghua(q), 120);
  } catch (err) {
    return fail(err);
  }
}
```

### File 19/24 — `src/app/api/donghua/genres/route.ts`

```ts
import { listGenres } from "@/lib/donghua";
import { fail, ok } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await listGenres(), 86400);
  } catch (err) {
    return fail(err);
  }
}
```

### File 20/24 — `src/app/api/donghua/genre/[slug]/route.ts`

```ts
import type { NextRequest } from "next/server";
import { getGenre } from "@/lib/donghua";
import { assertSlug, fail, ok, parsePage } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const page = parsePage(request.nextUrl.searchParams.get("page"));
    return ok(await getGenre(assertSlug(slug), page), 600);
  } catch (err) {
    return fail(err);
  }
}
```

### File 21/24 — `src/app/api/donghua/anime/route.ts`

```ts
import type { NextRequest } from "next/server";
import { getAnimeList } from "@/lib/donghua";
import { fail, ok } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const params: Record<string, string[]> = {};
    for (const [key, value] of request.nextUrl.searchParams.entries()) {
      if (!/^[a-z_]+(\[\])?$/i.test(key) || value.length > 100) continue;
      (params[key] ||= []).push(value);
    }
    return ok(await getAnimeList(params), 600);
  } catch (err) {
    return fail(err);
  }
}
```

### File 22/24 — `src/app/api/donghua/info/[slug]/route.ts`

```ts
import { getInfo } from "@/lib/donghua";
import { assertSlug, fail, ok } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    return ok(await getInfo(assertSlug(slug)), 600);
  } catch (err) {
    return fail(err);
  }
}
```

### File 23/24 — `src/app/api/donghua/episode/[slug]/route.ts`

```ts
import { getEpisode } from "@/lib/donghua";
import { assertSlug, fail, ok } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    return ok(await getEpisode(assertSlug(slug)), 120);
  } catch (err) {
    return fail(err);
  }
}
```

### File 24/24 — `src/app/api/donghua/video-source/[slug]/route.ts`

```ts
import { getVideoSource } from "@/lib/donghua";
import { assertSlug, fail, ok } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    return ok(await getVideoSource(assertSlug(slug)), 60);
  } catch (err) {
    return fail(err);
  }
}
```


# LANGKAH 4 — Kontrak API (untuk kamu pakai saat membuat frontend)

Semua endpoint `GET`, balasan JSON. Sukses = HTTP 200 dengan bentuk di bawah. Gagal = HTTP 4xx/5xx dengan `{ "message": string, "code": string, "error": string }`.

| Endpoint | Query | Balasan sukses |
|---|---|---|
| `/api/donghua/home` | `page` (opsional, angka) | `{ results: [{ section, cards: HomeCard[] }], page, total, source }` |
| `/api/donghua/search` | `q` (wajib) | `{ results: ListCard[], query, total, source }` |
| `/api/donghua/genres` | – | `{ genres: [{ name, slug }], total, source }` |
| `/api/donghua/genre/[slug]` | `page` (opsional) | `{ results: ListCard[], slug, page, total, source }` |
| `/api/donghua/anime` | `genre[]`, `status`, `type`, `order`, `page`, dll. diteruskan ke sumber | `{ results: ListCard[], total, source }` |
| `/api/donghua/info/[slug]` | – | `{ result: { name, thumbnail, genre[], rating, sinopsis: {title, paragraphs[]}, episode: InfoEpisode[], ...status/studio/released/dll }, source }` |
| `/api/donghua/episode/[slug]` | – | `{ result: { name, thumbnail, genre[], rating, sinopsis, episode: EpisodeListItem[], players: [{name, url}], root, ... }, source }` |
| `/api/donghua/video-source/[slug]` | – | `{ source, embed, data: { medias: [...] , ... } }` (opsional/pihak ketiga) |

Kode error: `BAD_REQUEST` 400, `NOT_FOUND` 404, `CLOUDFLARE_BLOCKED` 502, `UPSTREAM_ERROR` 502, `TIMEOUT` 504, `CONFIG_ERROR` 500, `INTERNAL_ERROR` 500.

Catatan penting model data:
- `slug` pada kartu **Latest Release** biasanya slug **episode** (memuat `-episode-<angka>`), sedangkan kartu seri biasanya slug **seri**. Helper `donghuaHref(slug)` di `client.ts` sudah memilih link yang benar (`/donghua/watch/...` vs `/donghua/series/...`). Pakailah itu, jangan menebak sendiri.
- `players[].url` dari endpoint **episode** adalah URL iframe embed. Ini **pemutar utama**. Endpoint `video-source` hanya cadangan dan bisa mati sewaktu-waktu.
- Field di `info.result` selain yang tertulis (mis. `status`, `studio`, `released`, `duration`, `type`, `country`) berasal dari situs dan **bisa tidak ada**. Selalu tampilkan secara kondisional.

# LANGKAH 5 — Frontend (pakai komponen & gaya yang SUDAH ADA)

Buat halaman berikut di bawah `/donghua` (App Router). **Server Component** memanggil fungsi dari `@/lib/donghua` **langsung** (jangan fetch ke `/api/donghua` dari server sendiri), dibungkus `safe()` dari `@/lib/donghua/client`. Tambahkan `export const dynamic = "force-dynamic";` di setiap `page.tsx` yang memanggil scraper.

| Route | Isi |
|---|---|
| `/donghua` | `getHome(page)`: tampilkan tiap `section` sebagai grid kartu (judul section dari `section`, ubah `_` jadi spasi dan kapital di awal kata). Ada pagination `?page=`. |
| `/donghua/search?q=` | Form pencarian + hasil `searchDonghua(q)`. Kotak pencarian boleh Client Component yang `router.push("/donghua/search?q=...")`. |
| `/donghua/genre` | `listGenres()` sebagai chip/tombol. |
| `/donghua/genre/[slug]?page=` | `getGenre(slug, page)` + pagination. |
| `/donghua/series/[slug]` | `getInfo(slug)`: poster, judul, rating, genre (chip), field info (status, studio, dst. bila ada), sinopsis (`paragraphs`), dan daftar episode (tiap item link ke `/donghua/watch/${slug}`). |
| `/donghua/watch/[slug]` | `getEpisode(slug)`: pemutar iframe dari `players[]` dengan **tombol pilih server** (state client) + judul, daftar episode lain (`episode[]`) dan tombol "Semua episode" ke `/donghua/series/${root}` bila `root !== "unknown"`. |

Aturan UI:
- Pakai ulang komponen kartu/grid/navbar/skeleton yang ditemukan di Langkah 0. Bila tidak ada, buat komponen sederhana di `src/components/donghua/` yang mengikuti warna & font project. Jangan membuat design system baru.
- **Gambar thumbnail**: gunakan `<img>` biasa dengan `loading="lazy"` dan `referrerPolicy="no-referrer"` (beri komentar `{/* eslint-disable-next-line @next/next/no-img-element */}`), karena domain gambar berbeda-beda dan sering memblokir hotlink. Jika project sebelumnya memakai `next/image`, pakai `unoptimized` dan jangan menambahkan `remotePatterns` yang rumit. Beri fallback bila `thumbnail` kosong.
- **Iframe pemutar**: `<iframe src={url} allowFullScreen referrerPolicy="no-referrer" className="aspect-video w-full" />`. **Jangan** memakai atribut `sandbox` (banyak embed player berhenti bekerja bila di-sandbox). `url` selalu `https://`, sudah dinormalisasi oleh scraper.
- Tangani 3 keadaan di setiap halaman: **loading** (`loading.tsx` dengan skeleton), **error** (tampilkan `error` dari `safe()` dalam kotak pesan + saran "coba lagi"; bila pesan memuat "Cloudflare" tampilkan petunjuk mengisi `.env.local`), dan **kosong** ("Tidak ada hasil").
- Semua `slug` di URL dibuat dengan `encodeURIComponent` (sudah dilakukan `donghuaHref`). Di halaman dinamis, jangan lupa `await params` pada Next 15/16 (`const { slug } = await params;`), dan `await searchParams` untuk query.
- Tambahkan satu item menu "Donghua" yang menuju `/donghua` di navbar yang ada.

# LANGKAH 6 — Verifikasi (jalankan dan laporkan hasilnya)

1. `npm run build` harus sukses tanpa error TypeScript/ESLint. Jika ada error, **perbaiki di kode baru** (bukan dengan `// @ts-ignore`, bukan dengan menonaktifkan strict).
2. `npm run dev`, lalu buka dan pastikan masing-masing mengembalikan JSON (bukan halaman error):
   - `http://localhost:3000/api/donghua/home`
   - `http://localhost:3000/api/donghua/search?q=perfect`
   - `http://localhost:3000/api/donghua/genres`
   - `http://localhost:3000/api/donghua/genre/action`
   - dari hasil `home`, ambil satu `slug` lalu coba `/api/donghua/info/<slug>` dan `/api/donghua/episode/<slug>`
3. Buka `/donghua` di browser dan pastikan kartu tampil dengan gambar.

# TROUBLESHOOTING (pakai ini bila ada masalah)

| Gejala | Penyebab | Perbaikan |
|---|---|---|
| `502` + `CLOUDFLARE_BLOCKED` | Sumber meminta verifikasi Cloudflare | Isi `DONGHUA_USER_AGENT` dan `DONGHUA_CF_COOKIE` dari browser yang sama, restart `npm run dev`. Cookie cepat kedaluwarsa dan terikat ke IP/UA. Bila di-deploy ke hosting, IP datacenter bisa tetap diblok: tes lokal dulu. |
| `results: []` tapi status 200 | Layout HTML situs berubah / domain pindah | Cek `DONGHUA_BASE_URL`; bandingkan class CSS (`div.bixbox`, `div.listupd`, `article`, `div.tt`, `span.epx`) di DevTools lalu sesuaikan di `scrapers/cards.ts` saja. |
| `404 NOT_FOUND` di `/info/<slug>` | Slug itu ternyata episode, atau pola URL seri berbeda | Scraper mencoba `/{slug}/`, `/seri/{slug}/`, `/anime/{slug}/`. Tambahkan pola lain di `CANDIDATE_PATHS` pada `scrapers/info.ts`. |
| `players: []` | Struktur mirror/script berubah | Lihat HTML episode asli, cek apakah masih ada `<select name="mirror">` atau script `document.write(decodeURIComponent(escape(`. |
| Error tipe `params` saat build | Versi Next berbeda | Ikuti catatan Next 14 di Langkah 0. |
| Error tipe pada `Cheerio<AnyNode>` | Versi cheerio/domhandler berbeda | Pastikan `npm i cheerio domhandler` terpasang. Jika masih error, ubah `Sel` di `utils.ts` menjadi `ReturnType<CheerioAPI["root"]>` dan sesuaikan parameter fungsi yang memakainya; jangan pakai `any`. |
| Gambar tidak muncul | Hotlink protection | Pastikan `referrerPolicy="no-referrer"` pada `<img>`. |
| `CONFIG_ERROR` di video-source | `DONGHUA_VIDEO_TOKEN` kosong | Isi token, atau abaikan endpoint ini dan pakai `players[]`. |

# FORMAT JAWABAN YANG SAYA MINTA

1. Ringkasan audit (versi Next, router, ada/tidaknya `src/`, komponen yang dipakai ulang).
2. Daftar **semua file yang dibuat/diubah** beserta path-nya.
3. **Isi lengkap** tiap file baru dan tiap perubahan pada file lama (jangan dipotong).
4. Hasil Langkah 6 (apa yang berhasil, apa yang tidak bisa kamu verifikasi dan kenapa).
5. Jangan menambah fitur di luar permintaan ini.

=== SELESAI PROMPT ===
