# PROMPT: Integrasi Logic Anime (Stream, Thumbnail, Episode, Riwayat, dll) ke Website Anime + Komik

> **Cara pakai:** tempel SELURUH isi file ini ke tool AI coding kamu (satu kali). Kalau tool-nya punya batas panjang output, suruh dia mengerjakan **per FASE** (lihat bagian 11) dan lanjut ke fase berikutnya setelah fase sebelumnya selesai tanpa error. Semua kode referensi sudah ada di dalam file ini, jadi AI tidak butuh file zip aslinya.

---

## 1. PERAN & TUJUAN

Kamu adalah senior full-stack engineer. Tugasmu: **mengintegrasikan logic anime dari proyek referensi "Nontonime" ke dalam website anime + komik milikku yang sudah ada**, secara lengkap dan **tanpa error** (build lulus, tidak ada error runtime/hydration, semua halaman berfungsi).

Yang harus berhasil berjalan:

1. Mengambil data anime dari API eksternal lewat lapisan server yang aman (allowlist path, rate limit, timeout).
2. Katalog: beranda (ongoing + tamat), halaman ongoing & tamat dengan paginasi, pencarian, genre, jadwal rilis mingguan.
3. Detail anime: poster/thumbnail, info, sinopsis, daftar episode, tombol "Lanjut Eps X" / "Tonton Episode 1", rekomendasi.
4. **Streaming episode**: pilih kualitas → pilih server → ambil URL stream → putar (Video.js untuk m3u8/mp4, iframe ter-sandbox untuk embed), navigasi episode sebelumnya/selanjutnya.
5. **Thumbnail/poster** tampil benar di semua kartu, list, hero, riwayat, watchlist.
6. Download per-episode (popover, lazy fetch) dan batch download.
7. Riwayat tontonan, watchlist, subscribe + notifikasi lokal (Web Push), semuanya tersimpan di perangkat (localStorage), tanpa akun.

Ini **bukan** tugas redesign. Tampilan situsku diurus terpisah.

---

## 2. ATURAN WAJIB (TIDAK BOLEH DILANGGAR)

1. **Jangan ubah desain/UI/UX yang sudah ada** di situsku. Render semua elemen anime memakai komponen, design system, token warna, font, dan sistem ikon **yang sudah ada di project target**. Kode UI di bawah hanya *referensi perilaku*, bukan tampilan yang harus ditiru.
2. **Jangan ubah, hapus, atau menimpa** logic scrape, fitur komik, route, atau file lain yang sudah ada. Integrasi ini bersifat **menambah**. Taruh semua kode baru di modul/folder terpisah (contoh: `lib/anime/…`, `components/anime/…`) dan beri prefix/namespace bila ada risiko bentrok nama.
3. **Salin logic data persis seperti di bagian 6** (nama fungsi, bentuk data, urutan, regex allowlist). Boleh menyesuaikan *sintaks framework* (lihat bagian 8), tidak boleh mengubah *perilaku*. Perbaikan yang diizinkan hanya yang tercantum di bagian 9.
4. **Dilarang mengarang** endpoint, field, atau bentuk response di luar yang tertulis di bagian 5. Kalau perlu data yang tidak ada di kontrak, tulis sebagai catatan, jangan diimplementasi.
5. **Dilarang meng-hardcode secret** (VAPID private key, API key, dll). Semua lewat environment variable. Jangan salin nilai key dari mana pun; pakai placeholder.
6. **Dilarang menyisakan** `TODO`, placeholder, `any` sembarangan, `@ts-ignore` tanpa alasan, atau kode yang belum tersambung.
7. Setiap fase harus ditutup dengan **bukti**: `tsc --noEmit` (atau type-check bawaan framework), `lint`, dan `build` lulus. Kalau gagal, perbaiki dulu sebelum lanjut.
8. Kalau ada hal yang ambigu soal stack target, **audit dulu (Fase 0), jangan menebak**.
9. Jangan tampilkan atau klaim fitur yang belum benar-benar jalan (lihat catatan notifikasi di bagian 9).

---

## 3. REFERENSI: STACK ASLI PROYEK SUMBER

Proyek sumber memakai: **TanStack Start** (React 19, SSR, server functions) + **TanStack Router** (file-based) + **TanStack Query v5** + **TypeScript strict** + **Tailwind v4** + **Video.js 8** + **zod** + Web Push API (Service Worker + VAPID), deploy di Vercel (preset Nitro).

