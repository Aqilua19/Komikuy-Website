import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FALLBACK_POSTER_URI,
  formatComicCardMeta,
  formatRankNumber,
  sanitizePosterUrl,
} from './ui-formatters';

test('sanitizePosterUrl replaces empty or banned placeholder hosts with local SVG fallback', () => {
  assert.equal(sanitizePosterUrl(null), FALLBACK_POSTER_URI);
  assert.equal(sanitizePosterUrl(''), FALLBACK_POSTER_URI);
  assert.equal(sanitizePosterUrl('https://picsum.photos/seed/comic/400/600'), FALLBACK_POSTER_URI);
  assert.equal(
    sanitizePosterUrl('https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/915.webp'),
    'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/915.webp'
  );
});

test('formatRankNumber formats single digits with leading zero for tabular alignment', () => {
  assert.equal(formatRankNumber(1), '01');
  assert.equal(formatRankNumber(9), '09');
  assert.equal(formatRankNumber(10), '10');
});

test('formatComicCardMeta builds clean dot-separated metadata without pill clutter', () => {
  assert.equal(
    formatComicCardMeta({ chapter: 180, rating: 9.92, status: 'Tamat' }),
    'Ch. 180 · ★ 9.9 · Tamat'
  );
  assert.equal(
    formatComicCardMeta({ type: 'Manhwa', rating: '8.75' }),
    'Manhwa · ★ 8.8'
  );
  assert.equal(formatComicCardMeta({ author: 'Chugong' }), 'Chugong');
  assert.equal(formatComicCardMeta({}), 'Komik');
});
