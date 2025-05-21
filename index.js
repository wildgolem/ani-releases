const { api } = require('./api');
const { load, save, del } = require('./logger');
const { sleep, send } = require('./alerts');

async function main() {
  const data = await api();
  let log = load();
  const titles = new Set(log.map((anime) => anime.title));
  let index = 0;

  for (const anime of data) {
    if (!titles.has(anime.title)) {
      await send(anime);
      log.push(anime);
      index++;
      await sleep(1000);
    }
  }

  log = del(log);
  save(log);
}

main();
