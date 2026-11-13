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
