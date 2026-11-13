export type ChapterSummary = {
  id: number | string;
  title: string;
  chapter_number: number | string;
  url: string;
  release_date?: string;
  views?: string;
};

export type Comic = {
  id: number | string;
  title: string;
  slug: string;
  url: string;
  poster: string | null;
  type: string | null;
  status: string | null;
  rating: number | null;
  release_year: number | null;
  author: string | null;
  artist: string | null;
  genres: string[];
  last_chapter: ChapterSummary | null;
  synopsis?: string;
  views?: string;
  total_chapters?: number;
  first_chapter?: ChapterSummary | null;
  chapters?: ChapterSummary[];
};

export type ChapterImage = {
  order: number;
  url: string;
  fallback_url?: string;
  bytes?: number;
};

export type ChapterDetail = {
  manga_title: string;
  manga_slug: string;
  chapter_title: string;
  chapter_number: number | string;
  image_count: number;
  images: ChapterImage[];
  navigation: {
    prev: { chapter_number: number | string; slug: string; url?: string } | null;
    next: { chapter_number: number | string; slug: string; url?: string } | null;
  };
  all_chapters?: ChapterSummary[];
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ComicListResponse = {
  data: Comic[];
  pagination: PaginationMeta;
};

export type ReaderSettingsType = {
  background: 'dark' | 'black' | 'sepia' | 'light';
  imageWidth: 'compact' | 'normal' | 'wide' | 'full';
  pageGap: 'none' | 'small' | 'medium' | 'large';
  autoHideControls: boolean;
};

export type LibraryItem = {
  slug: string;
  title: string;
  poster: string | null;
  lastReadChapter: {
    chapter_number: number | string;
    title: string;
  };
  addedAt: number;
  updatedAt: number;
};

export type HistoryItem = {
  slug: string;
  title: string;
  poster: string | null;
  chapter_number: number | string;
  chapter_title: string;
  timestamp: number;
};
