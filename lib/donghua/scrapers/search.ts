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
