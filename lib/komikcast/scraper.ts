/**
 * Komikcast Scraper (Inertia.js SSR State Bypass)
 * Target: https://komikcast.info
 * Author: Vamz Spectre (VamxAPI)
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';

export class KomikcastScraper {
  public baseUrl: string;
  public timeout: number;
  public userAgent: string;

  constructor(options: { baseUrl?: string; timeout?: number; userAgent?: string } = {}) {
    this.baseUrl = options.baseUrl || 'https://komikcast.info';
    this.timeout = options.timeout || 15000;
    this.userAgent = options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
  }

  /**
   * Internal request to fetch and parse Inertia.js data-page props
   */
  fetchProps(endpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const targetUrl = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
      const client = targetUrl.startsWith('https') ? https : http;

      const req = client.get(targetUrl, {
        timeout: this.timeout,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
          'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"'
        }
      }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, targetUrl).toString();
          return resolve(this.fetchProps(redirectUrl));
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Gagal menghubungi Komikcast (HTTP ${res.statusCode})`));
        }

        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const match = body.match(/data-page="([^"]+)"/);
            if (!match) {
              return reject(new Error('Gagal mengekstrak data-page dari respons Komikcast.'));
            }

            const decoded = match[1]
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&#039;/g, "'");

            const pageJson = JSON.parse(decoded);
            resolve(pageJson.props || {});
          } catch (err: any) {
            reject(new Error(`Gagal mem-parsing data Komikcast: ${err.message}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout saat menghubungi Komikcast.'));
      });
    });
  }

  /**
   * Search manga by keyword
   */
  async search(query: string, page = 1) {
    if (!query) throw new Error('Query pencarian manga tidak boleh kosong.');
    const props = await this.fetchProps(`/manga?search=${encodeURIComponent(query)}&page=${page}`);
    const mangas = props.mangas || {};
    const items = (mangas.data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      url: `${this.baseUrl}/manga/${item.slug}`,
      poster: item.poster,
      type: item.type,
      status: item.status,
      rating: item.rating,
      release_year: item.release_year,
      author: item.author,
      artist: item.artist,
      genres: (item.genres || []).map((g: any) => g.name),
      last_chapter: item.last_chapter ? {
        id: item.last_chapter.id,
        title: item.last_chapter.title,
        chapter_number: item.last_chapter.chapter_number,
        url: `${this.baseUrl}/manga/${item.slug}/chapter/${item.last_chapter.chapter_number}`
      } : null
    }));

    return {
      status: true,
      creator: 'Vamz Spectre',
      data: {
        query,
        current_page: mangas.current_page || 1,
        last_page: mangas.last_page || 1,
        total_results: mangas.total || items.length,
        results: items
      }
    };
  }

  /**
   * Get latest updated mangas
   */
  async latest(page = 1) {
    const props = await this.fetchProps(`/manga?sort=latest&page=${page}`);
    const mangas = props.mangas || {};
    const items = (mangas.data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      url: `${this.baseUrl}/manga/${item.slug}`,
      poster: item.poster,
      type: item.type,
      status: item.status,
      rating: item.rating,
      genres: (item.genres || []).map((g: any) => g.name),
      last_chapter: item.last_chapter ? {
        id: item.last_chapter.id,
        title: item.last_chapter.title,
        chapter_number: item.last_chapter.chapter_number,
        url: `${this.baseUrl}/manga/${item.slug}/chapter/${item.last_chapter.chapter_number}`
      } : null
    }));

    return {
      status: true,
      creator: 'Vamz Spectre',
      data: {
        page: mangas.current_page || 1,
        last_page: mangas.last_page || 1,
        total: mangas.total || items.length,
        results: items
      }
    };
  }

  /**
   * Get popular mangas
   */
  async popular(page = 1) {
    const props = await this.fetchProps(`/manga?sort=popular&page=${page}`);
    const mangas = props.mangas || {};
    const items = (mangas.data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      url: `${this.baseUrl}/manga/${item.slug}`,
      poster: item.poster,
      type: item.type,
      status: item.status,
      rating: item.rating,
      genres: (item.genres || []).map((g: any) => g.name),
      last_chapter: item.last_chapter ? {
        id: item.last_chapter.id,
        title: item.last_chapter.title,
        chapter_number: item.last_chapter.chapter_number,
        url: `${this.baseUrl}/manga/${item.slug}/chapter/${item.last_chapter.chapter_number}`
      } : null
    }));

    return {
      status: true,
      creator: 'Vamz Spectre',
      data: {
        page: mangas.current_page || 1,
        last_page: mangas.last_page || 1,
        total: mangas.total || items.length,
        results: items
      }
    };
  }

  /**
   * Get full manga details & chapter list
   */
  async detail(slugOrUrl: string) {
    let slug = slugOrUrl;
    if (slugOrUrl.includes('/manga/')) {
      const match = slugOrUrl.match(/\/manga\/([^/?#]+)/);
      if (match) slug = match[1];
    }
    slug = slug.trim().replace(/^\/+|\/+$/g, '');

    const props = await this.fetchProps(`/manga/${slug}`);
    const m = props.manga;
    if (!m) throw new Error(`Manga dengan slug "${slug}" tidak ditemukan.`);

    const chapters = (m.chapters || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      chapter_number: c.chapter_number,
      url: `${this.baseUrl}/manga/${m.slug}/chapter/${c.chapter_number}`,
      views_count: c.views_count,
      created_at: c.created_at
    }));

    return {
      status: true,
      creator: 'Vamz Spectre',
      data: {
        id: m.id,
        title: m.title,
        slug: m.slug,
        url: `${this.baseUrl}/manga/${m.slug}`,
        poster: m.poster,
        synopsis: m.synopsis,
        type: m.type,
        status: m.status,
        author: m.author,
        artist: m.artist,
        rating: m.rating,
        release_year: m.release_year,
        views_count: m.views_count,
        genres: (m.genres || []).map((g: any) => ({
          name: g.name,
          slug: g.slug,
          icon: g.icon
        })),
        total_chapters: chapters.length,
        first_chapter: props.firstChapter ? {
          chapter_number: props.firstChapter.chapter_number,
          url: `${this.baseUrl}/manga/${m.slug}/chapter/${props.firstChapter.chapter_number}`
        } : null,
        chapters
      }
    };
  }

  /**
   * Get chapter reading pages / images
   */
  async chapter(slugOrUrl: string, chapterNumber: string | number | null = null) {
    let targetPath = '';

    if (slugOrUrl.startsWith('http')) {
      const urlObj = new URL(slugOrUrl);
      targetPath = urlObj.pathname;
    } else if (chapterNumber !== null && chapterNumber !== undefined) {
      targetPath = `/manga/${slugOrUrl}/chapter/${chapterNumber}`;
    } else if (slugOrUrl.includes('/chapter/')) {
      targetPath = slugOrUrl;
    } else {
      throw new Error('Format pemanggilan chapter tidak valid. Gunakan (slug, chapterNumber) atau URL chapter.');
    }

    const props = await this.fetchProps(targetPath);
    const ch = props.chapter;
    const m = props.manga;

    if (!ch) throw new Error('Data chapter tidak ditemukan.');

    const images = (ch.images || []).map((img: any, idx: number) => {
      const rawUrl = (img.r2_url || img.image_path || '').trim();
      const resolvedUrl = rawUrl.startsWith('http')
        ? rawUrl
        : `${this.baseUrl}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
      const fallbackRaw = (img.image_path || '').trim();
      const fallbackUrl = fallbackRaw.startsWith('http')
        ? fallbackRaw
        : fallbackRaw ? `${this.baseUrl}${fallbackRaw.startsWith('/') ? '' : '/'}${fallbackRaw}` : resolvedUrl;

      return {
        order: img.order !== undefined ? img.order : idx,
        url: resolvedUrl,
        fallback_url: fallbackUrl,
        bytes: img.r2_bytes || null
      };
    });

    const chapters = (props.chapters || []).map((c: any) => ({
      id: c.id,
      title: c.title || `Chapter ${c.chapter_number}`,
      chapter_number: c.chapter_number,
      slug: c.slug,
      url: `${this.baseUrl}/manga/${m?.slug}/chapter/${c.chapter_number}`,
      created_at: c.created_at
    }));

    return {
      status: true,
      creator: 'Vamz Spectre',
      data: {
        chapter_id: ch.id,
        manga_title: m?.title || null,
        manga_slug: m?.slug || null,
        chapter_title: ch.title,
        chapter_number: ch.chapter_number,
        total_images: images.length,
        navigation: {
          prev: props.prev ? `${this.baseUrl}/manga/${m?.slug}/chapter/${props.prev.chapter_number}` : null,
          next: props.next ? `${this.baseUrl}/manga/${m?.slug}/chapter/${props.next.chapter_number}` : null
        },
        chapters,
        images
      }
    };
  }
}

export const scraper = new KomikcastScraper();
