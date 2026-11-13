import * as cheerio from "cheerio";
import type { VideoSourceResponse } from "../types";
import { fetchHtml, requestHeaders } from "../http";
import { getConfig } from "../config";
import { DonghuaError } from "../errors";
import { decodeBase64, normalizeUrl, resolvePlayerDoc } from "../utils";

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
