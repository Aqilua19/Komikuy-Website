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
