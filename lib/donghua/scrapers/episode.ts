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
      if (src && !src.includes("player-placeholder")) {
        players.push({ name: $player(opt).text().trim(), url: normalizeUrl(src) });
      }
    } catch {
      /* lewati opsi yang rusak */
    }
  });

  if (players.length === 0) {
    const defaultSrc = $("div#pembed iframe, div.player-embed iframe, div#embed_holder iframe").first().attr("src");
    if (defaultSrc && !defaultSrc.includes("player-placeholder")) {
      players.push({ name: "Default Server", url: normalizeUrl(defaultSrc) });
    }
  }

  // Prioritize OK.ru and other open embeds over Dailymotion
  players.sort((a, b) => {
    const scoreA = /ok\.?ru/i.test(a.name) ? 2 : !/dailymotion/i.test(a.name) ? 1 : 0;
    const scoreB = /ok\.?ru/i.test(b.name) ? 2 : !/dailymotion/i.test(b.name) ? 1 : 0;
    return scoreB - scoreA;
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