Konfigurasi TypeScript sumber (kode di bawah lolos di konfigurasi ini): `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, alias `@/*` → `./src/*`.

Stack **targetku bisa berbeda**. Karena itu Fase 0 (audit) wajib dikerjakan dulu, dan bagian 8 memuat tabel adaptasi.

---

## 4. ARSITEKTUR & ALUR DATA

```
Browser (React)
  │  useQuery(...)                       ← queries.ts  (kunci cache + staleTime)
  ▼
fetchAnimeApi({ data: { path } })        ← anime.functions.ts  (server function / API route)
  ▼
requestUpstream(path)                    ← anime.server.ts  (allowlist → rate limit → fetch → validasi)
  ▼
https://www.sankavollerei.web.id/anime{path}      (API eksternal pihak ketiga)
```

**Kunci arsitektur:** browser tidak pernah memanggil API eksternal langsung. Semua lewat satu pintu server yang hanya menerima path yang cocok allowlist. Ini yang mencegah server dipakai sebagai open proxy.

**Alur streaming:**

```
/watch/:episodeId
  └─ GET /episode/:episodeId  → { server.qualities[ { title, serverList[ { title, serverId } ] } ], prev/nextEpisode, animeId, downloadUrl }
       └─ user pilih kualitas → serverList kualitas itu → pilih serverId (default: server pertama)
            └─ GET /server/:serverId → { url }          (TIDAK boleh di-cache: staleTime 0, gcTime 0)
                 ├─ url berakhiran .m3u8 / .mp4  → Video.js (NativePlayer)
                 └─ selain itu                    → <iframe sandbox ...>
```

**Dua kali `.data`:** `useQuery` mengembalikan envelope API di `query.data`, dan payload sebenarnya ada di `query.data.data`. Contoh: `episode.data.data.title`. Ini disengaja. Jangan "disederhanakan", karena akan memecahkan seluruh halaman.

---

## 5. KONTRAK API UPSTREAM

Base URL: `https://www.sankavollerei.web.id/anime` (API pihak ketiga, tidak resmi; bisa berubah atau mati sewaktu-waktu, jadikan base URL satu konstanta).

| Path (setelah base) | Dipakai untuk | Payload di `envelope.data` |
|---|---|---|
| `/home` | Beranda | `{ ongoing: { animeList }, completed: { animeList } }` |
| `/ongoing-anime?page=N` | Halaman ongoing | `{ animeList }` + `envelope.pagination` |
| `/complete-anime?page=N` | Halaman tamat | `{ animeList }` + `envelope.pagination` |
| `/search/:term` | Pencarian (`term` di-`encodeURIComponent`) | `{ animeList }` |
| `/genre` | Daftar genre | `{ genreList: [{ title, genreId }] }` |
| `/genre/:genreId?page=N` | Anime per genre | `{ animeList }` + `pagination` |
| `/schedule` | Jadwal rilis | **array** `ScheduleDay[]` dengan `anime_list: [{ title, slug, poster }]` |
| `/anime/:animeId` | Detail anime | `AnimeDetail` |
| `/episode/:episodeId` | Detail episode + daftar server + link download | `EpisodeDetail` |
| `/server/:serverId` | URL stream untuk satu server | `{ url }` |
| `/batch/:batchId` | Link batch download | `BatchDetail` |

Catatan kontrak yang sering bikin error kalau terlewat:

- `schedule` memakai **snake_case** (`anime_list`) dan field **`slug`** (bukan `animeId`). Di halaman jadwal, `slug` dipakai sebagai `animeId` saat membuat link.
- `pagination` ada di level envelope (sejajar `data`), bukan di dalam `data`.
- `views`, `episodes`, `score` bisa `number | string | null`. Selalu lewat `formatViews` / pengecekan null.
- `batch` pada detail anime bisa `null` (tidak semua anime punya batch).
- `episodeId`, `animeId`, `serverId`, `batchId` adalah slug string; jangan diubah/di-parse.
- Respons error upstream ditandai `ok === false` atau `data` kosong; ditangani `requestUpstream`.

---

## 6. KODE REFERENSI: LAYER DATA (SALIN PERSIS, LALU ADAPTASI SINTAKS SESUAI BAGIAN 8)

### 6.1 `lib/anime-types.ts`: tipe data (salin 100%, tidak bergantung framework)

```ts
export interface ApiEnvelope<T> {
  ok?: boolean;
  status?: string;
  statusCode?: number;
  message?: string;
  data: T;
  pagination?: Pagination | null;
}

export interface Pagination {
  currentPage: number;
  hasPrevPage: boolean;
  prevPage: number | null;
  hasNextPage: boolean;
  nextPage: number | null;
  totalPages: number;
}

export interface Genre {
  title: string;
  genreId: string;
}

export interface AnimeCardData {
  title: string;
  poster: string;
  animeId: string;
  episodes?: number | null;
  releaseDay?: string;
  latestReleaseDate?: string;
  lastReleaseDate?: string;
  status?: string;
  score?: string;
  genreList?: Genre[];
}

export interface HomeData {
  ongoing: { animeList: AnimeCardData[] };
  completed: { animeList: AnimeCardData[] };
}

export interface AnimeListData {
  animeList: AnimeCardData[];
}

export interface EpisodeListItem {
  title: string;
  eps: number;
  date?: string;
  episodeId: string;
  views?: number | string | null;
}

export interface AnimeDetail {
  title: string;
  poster: string;
  japanese: string;
  score: string;
  producers: string;
  type: string;
  status: string;
  episodes: number | null;
  duration: string;
  aired: string;
  studios: string;
  views?: number | string | null;
  batch: { batchId: string; title?: string } | null;
  synopsis: { paragraphs: string[] };
  genreList: Genre[];
  episodeList: EpisodeListItem[];
  recommendedAnimeList?: AnimeCardData[];
}

export interface DownloadFormatGroup {
  formats: {
    title: string;
    qualities: { title: string; size: string; urls: { title: string; url: string }[] }[];
  }[];
}

export interface ServerItem {
  title: string;
  serverId: string;
}

export interface QualityGroup {
  title: string;
  serverList: ServerItem[];
}

export interface EpisodeDetail {
  title: string;
  animeId: string;
  releaseTime?: string;
  defaultStreamingUrl?: string;
  hasPrevEpisode: boolean;
  prevEpisode: { episodeId: string } | null;
  hasNextEpisode: boolean;
  nextEpisode: { episodeId: string } | null;
  server: { qualities: QualityGroup[] };
  downloadUrl?: DownloadFormatGroup | null;
  info?: Record<string, unknown>;
}

export interface ScheduleDay {
  day: string;
  anime_list: { title: string; slug: string; poster: string }[];
}

export interface BatchDetail {
  title: string;
  animeId: string;
  poster: string;
  japanese?: string;
  type?: string;
  score?: string;
  episodes?: number | null;
  duration?: string;
  studios?: string;
  producers?: string;
  aired?: string;
  genreList?: Genre[];
  downloadUrl: DownloadFormatGroup;
}

```

### 6.2 `lib/anime.server.ts`: pintu server (allowlist + rate limit + timeout)

Ini file paling kritis. **Jangan melonggarkan regex allowlist.** Hanya `getRequestHeader` yang boleh diganti sesuai framework.

```ts
import { getRequestHeader } from "@tanstack/react-start/server";

const BASE_URL = "https://www.sankavollerei.web.id/anime";

const ALLOWED: RegExp[] = [
  /^\/home$/,
  /^\/ongoing-anime\?page=\d{1,4}$/,
  /^\/complete-anime\?page=\d{1,4}$/,
  /^\/search\/[^/]{1,100}$/,
  /^\/genre$/,
  /^\/genre\/[a-z0-9-]{1,60}\?page=\d{1,4}$/,
  /^\/schedule$/,
  /^\/anime\/[A-Za-z0-9-_.]{1,120}$/,
  /^\/episode\/[A-Za-z0-9-_.]{1,120}$/,
  /^\/server\/[A-Za-z0-9-_.]{1,120}$/,
  /^\/batch\/[A-Za-z0-9-_.]{1,120}$/,
];

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const buckets = new Map<string, { count: number; resetAt: number }>();

function clientKey() {
  const forwarded = getRequestHeader("x-forwarded-for") ?? "";
  return (
    getRequestHeader("cf-connecting-ip") ??
    forwarded.split(",")[0]?.trim() ??
    "anonymous"
  );
}

function checkRateLimit() {
  const key = clientKey();
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  bucket.count += 1;
  if (bucket.count > MAX_REQUESTS) {
    throw new Error("Terlalu banyak permintaan. Coba lagi dalam satu menit.");
  }
}

export async function requestUpstream(path: string) {
  if (!ALLOWED.some((pattern) => pattern.test(path))) {
    throw new Error("Permintaan tidak dikenali.");
  }
  checkRateLimit();

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    throw new Error("Sumber data sedang tidak dapat dihubungi.");
  }

  if (!response.ok) {
    throw new Error("Sumber data sedang bermasalah. Coba lagi nanti.");
  }

  const json = (await response.json()) as { ok?: boolean; data?: unknown; message?: string };
  if (json.ok === false || json.data === undefined || json.data === null) {
    throw new Error(json.message?.trim() || "Data tidak ditemukan.");
  }
  return json;
}

```

### 6.3 `lib/anime.functions.ts`: server function (versi TanStack Start)

Di stack lain, bagian ini diganti menurut bagian 8, tetapi **kontraknya harus tetap**: sebuah fungsi `fetchAnimeApi({ data: { path } })` yang mengembalikan envelope JSON dari `requestUpstream(path)`. Dengan begitu `queries.ts` tidak perlu diubah sama sekali.

```ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestUpstream } from "./anime.server";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const pathSchema = z.object({ path: z.string().min(1).max(200) });

export const fetchAnimeApi = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => pathSchema.parse(data))
  .handler(async ({ data }) => {
    const result = await requestUpstream(data.path);
    return result as unknown as { [key: string]: Json };
  });

```

### 6.4 `lib/queries.ts`: kunci cache & aturan cache (salin persis)

Perhatikan: `episodeQuery` dan `streamQuery` sengaja `staleTime: 0` (dan `streamQuery` juga `gcTime: 0`) karena URL stream dan daftar server bersifat sementara. **Jangan di-cache.**

```ts
import { queryOptions } from "@tanstack/react-query";
import { fetchAnimeApi } from "./anime.functions";
import type {
  AnimeDetail,
  AnimeListData,
  ApiEnvelope,
  BatchDetail,
  EpisodeDetail,
  Genre,
  HomeData,
  ScheduleDay,
} from "./anime-types";

async function get<T>(path: string) {
  return (await fetchAnimeApi({ data: { path } })) as unknown as ApiEnvelope<T>;
}

const common = { staleTime: 5 * 60 * 1000, retry: 1 };

export const homeQuery = () =>
  queryOptions({ queryKey: ["home"], queryFn: () => get<HomeData>("/home"), ...common });

export const ongoingQuery = (page: number) =>
  queryOptions({
    queryKey: ["ongoing", page],
    queryFn: () => get<AnimeListData>(`/ongoing-anime?page=${page}`),
    ...common,
  });

export const completedQuery = (page: number) =>
  queryOptions({
    queryKey: ["completed", page],
    queryFn: () => get<AnimeListData>(`/complete-anime?page=${page}`),
    ...common,
  });

export const searchQuery = (term: string) =>
  queryOptions({
    queryKey: ["search", term],
    queryFn: () => get<AnimeListData>(`/search/${encodeURIComponent(term)}`),
    enabled: term.trim().length > 0,
    ...common,
  });

export const genreListQuery = () =>
  queryOptions({
    queryKey: ["genres"],
    queryFn: () => get<{ genreList: Genre[] }>("/genre"),
    ...common,
  });

export const genreAnimeQuery = (genreId: string, page: number) =>
  queryOptions({
    queryKey: ["genre", genreId, page],
    queryFn: () => get<AnimeListData>(`/genre/${genreId}?page=${page}`),
    ...common,
  });

export const scheduleQuery = () =>
  queryOptions({
    queryKey: ["schedule"],
    queryFn: () => get<ScheduleDay[]>("/schedule"),
    ...common,
  });

export const animeDetailQuery = (animeId: string) =>
  queryOptions({
    queryKey: ["anime", animeId],
    queryFn: () => get<AnimeDetail>(`/anime/${animeId}`),
    ...common,
  });

export const episodeQuery = (episodeId: string) =>
  queryOptions({
    queryKey: ["episode", episodeId],
    queryFn: () => get<EpisodeDetail>(`/episode/${episodeId}`),
    staleTime: 0,
    retry: 1,
  });

export const streamQuery = (serverId: string | null) =>
  queryOptions({
    queryKey: ["server", serverId],
    queryFn: () => get<{ url: string }>(`/server/${serverId}`),
    enabled: Boolean(serverId),
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  });

export const batchQuery = (batchId: string) =>
  queryOptions({
    queryKey: ["batch", batchId],
    queryFn: () => get<BatchDetail>(`/batch/${batchId}`),
    ...common,
  });

```

### 6.5 `lib/utils.ts`: helper

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatViews(views: number | string) {
  const n = typeof views === "string" ? parseFloat(views.replace(/[^\d.]/g, "")) : views;
  if (!Number.isFinite(n)) return String(views);
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}Jt`;
  return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

```

---

## 7. KODE REFERENSI: LOGIC FITUR

> Bagian ini adalah **perilaku** yang harus dipertahankan. Kelas CSS, ikon, dan markup dibuang; kamu menyusun ulang tampilannya dengan komponen milik project target. Logic (state, effect, urutan, kondisi, key penyimpanan, nama event) harus sama.

### 7.1 Streaming: state kualitas, server, dan URL stream (halaman nonton)

Potongan ini adalah inti pemilihan kualitas/server. Perhatikan: (a) state di-reset saat `episodeId` berganti, (b) kualitas default = kualitas pertama yang punya server, server default = server pertama, (c) `streamQuery(serverId)` baru jalan setelah `serverId` terisi, (d) riwayat disimpan hanya setelah **episode dan anime** sama-sama sudah termuat.

```tsx
function WatchPage() {
  const { episodeId } = Route.useParams();
  const episode = useQuery(episodeQuery(episodeId));
  const [quality, setQuality] = useState<string | null>(null);
  const [serverId, setServerId] = useState<string | null>(null);

  const qualities = episode.data?.data.server?.qualities ?? [];

  useEffect(() => {
    setQuality(null);
    setServerId(null);
  }, [episodeId]);

  useEffect(() => {
    if (quality || qualities.length === 0) return;
    const preferred = qualities.find((item) => item.serverList.length > 0) ?? qualities[0];
    if (!preferred) return;
    setQuality(preferred.title);
    setServerId(preferred.serverList[0]?.serverId ?? null);
  }, [qualities, quality]);

  const activeServers = useMemo(
    () => qualities.find((item) => item.title === quality)?.serverList ?? [],
    [qualities, quality],
  );

  const stream = useQuery(streamQuery(serverId));
  const animeId = episode.data?.data.animeId ?? "";
  const anime = useQuery({ ...animeDetailQuery(animeId), enabled: Boolean(animeId) });

  useEffect(() => {
    if (!episode.data || !anime.data) return;
    saveHistory({
      episodeId,
      animeId: episode.data.data.animeId,
      animeTitle: anime.data.data.title,
      episodeTitle: episode.data.data.title,
      poster: anime.data.data.poster,
      watchedAt: Date.now(),
    });
  }, [episode.data, anime.data, episodeId]);


```

Nilai turunan yang dipakai setelah data siap (urutan penting, jangan diubah):

```tsx
const data = episode.data.data;
const episodes = anime.data?.data.episodeList ?? [];
const activeEpisode = episodes.find((ep) => ep.episodeId === episodeId);
const batchId = anime.data?.data.batch?.batchId ?? null;
const firstParagraph = anime.data?.data.synopsis.paragraphs[0];
// prev/next: data.hasPrevEpisode && data.prevEpisode  → link ke data.prevEpisode.episodeId
//            data.hasNextEpisode && data.nextEpisode  → link ke data.nextEpisode.episodeId
// daftar episode di bawah player: diurutkan naik berdasarkan `eps`, episode aktif ditandai
```

### 7.2 Pemutar video (Video.js untuk file langsung, iframe untuk embed)

Aturan: URL yang cocok `/\.(m3u8|mp4)(\?|$)/i` diputar dengan Video.js; selain itu dirender di `iframe` dengan `sandbox` dan `referrerPolicy="no-referrer"`. **Jangan menambah `allow-popups` / `allow-top-navigation`** ke sandbox (itu yang memblokir pop-up iklan dan redirect dari host embed). `<iframe key={src}>` wajib agar iframe dibuat ulang saat server diganti. Instance Video.js wajib di-`dispose()` di cleanup effect.

```tsx
import { useEffect, useRef } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

function isDirectSource(url: string) {
  return /\.(m3u8|mp4)(\?|$)/i.test(url);
}

function NativePlayer({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const element = document.createElement("video-js");
    element.classList.add("vjs-big-play-centered", "h-full", "w-full");
    containerRef.current.appendChild(element);

    const player = videojs(element, {
      controls: true,
      fluid: false,
      preload: "auto",
      playsinline: true,
      sources: [{ src, type: src.includes(".m3u8") ? "application/x-mpegURL" : "video/mp4" }],
    });
    playerRef.current = player;

    return () => {
      player.dispose();
      playerRef.current = null;
    };
  }, [src]);

  return <div ref={containerRef} className="h-full w-full" data-vjs-player />;
}

export function VideoPlayer({ src }: { src: string | null }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
      {!src ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
          <i className="fa-solid fa-circle-notch fa-spin text-2xl text-primary" />
          Menyiapkan pemutar video
        </div>
      ) : isDirectSource(src) ? (
        <NativePlayer src={src} />
      ) : (
        <iframe
          key={src}
          src={src}
          title="Pemutar video"
          className="h-full w-full border-0"
          allowFullScreen
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
        />
      )}
    </div>
  );
}

```

### 7.3 Thumbnail / poster

Tidak ada proxy atau transformasi gambar. Field `poster` dari API dipakai langsung sebagai `src` `<img>`. Aturan yang berlaku di semua tempat:

- Rasio kartu **2:3** (`aspect-ratio: 2/3`), `object-fit: cover`, `loading="lazy"`, atribut `alt` = judul anime.
- Hero halaman detail: poster yang sama sebagai backdrop lebar dengan gradasi ke warna latar di bagian bawah.
- Riwayat dan watchlist **menyimpan salinan URL poster** (`poster` di tiap item). Jadi URL yang tersimpan bisa suatu saat mati; lihat perbaikan fallback di bagian 9.
- Di `AnimeCard`: meta = `episodes` ("N episode") bila ada, jika tidak `status`, jika tidak `releaseDay`. Skor (`score`) ditampilkan sebagai lencana di sudut poster bila ada.
- Di baris hasil pencarian: meta = `status ?? latestReleaseDate ?? releaseDay`.

### 7.4 Riwayat tontonan (`lib/history.ts`), salin persis

Key localStorage: `nonton-history-v1`. Maksimum 100 item. Setiap perubahan memancarkan event `history-updated` di `window`. Setiap pembacaan dibungkus `typeof window` + `try/catch`, dan **pembacaan di komponen selalu di dalam `useEffect`** supaya tidak ada hydration mismatch saat SSR.

```ts
const STORAGE_KEY = "nonton-history-v1";

export interface HistoryItem {
  episodeId: string;
  animeId: string;
  animeTitle: string;
  episodeTitle: string;
  poster: string;
  watchedAt: number;
}

export function readHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed.sort((a, b) => b.watchedAt - a.watchedAt) : [];
  } catch {
    return [];
  }
}

function write(items: HistoryItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 100)));
  window.dispatchEvent(new Event("history-updated"));
}

export function saveHistory(item: HistoryItem) {
  if (typeof window === "undefined") return;
  const items = readHistory().filter((entry) => entry.episodeId !== item.episodeId);
  write([item, ...items]);
}

export function removeHistory(episodeId: string) {
  write(readHistory().filter((entry) => entry.episodeId !== episodeId));
}

export function clearHistory() {
  write([]);
}

```

### 7.5 Watchlist (`lib/watchlist.ts`), salin persis

Key: `nonton-watchlist-v1`, event: `watchlist-updated`.

```ts
const STORAGE_KEY = "nonton-watchlist-v1";

export interface WatchlistItem {
  animeId: string;
  title: string;
  poster: string;
  addedAt: number;
}

export function readWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WatchlistItem[];
    return Array.isArray(parsed) ? parsed.sort((a, b) => b.addedAt - a.addedAt) : [];
  } catch {
    return [];
  }
}

function write(items: WatchlistItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("watchlist-updated"));
}

export function isInWatchlist(animeId: string) {
  return readWatchlist().some((item) => item.animeId === animeId);
}

export function addToWatchlist(animeId: string, title: string, poster: string) {
  if (typeof window === "undefined") return;
  const items = readWatchlist().filter((entry) => entry.animeId !== animeId);
  write([{ animeId, title, poster, addedAt: Date.now() }, ...items]);
}

export function removeFromWatchlist(animeId: string) {
  write(readWatchlist().filter((entry) => entry.animeId !== animeId));
}

export function toggleWatchlist(animeId: string, title: string, poster: string) {
  if (isInWatchlist(animeId)) {
    removeFromWatchlist(animeId);
    return false;
  }
  addToWatchlist(animeId, title, poster);
  return true;
}

```

### 7.6 Subscription (`lib/subscriptions.ts`), salin persis

Key: `nonton-subs-v1`, event: `subs-updated`.

```ts
const STORAGE_KEY = "nonton-subs-v1";

export interface SubscriptionItem {
  animeId: string;
  animeTitle: string;
  subscribedAt: number;
}

export function readSubscriptions(): SubscriptionItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SubscriptionItem[];
    return Array.isArray(parsed) ? parsed.sort((a, b) => b.subscribedAt - a.subscribedAt) : [];
  } catch {
    return [];
  }
}

function write(items: SubscriptionItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("subs-updated"));
}

export function isSubscribed(animeId: string) {
  return readSubscriptions().some((item) => item.animeId === animeId);
}

export function addSubscription(animeId: string, animeTitle: string) {
  if (typeof window === "undefined") return;
  const items = readSubscriptions().filter((entry) => entry.animeId !== animeId);
  write([{ animeId, animeTitle, subscribedAt: Date.now() }, ...items]);
}

export function removeSubscription(animeId: string) {
  write(readSubscriptions().filter((entry) => entry.animeId !== animeId));
}

```

### 7.7 Web Push + notifikasi lokal (`lib/push.ts`), salin lalu sesuaikan env var (bagian 8)

Ini Web Push standar browser (Service Worker + VAPID), **bukan Firebase**. Tidak ada library tambahan di sisi client.

```ts
const SW_PATH = "/sw.js";

function urlBase64ToUint8Array(base64Url: string) {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function getPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function registerServiceWorker() {
  if (!isPushSupported()) return null;
  return navigator.serviceWorker.register(SW_PATH);
}

export async function requestNotificationPermission() {
  if (!isPushSupported()) return "unsupported" as const;
  return Notification.requestPermission();
}

// Membuat PushSubscription asli lewat browser Push API (VAPID) — bukan Firebase Cloud
// Messaging. Kunci publik VAPID dibaca dari VITE_VAPID_PUBLIC_KEY (lihat .env.example).
// TODO: kirim subscription ini ke server buat disimpan, supaya bisa dipakai ngirim push
// beneran nanti (butuh database + cron cek episode baru — belum ada di project ini).
export async function subscribeToPush() {
  const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;
  if (!vapidKey) return null;

  const registration = await registerServiceWorker();
  if (!registration) return null;

  const existing = await registration.pushManager.getSubscription();
  if (existing) return existing;

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidKey),
  });
}

export async function unsubscribeFromPush() {
  if (!isPushSupported()) return;
  const registration = await navigator.serviceWorker.getRegistration(SW_PATH);
  const subscription = await registration?.pushManager.getSubscription();
  await subscription?.unsubscribe();
}

// Notifikasi lokal langsung (muncul di bar notifikasi HP) tanpa perlu round-trip ke
// server — dipakai buat konfirmasi aksi (subscribe berhasil) dan tombol uji coba.
export async function showLocalNotification(title: string, options?: NotificationOptions) {
  if (!isPushSupported() || Notification.permission !== "granted") return false;
  const registration = await registerServiceWorker();
  if (!registration) return false;
  await registration.showNotification(title, {
    icon: "/logo.svg",
    badge: "/logo.svg",
    ...options,
  });
  return true;
}

```

### 7.8 Service Worker (`public/sw.js`), taruh di root publik situs

Menangani `push` (menampilkan notifikasi) dan `notificationclick` (fokus/buka halaman). **Cek dulu apakah situs sudah punya service worker** (PWA plugin, next-pwa, Workbox, dll). Kalau sudah ada, **gabungkan handler `push` + `notificationclick` ke SW yang ada**, jangan menimpa atau mendaftarkan dua SW di scope yang sama.

```js
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = { title: "Nontonime", body: "Ada update baru.", url: "/" };
  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch {
      payload.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/logo.svg",
      badge: "/logo.svg",
      data: { url: payload.url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    }),
  );
});

```

### 7.9 Logic detail anime: "Lanjut/Tonton", status, batch

Aturan: tombol utama = "Lanjut Eps X" bila riwayat punya episode anime ini **dan** episode itu masih ada di `episodeList`; jika tidak, "Tonton Episode N" dengan N = episode ber-`eps` **terkecil** (bukan elemen pertama array, karena urutan array dari API bisa terbalik).

```tsx
function AnimeDetailPage() {
  const { animeId } = Route.useParams();
  const { data, isPending, error, refetch } = useQuery(animeDetailQuery(animeId));
  const [continueItem, setContinueItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    setContinueItem(readHistory().find((item) => item.animeId === animeId) ?? null);
  }, [animeId]);

  if (isPending) return <LoadingState label="Memuat detail anime" />;
  if (error)
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <ErrorState error={error} onRetry={() => refetch()} />
      </div>
    );

  const anime = data.data;
  const episodes = anime.episodeList ?? [];
  const firstEpisode = episodes.length
    ? episodes.reduce((earliest, episode) => (episode.eps < earliest.eps ? episode : earliest), episodes[0]!)
    : null;
  const continueEpisode = continueItem
    ? episodes.find((episode) => episode.episodeId === continueItem.episodeId)
    : undefined;
  const primaryTarget = continueEpisode ?? firstEpisode;
  const primaryLabel = continueEpisode
    ? `Lanjut Eps ${continueEpisode.eps}`
    : firstEpisode
      ? `Tonton Episode ${firstEpisode.eps}`
      : null;
  const isCompleted = /tamat|complete/i.test(anime.status ?? "");
  const batchId = anime.batch?.batchId ?? null;
  // ...render UI (hero, badge info, chip genre, tombol, sinopsis, daftar episode, rekomendasi)
}

```

Tombol simpan (watchlist) dan subscribe:

```tsx
function WatchlistButton({ animeId, title, poster }: { animeId: string; title: string; poster: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInWatchlist(animeId));
  }, [animeId]);

  return (
    <button
      onClick={() => setSaved(toggleWatchlist(animeId, title, poster))}
      aria-label={saved ? "Hapus dari watchlist" : "Simpan ke watchlist"}
      className={cn(
        "press-soft inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-border shadow-sm transition-colors",
        saved ? "bg-secondary text-secondary-foreground" : "bg-card text-card-foreground hover:bg-accent",
      )}
    >
      <i className={saved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"} />
    </button>
  );
}

function SubscribeButton({ animeId, animeTitle }: { animeId: string; animeTitle: string }) {
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSubscribed(isSubscribed(animeId));
  }, [animeId]);

  async function handleClick() {
    if (subscribed) {
      removeSubscription(animeId);
      setSubscribed(false);
      return;
    }

    setBusy(true);
    try {
      const permission = await requestNotificationPermission();
      if (permission === "granted") {
        // Subscribe beneran ke Web Push (VAPID) — bukan Firebase. Menyimpan
        // subscription-nya di server buat trigger pas episode baru rilis
        // TODO: butuh backend (database + cron) yang belum ada di project ini.
        await subscribeToPush();
        await showLocalNotification("Berlangganan aktif", {
          body: `Kamu bakal dapat notifikasi untuk ${animeTitle}.`,
        });
      }
      addSubscription(animeId, animeTitle);
      setSubscribed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={cn(
        "press-soft inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold shadow-sm transition-colors disabled:opacity-60 sm:w-auto",
        subscribed ? "bg-secondary text-secondary-foreground" : "bg-card text-card-foreground hover:bg-accent",
      )}
    >
      <i className={subscribed ? "fa-solid fa-bell" : "fa-regular fa-bell"} />
      {subscribed ? "Berlangganan" : "Subscribe"}
    </button>
  );
}

```

### 7.10 Download per-episode (lazy) dan batch

Link download per episode **tidak** diambil saat daftar dirender. Detail episode baru di-fetch **saat popover dibuka** (`enabled: open`). Hasilnya `downloadUrl.formats[].qualities[].urls[]`. Jika kosong/gagal dan anime punya `batchId`, arahkan ke halaman batch. Semua link keluar memakai `target="_blank"` dan `rel="noopener noreferrer"`.

```tsx
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { episodeQuery } from "@/lib/queries";
import type { EpisodeListItem } from "@/lib/anime-types";

export function EpisodeDownloadButton({
  episode,
  batchId,
}: {
  episode: EpisodeListItem;
  batchId?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const { data, isPending, isError } = useQuery({ ...episodeQuery(episode.episodeId), enabled: open });
  const formats = data?.data.downloadUrl?.formats ?? [];
  // ...render popover: isPending -> loading | isError atau formats kosong -> fallback ke batch | selain itu -> format -> kualitas -> tautan
}

```

Halaman batch: `batchQuery(batchId)` → tampilkan `title`, `poster`, ringkasan (`type · N episode · duration`), tautan kembali ke detail anime (`animeId`), lalu `downloadUrl.formats[]` → `qualities[]` (judul + `size`) → `urls[]`.

### 7.11 Paginasi, pencarian, jadwal

```ts
// validateSearch (ongoing, tamat, genre/:id): page selalu angka valid >= 1
page: Number(search["page"] ?? 1) || 1

// Pagination
const canPrev = page > 1;
const canNext = hasNext ?? (totalPages ? page < totalPages : false);
// hasNext = envelope.pagination?.hasNextPage, totalPages = envelope.pagination?.totalPages

// Pencarian: param `q`; query hanya aktif bila q.trim().length > 0;
// submit form → navigasi dengan q yang sudah di-trim.
// Status tampilan: q kosong | loading | error | ada hasil (dengan jumlah) | tidak ditemukan.

// Jadwal: tiap hari { day, anime_list[] }; link ke detail pakai `slug` sebagai animeId.
```

### 7.12 Berbagi (Share)

`navigator.share({ title, text, url: location.href })` bila tersedia (batal oleh pengguna = diam, tanpa fallback); jika tidak, salin `location.href` ke clipboard dan tampilkan status "Tersalin" selama 2 detik.

---

## 8. ADAPTASI PER STACK (WAJIB BACA SEBELUM MENULIS KODE)

Yang boleh berubah hanya **sintaks framework**; perilaku dan kontrak data tetap.

| Bagian | TanStack Start (asli) | Next.js App Router | Vite/React SPA (tanpa server) |
|---|---|---|---|
| Pintu server | `createServerFn` di `anime.functions.ts` | Route Handler `app/api/anime/route.ts` (GET) | Serverless function / Express route (mis. `api/anime.ts` di Vercel). **Browser tidak boleh memanggil upstream langsung** |
| Header klien (rate limit) | `getRequestHeader()` | `request.headers.get(...)` | `req.headers[...]` |
| `fetchAnimeApi` di client | server fn otomatis | wrapper `fetch("/api/anime?path=" + encodeURIComponent(path))` | sama dengan Next |
| Env VAPID publik | `import.meta.env.VITE_VAPID_PUBLIC_KEY` | `process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY` | `import.meta.env.VITE_VAPID_PUBLIC_KEY` |
| Routing | `createFileRoute` + `Link to/params` | `app/…/page.tsx` + `<Link href>` | sesuai router yang dipakai (React Router, dll) |
| Meta/SEO per halaman | `head()` | `generateMetadata` | `document.title` / helmet |
| Search param | `validateSearch` + `Route.useSearch()` | `useSearchParams()` + validasi manual | sesuai router |
| Navigasi programatik | `useNavigate()` | `useRouter().push()` | sesuai router |
| Komponen berstatus/DOM | normal | **wajib `"use client"`** | normal |
| Video.js | impor biasa | `dynamic(() => import(...), { ssr: false })` | impor biasa |
| CSS Video.js | `import "video.js/dist/video-js.css"` | boleh di komponen client (App Router) | impor biasa |
| Gambar poster | `<img>` | pakai `<img>` biasa (host poster beragam). Jangan pakai `next/image` kecuali semua host sudah didaftarkan di `images.remotePatterns` hasil pengamatan nyata | `<img>` |

**Bentuk wajib `fetchAnimeApi` di stack non-TanStack** (agar `queries.ts` tetap identik):

```ts
// client wrapper
export async function fetchAnimeApi({ data }: { data: { path: string } }) {
  const res = await fetch(`/api/anime?path=${encodeURIComponent(data.path)}`);
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || "Terjadi kesalahan saat mengambil data.");
  }
  return json; // envelope penuh: { ok, data, pagination, ... }
}
```

```ts
// contoh Route Handler Next.js (inti saja)
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  try {
    const result = await requestUpstream(path, request.headers); // allowlist + rate limit di dalamnya
    return Response.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Terjadi kesalahan.";
    const status = message.startsWith("Terlalu banyak") ? 429 : message.startsWith("Permintaan tidak dikenali") ? 400 : 502;
    return Response.json({ ok: false, message }, { status });
  }
}
```

Catatan penting:

- Pesan error berbahasa Indonesia dari `requestUpstream` **harus sampai ke UI** (`ErrorState` membaca `error.message`).
- `QueryClientProvider` harus ada di akar aplikasi. Kalau sudah ada, **pakai yang ada**; jangan membuat provider kedua. Di Next, buat client provider dengan `useState(() => new QueryClient())`.
- Kalau project target bukan React, port logic yang sama ke padanannya (store/composable) dengan **kontrak data, key cache, dan aturan cache yang identik**.
- Cek alias import target (`@/` atau `~/` atau relatif) dan sesuaikan semua import. Jangan membiarkan satu pun import gagal resolve.

---

## 9. PERBAIKAN YANG DIIZINKAN SAAT PORTING (satu per satu, tidak lebih)

1. **"Hari Ini" di jadwal.** Sumber menghitung hari di level modul (`const TODAY = new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(new Date())`). Di server (zona UTC) hasilnya bisa beda dengan browser pengguna WIB, jadi sorotan "Hari Ini" salah di dini hari dan memicu hydration warning. **Hitung di client** (`useEffect` + `useState`) dengan `timeZone: "Asia/Jakarta"`, dan jangan render penanda "Hari Ini" sebelum nilainya dihitung.
2. **Pemutar yang menggantung.** Bila episode tidak punya kualitas/server, atau `streamQuery` error, sumber menampilkan spinner "Menyiapkan pemutar video" selamanya. Tambahkan keadaan jelas: "Server tidak tersedia untuk episode ini" dan "Server ini gagal diputar, coba server lain". Tambahkan juga listener `error` pada Video.js untuk keadaan kedua. Jangan mengubah urutan pemilihan kualitas/server.
3. **Pembersihan rate-limit.** `buckets` (Map in-memory) tidak pernah dibersihkan. Tambahkan pemangkasan entri kedaluwarsa (misalnya saat ukuran Map melewati 1000). Aturan limit (60 request / 60 detik per klien) tetap.
4. **Kejujuran fitur notifikasi.** Sumber hanya: meminta izin, membuat Push Subscription, menyimpan daftar subscribe di perangkat, dan menampilkan **notifikasi lokal** (konfirmasi + tombol tes). **Belum ada** backend yang mengirim push saat episode baru rilis. Jangan menulis teks UI yang menjanjikan notifikasi otomatis. Cukup tampilkan status "tersimpan di perangkat ini". (Pengiriman push otomatis adalah Fase 8 yang opsional.)
5. **Fallback poster.** Tambahkan `onError` pada `<img>` poster (kartu, hero, riwayat, watchlist) untuk beralih ke placeholder dari design system project. Boleh menambah `referrerPolicy="no-referrer"` **hanya setelah** diuji bahwa poster memang gagal karena hotlink. Jangan menulis ulang URL (`http://` → `https://`) secara membabi buta; uji dulu.
6. **Sinkron antar tab (opsional).** Selain event kustom (`history-updated`, `watchlist-updated`, `subs-updated`), boleh menambah listener `storage` agar tab lain ikut ter-update.
7. **Secret.** Jangan salin kunci VAPID dari proyek sumber. Buat pasangan baru (`npx web-push generate-vapid-keys`). Kunci **publik** → env client; kunci **privat** → hanya secret server dan hanya bila Fase 8 dikerjakan.
8. **`defaultStreamingUrl` (opsional).** Field ini ada di tipe `EpisodeDetail` tetapi tidak dipakai sumber. Boleh dipakai sebagai cadangan terakhir **hanya jika terbukti bisa diputar** saat pengujian; kalau tidak, abaikan.

Di luar daftar ini: **jangan "memperbaiki" atau merapikan logic lain.**

---

## 10. SPESIFIKASI PERILAKU PER HALAMAN (logic saja; tampilan pakai komponen project)

| Halaman | Data & perilaku wajib |
|---|---|
| Beranda | `homeQuery`. Bagian "Lanjutkan Nonton" dari `readHistory().slice(0, 10)`, ter-sync via event `history-updated`, disembunyikan bila kosong. Seksi "Sedang Tayang" (`ongoing.animeList`) dan "Baru Tamat" (`completed.animeList`) dengan tautan "Lihat semua" ke halaman masing-masing (page 1). |
| Ongoing / Tamat | `ongoingQuery(page)` / `completedQuery(page)` + paginasi (7.11). |
| Genre (daftar) | `genreListQuery` → grid tautan ke genre dengan `page: 1`. |
| Genre (detail) | `genreAnimeQuery(genreId, page)` + paginasi; judul dari `genreId` (tanda `-` jadi spasi). |
| Cari | Lihat 7.11. |
| Jadwal | `scheduleQuery`; per hari tampilkan jumlah anime; sorot hari ini (perbaikan 9.1). |
| Detail anime | `animeDetailQuery`; badge info (skor, studio, tayang, tipe, jumlah episode, durasi, views); chip genre → halaman genre; tombol utama/subscribe/watchlist (7.9); tombol batch bila `batchId`; sinopsis dapat dilipat (4 baris → penuh); daftar episode dengan tombol Tonton + Download; rekomendasi (`recommendedAnimeList`). |
| Nonton | Lihat 7.1–7.2; judul = judul anime (fallback judul episode); "Episode N" dan views dari `activeEpisode`; pilihan kualitas dan server; share; download episode aktif; prev/next; grid episode; kartu ringkas anime di bawah. |
| Download (indeks) | Halaman kosong informatif yang mengarahkan ke detail anime; tidak ada data. |
| Download (batch) | Lihat 7.10. |
| Riwayat | `readHistory()` dikelompokkan per hari: "Hari ini", "Kemarin", "N hari lalu" (2–6), selebihnya tanggal panjang `id-ID`. Hapus satu, hapus semua. Teks catatan: riwayat hanya di perangkat ini. |
| Watchlist | `readWatchlist()` → grid + tombol hapus. |
| Profil | Jumlah episode ditonton / watchlist / subscribe; izin notifikasi (`getPermission`, `requestNotificationPermission`, tombol tes → `showLocalNotification`); daftar subscribe dengan tombol hapus. **Pengaturan tema: lewati bila project sudah punya sistem tema**; jangan membuat sistem tema kedua. |

**Bentrok rute:** situsku kemungkinan sudah punya rute seperti `/genre`, `/riwayat`, `/watchlist`, `/profil`, `/cari`, `/download` (misalnya untuk komik). Di Fase 0 petakan semua rute yang ada. Kalau ada yang bentrok, pindahkan **seluruh** rute anime ke satu prefix (mis. `/anime/...` atau `/nonton/...`) lewat satu konstanta `ANIME_BASE_PATH`, dan perbarui semua tautan secara konsisten. Jangan menimpa rute yang sudah ada.

---

## 11. FASE KERJA (kerjakan berurutan; berhenti dan perbaiki bila ada error)

**Fase 0: Audit (tanpa menulis kode fitur).** Laporkan dalam tabel ringkas: framework + versi, bahasa/strictness TypeScript, router, alias import, state/data library (sudah ada React Query atau belum), sistem styling & komponen UI, sistem ikon, sistem tema, daftar rute yang ada, apakah ada service worker/PWA, ada tidaknya CSP/header keamanan, platform deploy, lokasi logic scrape yang ada (yang **tidak boleh disentuh**), dan paket yang perlu ditambah. Tentukan juga strategi nama/prefix rute yang tidak bentrok.

**Fase 1: Layer data.** Pasang dependensi (lampiran A). Buat `anime-types`, `anime.server` (+ perbaikan 9.3), pintu server/API, `fetchAnimeApi`, `queries`, `utils`. Pastikan `QueryClientProvider` ada. *Lulus bila:* memanggil `/home`, `/schedule`, `/anime/<id>` lewat pintu server mengembalikan envelope benar; path di luar allowlist ditolak dengan pesan "Permintaan tidak dikenali."; request ke-61 dalam semenit ditolak.

**Fase 2: Katalog.** Beranda, ongoing, tamat, genre (daftar + detail), cari, jadwal (dengan perbaikan 9.1), komponen kartu/grid/baris/paginasi/state (loading, error + coba lagi). *Lulus bila:* semua halaman tampil dengan poster, paginasi bekerja, error upstream menampilkan pesan + tombol coba lagi, tidak ada hydration warning.

**Fase 3: Detail anime + thumbnail.** Halaman detail lengkap, sinopsis lipat, daftar episode, rekomendasi, fallback poster (9.5). *Lulus bila:* semua informasi muncul, poster rusak diganti placeholder, tombol utama memilih episode yang benar.

**Fase 4: Streaming.** Halaman nonton, `VideoPlayer` (7.2) dengan perbaikan 9.2, pemilihan kualitas/server, prev/next, grid episode, share. *Lulus bila:* ganti kualitas dan server memuat stream baru; sumber `.m3u8`/`.mp4` diputar di Video.js; sumber embed diputar di iframe; ganti episode tidak meninggalkan stream lama; episode tanpa server menampilkan keadaan kosong (bukan spinner abadi).

**Fase 5: Download.** Popover per-episode (lazy), halaman batch, halaman indeks download. *Lulus bila:* tidak ada request detail episode sebelum popover dibuka; fallback ke batch bekerja.

**Fase 6: Riwayat & watchlist.** Kedua library, halaman riwayat/watchlist, "Lanjutkan Nonton" di beranda, tombol simpan di detail. *Lulus bila:* data bertahan setelah refresh, maksimum 100 riwayat, hapus satu/semua jalan, tanpa hydration warning.

**Fase 7: Subscribe + notifikasi lokal.** `subscriptions`, `push` (env var disesuaikan), `sw.js` (digabung bila SW sudah ada), tombol subscribe, kartu notifikasi di profil, dengan teks jujur (9.4). *Lulus bila:* izin diminta saat subscribe, notifikasi lokal muncul, daftar subscribe bisa dihapus, tidak ada SW ganda.

**Fase 8 (OPSIONAL, kerjakan hanya bila aku minta):** pengiriman push otomatis: endpoint penyimpan `PushSubscription` + database + cron pengecek episode baru + library `web-push` di server memakai kunci privat dari secret server.

**Fase 9: Pengerasan & uji akhir.** Jalankan seluruh checklist bagian 12 dan skenario bagian 13 pada **build produksi**, bukan hanya dev.

---

## 12. CHECKLIST ANTI-ERROR

**Build & tipe**
- [ ] `tsc --noEmit`, lint, dan `build` produksi lulus tanpa error.
- [ ] Semua import ter-resolve (alias benar); tidak ada import ke file yang belum dibuat.
- [ ] Penanganan `noUncheckedIndexedAccess` (mis. `serverList[0]?.serverId`) dipertahankan.
- [ ] Dependensi terpasang dengan versi kompatibel (lampiran A); lockfile ter-update.

**SSR / hydration**
- [ ] `localStorage`, `window`, `navigator`, `Notification`, `document` hanya disentuh di `useEffect`/event handler, atau di balik `typeof window !== "undefined"`.
- [ ] Tidak ada nilai yang bergantung waktu/zona waktu dirender saat SSR (lihat 9.1).
- [ ] Komponen yang memakai hooks/DOM diberi `"use client"` (Next) dan Video.js dimuat tanpa SSR.

**Jaringan & keamanan**
- [ ] Browser tidak pernah memanggil API upstream langsung; hanya lewat pintu server.
- [ ] Regex allowlist identik dengan 6.2; tidak ada parameter yang bisa membentuk URL arbitrer (anti-SSRF).
- [ ] Tidak ada secret di kode, repo, atau env berawalan `NEXT_PUBLIC_`/`VITE_` selain kunci VAPID **publik**.
- [ ] Bila situs memakai CSP: izinkan `img-src` (host poster), `frame-src` (host embed), `media-src` + `connect-src` (host HLS/MP4) sesuai hasil pengamatan; jangan menebak host.
- [ ] Tidak ada mixed content (halaman https memuat resource http).

**Runtime**
- [ ] Tidak ada error/warning di console pada alur normal.
- [ ] Tidak ada `QueryClientProvider` ganda, tidak ada service worker ganda.
- [ ] Instance Video.js di-dispose saat unmount/ganti sumber; tidak ada kebocoran.
- [ ] Rute anime tidak menimpa rute komik/situs yang ada; fitur komik tetap berjalan seperti sebelumnya.

---

## 13. SKENARIO UJI AKHIR (jalankan semua, laporkan hasilnya)

1. Buka beranda → poster tampil; klik satu anime → halaman detail lengkap.
2. Klik "Tonton Episode N" → halaman nonton memuat stream; ganti kualitas lalu server → stream berganti.
3. Tonton sebuah episode, kembali ke detail → tombol berubah jadi "Lanjut Eps N"; beranda menampilkan "Lanjutkan Nonton".
4. Uji episode sebelumnya/selanjutnya dan klik nomor di grid episode.
5. Cari judul yang ada, judul yang tidak ada, dan kata kunci kosong.
6. Ongoing/Tamat/Genre: pindah halaman maju-mundur; URL dengan `?page=abc` jatuh ke halaman 1.
7. Jadwal: hari ini tersorot benar (uji juga di dini hari WIB / zona waktu berbeda).
8. Buka popover download di episode → link muncul; uji anime tanpa link per-episode → fallback batch.
9. Tambah/hapus watchlist, hapus riwayat satu & semua; refresh halaman → data bertahan.
10. Subscribe → izin notifikasi → notifikasi lokal muncul; hapus subscribe dari profil.
11. Matikan jaringan / simulasikan upstream error → pesan error Indonesia + tombol "Coba lagi" muncul, halaman tidak crash.
12. Kirim request manual ke pintu server dengan path di luar allowlist → ditolak.
13. Poster dengan URL rusak → placeholder muncul.
14. Pastikan fitur komik dan logic scrape yang sudah ada berjalan persis seperti sebelum integrasi.

---

## 14. FORMAT LAPORAN DARI KAMU (AI)

Di akhir **setiap fase**, laporkan singkat: (1) daftar file yang dibuat/diubah (path lengkap), (2) hasil `tsc`/lint/build, (3) skenario yang lulus, (4) hal yang butuh keputusanku. Di akhir semua fase, beri ringkasan arsitektur akhir, daftar env var yang harus kuisi, dan daftar risiko yang tersisa.

---

## LAMPIRAN A: Dependensi

Wajib (React): `@tanstack/react-query@^5`, `video.js@^8`, `@types/video.js` (dev), `zod@^3` (validasi input pintu server; boleh dilewati bila validasi manual setara).
Khusus TanStack Start (hanya bila target memang TanStack Start): `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/router-plugin`.
Opsional: `clsx` + `tailwind-merge` (helper `cn`; lewati bila project sudah punya).
Jangan memasang ikon/CSS tambahan bila project sudah punya sistem sendiri (sumber memakai Font Awesome via CDN hanya untuk ikon).

## LAMPIRAN B: Environment variable (isi sendiri, jangan salin nilai dari mana pun)

```
# Client (aman publik). Nama variabel mengikuti framework target (lihat bagian 8)
VITE_VAPID_PUBLIC_KEY=
# atau NEXT_PUBLIC_VAPID_PUBLIC_KEY=

# Server saja. Hanya diperlukan jika Fase 8 dikerjakan
VAPID_PRIVATE_KEY=
```

Buat pasangan kunci baru: `npx web-push generate-vapid-keys`.
