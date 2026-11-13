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
