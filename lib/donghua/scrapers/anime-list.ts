import type { AnimeListResponse } from "../types";
import { loadHtml } from "../http";
import { listArticles, parseCard, toListCard } from "./cards";

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
