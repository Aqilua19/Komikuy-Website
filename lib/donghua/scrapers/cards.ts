import type { CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";
import type { ListCard } from "../types";
import { imgSrc, ownText, slugFromUrl } from "../utils";

export interface RawCard {
  title: string;
  type: string;
  headline: string;
  statusText: string;
  thumbnail: string;
  slug: string;
}

export function parseCard($: CheerioAPI, el: AnyNode): RawCard | null {
  const $item = $(el);

  const $link = $item.find("a[title][href]").first().length
    ? $item.find("a[title][href]").first()
    : $item.find("a[href]").first();
  const href = $link.attr("href");
  if (!href) return null;
  const slug = slugFromUrl(href);
  if (!slug) return null;

  const $tt = $item.find("div.tt").first();
  const headline = $tt.find("h2").first().text().trim() || "Unknown";
  const title = ownText($tt) || $link.attr("title")?.trim() || headline;

  return {
    title,
    type: $item.find("div.typez").first().text().trim() || "Unknown",
    headline,
    statusText: $item.find("span.epx").first().text().trim() || "Unknown",
    thumbnail: imgSrc($item.find("img").first()),
    slug,
  };
}

export function toListCard(raw: RawCard): ListCard {
  return {
    title: raw.title,
    type: raw.type,
    headline: raw.headline,
    status: raw.statusText,
    thumbnail: raw.thumbnail,
    slug: raw.slug,
  };
}

export function listArticles($: CheerioAPI): AnyNode[] {
  let wrapper = $("div.bixbox").first().find("div.listupd").first();
  if (!wrapper.length) wrapper = $("div.listupd").first();
  return wrapper.find("article").toArray();
}
