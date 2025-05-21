const { api } = require('./api');
const { load, save } = require('./logger');
const { send } = require('./alerts');

async function main() {
  const data = await api();
  let log = load();
  const titles = new Set(log.map((anime) => anime.title));

  for (const anime of data) {
    if (!titles.has(anime.title)) {
      await send(anime);
      log.push(anime);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  save(log);
}

main();
