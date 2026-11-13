import type { Cheerio, CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";
import { getConfig } from "./config";

export type Sel = Cheerio<AnyNode>;

const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  januari: 1, februari: 2, maret: 3, mei: 5, juni: 6, juli: 7,
  agustus: 8, oktober: 10, desember: 12,
};

export function slugFromUrl(href: string): string {
  try {
    const path = new URL(href, "https://placeholder.local").pathname;
    const parts = path.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : "";
  } catch {
    return "";
  }
}

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
  if (url.startsWith("/")) {
    const { baseUrl } = getConfig();
    return baseUrl + url;
  }
  return url;
}

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

export function ownText($el: Sel): string {
  return $el.clone().children().remove().end().text().replace(/\s+/g, " ").trim();
}

export function toSnakeKey(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, "_");
}

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
  if (codes.every((c) => c >= 0 && c < 256)) {
    return Buffer.from(raw, "latin1").toString("utf-8");
  }
  return raw;
}

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

export function extractRating($: CheerioAPI, scope: Sel): string | null {
  const box = scope.find("div.rating").first();
  if (!box.length) return null;
  const parts = box.find("strong").first().text().trim().split(/\s+/);
  if (parts.length > 1 && parts[1]) return parts[1];
  const num = box.find("div.numscore").first().text().trim();
  return num || null;
}
