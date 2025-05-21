const puppeteer = require('puppeteer');

async function api() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://hikari.gg/new-episodes', {
    waitUntil: 'networkidle0',
  });

  const animes = await page.evaluate(() => {
    const container = document.querySelector(
      '.grid.grid-cols-2.sm\\:grid-cols-3.md\\:grid-cols-4.lg\\:grid-cols-5.gap-4'
    );
    if (!container) return [];

    return Array.from(container.querySelectorAll('a')).map((anime) => {
      const img = anime.querySelector('img');
      const title = img?.alt || 'Untitled';
      const image = img?.src || '';
      const link = anime.href;
      return { title, link, image };
    });
  });

  await browser.close();
  return animes;
}

module.exports = { api };
