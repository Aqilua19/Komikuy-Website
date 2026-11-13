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
