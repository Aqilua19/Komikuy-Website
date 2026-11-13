const { scraper } = require('./lib/komikcast/scraper');

async function test() {
  try {
    console.log('Testing search...');
    const searchResult = await scraper.search('solo');
    console.log('Search success:', searchResult.status);
    
    if (searchResult.data.results.length > 0) {
      const mangaSlug = searchResult.data.results[0].slug;
      console.log('Testing detail for:', mangaSlug);
      const detail = await scraper.detail(mangaSlug);
      console.log('Detail success:', detail.status);
      
      if (detail.data.chapters.length > 0) {
        const chapterNumber = detail.data.chapters[0].chapter_number;
        console.log('Testing chapter for:', mangaSlug, chapterNumber);
        const chapter = await scraper.chapter(mangaSlug, chapterNumber);
        console.log('Chapter success:', chapter.status);
        console.log('Images found:', chapter.data.images.length);
      }
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
