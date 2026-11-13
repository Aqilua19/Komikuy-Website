import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WEBTOON_SERIES,
  getTodayKey,
  getSeriesByDay,
  getRankedSeries,
  getSeriesByGenre,
  getSeriesBySlug,
} from './comics-data';

test('WEBTOON_SERIES contains at least 12 rich series', () => {
  assert.ok(WEBTOON_SERIES.length >= 12, 'Must have at least 12 series');
  for (const s of WEBTOON_SERIES) {
    assert.ok(s.id, 'Series has id');
    assert.ok(s.slug, 'Series has slug');
    assert.ok(s.title, 'Series has title');
    assert.ok(s.author, 'Series has author');
    assert.ok(s.poster, 'Series has poster');
    assert.ok(s.day, 'Series has day');
    assert.ok(s.episodes.length >= 8, `${s.title} has at least 8 episodes`);
    assert.ok(s.genres.length > 0, `${s.title} has genres`);
  }
});

test('getTodayKey returns a valid day key', () => {
  const day = getTodayKey();
  assert.match(day, /^(SEN|SEL|RAB|KAM|JUM|SAB|MIN)$/);
});

test('getSeriesByDay filters series correctly', () => {
  const senSeries = getSeriesByDay('SEN');
  assert.ok(senSeries.length > 0);
  for (const item of senSeries) {
    assert.equal(item.day, 'SEN');
  }

  const tamatSeries = getSeriesByDay('TAMAT');
  assert.ok(tamatSeries.length > 0);
  for (const item of tamatSeries) {
    assert.equal(item.day, 'TAMAT');
  }
});

test('getRankedSeries sorts accurately for each period', () => {
  const todayRanks = getRankedSeries('today');
  assert.equal(todayRanks[0].rankToday, 1);

  const weekRanks = getRankedSeries('week');
  assert.equal(weekRanks[0].rankWeek, 1);

  const monthRanks = getRankedSeries('month');
  assert.equal(monthRanks[0].rankMonth, 1);
});

test('getSeriesByGenre filters properly', () => {
  const aksi = getSeriesByGenre('Aksi');
  assert.ok(aksi.length > 0);
  assert.ok(aksi.every((s) => s.genres.includes('Aksi')));

  const all = getSeriesByGenre('Semua');
  assert.equal(all.length, WEBTOON_SERIES.length);
});

test('getSeriesBySlug finds series correctly', () => {
  const s = getSeriesBySlug('solo-leveling-ragnarok');
  assert.ok(s);
  assert.equal(s?.title, 'Solo Leveling: Ragnarok');
});
