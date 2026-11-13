export interface HomeCard {
  title: string;
  type: string;
  headline: string;
  eps: number | null;
  thumbnail: string;
  slug: string;
}

export interface ListCard {
  title: string;
  type: string;
  headline: string;
  status: string;
  thumbnail: string;
  slug: string;
}

export interface HomeSection {
  section: string;
  cards: HomeCard[];
}

export interface HomeResponse {
  results: HomeSection[];
  page: number;
  total: number;
  source: string;
}

export interface SearchResponse {
  results: ListCard[];
  query: string;
  total: number;
  source: string;
}

export interface Genre {
  name: string;
  slug: string;
}

export interface GenresResponse {
  genres: Genre[];
  total: number;
  source: string;
}

export interface GenreResponse {
  results: ListCard[];
  slug: string;
  page: number;
  total: number;
  source: string;
}

export interface AnimeListResponse {
  results: ListCard[];
  total: number;
  source: string;
}

export interface Sinopsis {
  title: string;
  paragraphs: string[];
}

export interface InfoEpisode {
  slug: string;
  subtitle: string;
  date: string;
  episode: string | null;
  thumbnail: string;
}

export interface InfoResult {
  name: string;
  thumbnail: string;
  genre: string[];
  rating: string | null;
  sinopsis: Sinopsis;
  episode: InfoEpisode[];
  [key: string]: unknown;
}

export interface InfoResponse {
  result: InfoResult;
  source: string;
}

export interface Player {
  name: string;
  url: string;
}

export interface EpisodeListItem {
  name: string;
  thumbnail: string;
  slug: string;
  subtitle: string | null;
  date: string;
  episode: string;
}

export interface EpisodeResult {
  name: string;
  genre: string[];
  rating: string | null;
  sinopsis: string;
  thumbnail: string | null;
  episode: EpisodeListItem[];
  players: Player[];
  root: string;
  [key: string]: unknown;
}

export interface EpisodeResponse {
  result: EpisodeResult;
  source: string;
}

export interface VideoSourceResponse {
  source: string;
  embed: string;
  data: Record<string, unknown>;
}
