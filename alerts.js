const axios = require('axios');

const WEBHOOK_URL = process.env.WEBHOOK_ANIME;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function send(anime) {
  const embed = {
    title: anime.title,
    url: anime.link,
    thumbnail: {
      url: anime.image,
    },
    color: 0x00ffcc,
  };

  try {
    await axios.post(WEBHOOK_URL, {
      embeds: [embed],
    });
  } catch (err) {
    console.error(`Failed to send embed for ${anime.title}`, err.message);
  }
}

module.exports = { sleep, send };
