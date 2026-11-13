import test from 'node:test';
import assert from 'node:assert/strict';
import { KomikcastScraper } from './scraper';

test('KomikcastScraper initializes successfully', () => {
  const scraper = new KomikcastScraper();
  assert.ok(scraper);
  assert.equal(scraper.baseUrl, 'https://komikcast.info');
});

test('KomikcastScraper latest returns real comics', async () => {
  const scraper = new KomikcastScraper();
  const res = await scraper.latest(1);
  assert.equal(res.status, true);
  assert.ok(res.data);
  assert.ok(Array.isArray(res.data.results));
  assert.ok(res.data.results.length > 0);
  assert.ok(res.data.results[0].title);
  assert.ok(res.data.results[0].slug);
});

test('KomikcastScraper search returns real results', async () => {
  const scraper = new KomikcastScraper();
  const res = await scraper.search('solo', 1);
  assert.equal(res.status, true);
  assert.ok(res.data);
  assert.ok(Array.isArray(res.data.results));
});
