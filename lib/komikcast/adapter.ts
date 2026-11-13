import { scraper } from './scraper';
import { Comic, ComicListResponse, ChapterDetail } from '@/types/comic';
import { WEBTOON_SERIES, getSeriesBySlug } from '../comics-data';

export class ComicAdapter {
  async searchComics(query: string, page = 1): Promise<ComicListResponse> {
    const q = (query || '').toLowerCase().trim();
    const localMatches = WEBTOON_SERIES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.genres.some((g) => g.toLowerCase().includes(q)) ||
        s.author.toLowerCase().includes(q)
    ).map((s) => this.mapWebtoonToComic(s));

    try {
      const res = await scraper.search(query, page);
      const d = res.data;
      const scraped = (d.results || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        url: item.url,
        poster: item.poster,
        type: item.type,
        status: item.status,
        rating: item.rating ? parseFloat(item.rating) : null,
        release_year: item.release_year ? parseInt(item.release_year, 10) : null,
        author: item.author || null,
        artist: item.artist || null,
        genres: item.genres || [],
        last_chapter: item.last_chapter,
      }));

      const combined = [...scraped];
      for (const item of localMatches) {
        if (!combined.some((c) => c.slug === item.slug)) {
          combined.push(item);
        }
      }

      return {
        data: combined,
        pagination: {
          current_page: d.current_page || 1,
          last_page: d.last_page || 1,
          per_page: combined.length,
          total: (d.total_results || scraped.length) + localMatches.length,
        },
      };
    } catch {
      return {
        data: localMatches,
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: localMatches.length,
          total: localMatches.length,
        },
      };
    }
  }

  async getLatestComics(page = 1): Promise<ComicListResponse> {
    try {
      const res = await scraper.latest(page);
      const d = res.data;
      const items = (d.results || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        url: item.url,
        poster: item.poster,
        type: item.type,
        status: item.status,
        rating: item.rating ? parseFloat(item.rating) : null,
        release_year: item.release_year ? parseInt(item.release_year, 10) : null,
        author: item.author || null,
        artist: item.artist || null,
        genres: item.genres || [],
        last_chapter: item.last_chapter,
      }));

      return {
        data: items.length > 0 ? items : WEBTOON_SERIES.map((s) => this.mapWebtoonToComic(s)),
        pagination: {
          current_page: d.page || 1,
          last_page: d.last_page || 1,
          per_page: items.length || 24,
          total: d.total || WEBTOON_SERIES.length,
        },
      };
    } catch {
      return {
        data: WEBTOON_SERIES.map((s) => this.mapWebtoonToComic(s)),
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: WEBTOON_SERIES.length,
          total: WEBTOON_SERIES.length,
        },
      };
    }
  }

  async getPopularComics(page = 1): Promise<ComicListResponse> {
    try {
      const res = await scraper.popular(page);
      const d = res.data;
      const items = (d.results || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        url: item.url,
        poster: item.poster,
        type: item.type,
        status: item.status,
        rating: item.rating ? parseFloat(item.rating) : null,
        release_year: item.release_year ? parseInt(item.release_year, 10) : null,
        author: item.author || null,
        artist: item.artist || null,
        genres: item.genres || [],
        last_chapter: item.last_chapter,
      }));

      return {
        data: items.length > 0 ? items : WEBTOON_SERIES.map((s) => this.mapWebtoonToComic(s)),
        pagination: {
          current_page: d.page || 1,
          last_page: d.last_page || 1,
          per_page: items.length || 24,
          total: d.total || WEBTOON_SERIES.length,
        },
      };
    } catch {
      return {
        data: WEBTOON_SERIES.map((s) => this.mapWebtoonToComic(s)),
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: WEBTOON_SERIES.length,
          total: WEBTOON_SERIES.length,
        },
      };
    }
  }

  async getMangaDetail(slug: string): Promise<Comic | null> {
    const local = getSeriesBySlug(slug);

    try {
      const res = await scraper.detail(slug);
      const d = res.data;
      if (d) {
        return {
          id: d.id,
          title: d.title,
          slug: d.slug,
          url: d.url,
          poster: d.poster,
          type: d.type,
          status: d.status,
          rating: d.rating ? parseFloat(d.rating) : null,
          release_year: d.release_year ? parseInt(d.release_year, 10) : null,
          author: d.author,
          artist: d.artist,
          genres: (d.genres || []).map((g: any) => (typeof g === 'string' ? g : g.name)),
          synopsis: d.synopsis,
          views: d.views_count ? String(d.views_count) : undefined,
          total_chapters: d.total_chapters || d.chapters?.length || 0,
          first_chapter: d.first_chapter
            ? {
                id: d.first_chapter.chapter_number,
                title: `Chapter ${d.first_chapter.chapter_number}`,
                chapter_number: d.first_chapter.chapter_number,
                url: d.first_chapter.url,
              }
            : null,
          last_chapter: d.chapters && d.chapters.length > 0 ? d.chapters[0] : null,
          chapters: (d.chapters || []).map((c: any) => ({
            id: c.id,
            title: c.title || `Chapter ${c.chapter_number}`,
            chapter_number: c.chapter_number,
            url: c.url,
            views: c.views_count ? String(c.views_count) : undefined,
            release_date: c.created_at || undefined,
          })),
        };
      }
    } catch {
      // ignore
    }

    if (local) return this.mapWebtoonToComic(local);
    return null;
  }

  async getChapterDetail(slug: string, chapterNumber: string | number): Promise<ChapterDetail | null> {
    const num = typeof chapterNumber === 'string' ? parseInt(chapterNumber, 10) : chapterNumber;
    const local = getSeriesBySlug(slug);

    try {
      const [res, detailRes] = await Promise.all([
        scraper.chapter(slug, chapterNumber),
        scraper.detail(slug).catch(() => null)
      ]);
      const d = res.data;
      const detailData = detailRes?.data;

      if (d && d.images && d.images.length > 0) {
        const mangaSlug = d.manga_slug || slug;
        const prevChNum = d.navigation?.prev ? d.navigation.prev.split('/').pop() || '' : null;
        const nextChNum = d.navigation?.next ? d.navigation.next.split('/').pop() || '' : null;
        const chapterList = (d.chapters && d.chapters.length > 0 ? d.chapters : detailData?.chapters || []).map((c: any) => ({
          id: c.id,
          title: c.title || `Chapter ${c.chapter_number}`,
          chapter_number: c.chapter_number,
          url: `/series/${mangaSlug}/episode/${c.chapter_number}`,
          release_date: c.created_at,
        }));

        return {
          manga_title: d.manga_title || detailData?.title || local?.title || 'Komik',
          manga_slug: mangaSlug,
          chapter_title: d.chapter_title || `Chapter ${d.chapter_number}`,
          chapter_number: d.chapter_number,
          image_count: d.total_images || d.images?.length || 0,
          images: (d.images || []).map((img: any) => ({
            order: img.order,
            url: img.url,
            fallback_url: img.fallback_url,
            bytes: img.bytes,
          })),
          navigation: {
            prev: prevChNum ? { 
              chapter_number: prevChNum, 
              slug: mangaSlug, 
              url: `/series/${mangaSlug}/episode/${prevChNum}` 
            } : null,
            next: nextChNum ? { 
              chapter_number: nextChNum, 
              slug: mangaSlug, 
              url: `/series/${mangaSlug}/episode/${nextChNum}` 
            } : null,
          },
          all_chapters: chapterList,
        } as ChapterDetail;
      }
    } catch {
      // ignore
    }

    if (local) {
      const ep = local.episodes.find((e) => e.chapter_number === num) || local.episodes[0];
      const prevEp = local.episodes.find((e) => e.chapter_number === num - 1);
      const nextEp = local.episodes.find((e) => e.chapter_number === num + 1);

      return {
        manga_title: local.title,
        manga_slug: local.slug,
        chapter_title: ep ? ep.title : `Episode ${num}`,
        chapter_number: num,
        image_count: ep?.images.length || 8,
        images: (ep?.images || []).map((img) => ({
          order: img.order,
          url: img.url,
        })),
        navigation: {
          prev: prevEp ? { 
            chapter_number: prevEp.chapter_number, 
            slug: local.slug, 
            url: `/series/${local.slug}/episode/${prevEp.chapter_number}` 
          } : null,
          next: nextEp ? { 
            chapter_number: nextEp.chapter_number, 
            slug: local.slug, 
            url: `/series/${local.slug}/episode/${nextEp.chapter_number}` 
          } : null,
        },
        all_chapters: local.episodes.map((e) => ({
          id: e.id,
          title: e.title,
          chapter_number: e.chapter_number,
          url: `/series/${local.slug}/episode/${e.chapter_number}`,
          release_date: e.release_date,
        })),
      } as ChapterDetail;

    }
    return null;
  }

  private mapWebtoonToComic(s: (typeof WEBTOON_SERIES)[0]): Comic {
    return {
      id: s.id,
      title: s.title,
      slug: s.slug,
      url: `/series/${s.slug}`,
      poster: s.poster,
      type: 'Webtoon',
      status: s.status,
      rating: s.rating,
      release_year: 2026,
      author: s.author,
      artist: s.artist || null,
      genres: s.genres,
      synopsis: s.synopsis,
      views: s.views,
      total_chapters: s.episodes.length,
      first_chapter: s.episodes.length > 0 ? {
        id: s.episodes[s.episodes.length - 1].id,
        title: s.episodes[s.episodes.length - 1].title,
        chapter_number: s.episodes[s.episodes.length - 1].chapter_number,
        url: `/series/${s.slug}/episode/${s.episodes[s.episodes.length - 1].chapter_number}`,
      } : null,
      last_chapter: s.episodes.length > 0 ? {
        id: s.episodes[0].id,
        title: s.episodes[0].title,
        chapter_number: s.episodes[0].chapter_number,
        url: `/series/${s.slug}/episode/${s.episodes[0].chapter_number}`,
      } : null,
      chapters: s.episodes.map((e) => ({
        id: e.id,
        title: e.title,
        chapter_number: e.chapter_number,
        url: `/series/${s.slug}/episode/${e.chapter_number}`,
        release_date: e.release_date,
        views: e.views,
      })),
    };
  }
}

export const comicAdapter = new ComicAdapter();
