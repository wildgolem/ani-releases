const puppeteer = require('puppeteer');

async function api() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'], 
  });

  const page = await browser.newPage();

  const results = [];

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api?m=airing&page=1')) {
      try {
        const json = await response.json();
        for (const item of json.data) {
          results.push({
            title: item.anime_title,
            episode: item.episode,
            image: item.snapshot,
            link: `https://animepahe.ru/play/${item.anime_session}/${item.session}`,
            disc: item.disc,
            completed: item.completed,
          });
        }
      } catch (e) {
        console.error('Failed to parse JSON:', e);
      }
    }
  });

  await page.goto('https://animepahe.ru', {
    waitUntil: 'networkidle2',
  });

  await new Promise(resolve => setTimeout(resolve, 2500));

  await browser.close();

  return results;
}

module.exports = { api };
