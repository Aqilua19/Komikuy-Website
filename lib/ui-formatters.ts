export const KOMAKUY_LOGO_URL = 'https://i.ibb.co.com/zT63pDBG/image.png';

export const FALLBACK_POSTER_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600" fill="none">
      <rect width="400" height="600" fill="#13151B"/>
      <rect x="24" y="24" width="352" height="552" rx="8" stroke="#2A2E39" stroke-width="2"/>
      <path d="M168 260H232V332L200 310L168 332V260Z" stroke="#E12D39" stroke-width="4" stroke-linejoin="round"/>
      <text x="200" y="376" text-anchor="middle" fill="#949AA8" font-family="sans-serif" font-size="16" font-weight="600">KOMAKUY</text>
    </svg>`
  );

export function sanitizePosterUrl(url?: string | null): string {
  if (!url) return FALLBACK_POSTER_URI;
  const trimmed = url.trim();
  if (!trimmed || trimmed.includes('picsum.photos') || trimmed.includes('placeholder.com')) {
    return FALLBACK_POSTER_URI;
  }
  return trimmed;
}

export function formatRankNumber(rank: number): string {
  const safeRank = Math.max(1, Math.floor(rank));
  return safeRank < 10 ? `0${safeRank}` : String(safeRank);
}

export function formatComicCardMeta(parts: {
  chapter?: string | number | null;
  type?: string | null;
  rating?: number | string | null;
  status?: string | null;
  author?: string | null;
}): string {
  const tokens: string[] = [];

  if (parts.chapter !== undefined && parts.chapter !== null && parts.chapter !== '') {
    tokens.push(`Ch. ${parts.chapter}`);
  } else if (parts.type) {
    tokens.push(parts.type);
  } else if (parts.author) {
    tokens.push(parts.author);
  }

  if (parts.rating !== undefined && parts.rating !== null && parts.rating !== '') {
    const num = typeof parts.rating === 'number' ? parts.rating : parseFloat(String(parts.rating));
    if (!Number.isNaN(num) && num > 0) {
      tokens.push(`★ ${num.toFixed(1)}`);
    }
  }

  if (parts.status === 'Tamat') {
    tokens.push('Tamat');
  }

  return tokens.join(' · ') || 'Komik';
}
