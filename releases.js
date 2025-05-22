const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');
const { api } = require('./api');

const WEBHOOK_URL = process.env.WEBHOOK_ANIME;

async function get_releases() {
  const releases = await api();
  return releases.slice(0, 10).reverse();
}

function create_embeds(animes) {
  return animes.map(anime => ({
    title: anime.title,
    description: `[Episode ${anime.episode}](${anime.link}) ${anime.completed ? "🗸" : ""}`,
    thumbnail: { url: anime.image },
    color: 0x00ffcc,
  }));
}

async function read_message_id(id_path) {
  try {
    const message_id = await fs.readFile(id_path, 'utf-8');
    return message_id.trim();
  } catch {
    return null;
  }
}

async function delete_old_message(message_id) {
  if (!message_id) return;
  try {
    await axios.delete(`${WEBHOOK_URL}/messages/${message_id}`);
  } catch (err) {
    console.warn(`Failed to delete old message with ID ${message_id}:`, err.message);
  }
}

async function send_new_message(embeds) {
  const response = await axios.post(`${WEBHOOK_URL}?wait=true`, { embeds });
  return response.data.id;
}

async function save_message_id(id_path, message_id) {
  await fs.writeFile(id_path, message_id, 'utf-8');
}

async function send() {
  try {
    const id_path = path.resolve(__dirname, 'id.txt');

    const releases = await get_releases();
    const embeds = create_embeds(releases);

    const old_message_id = await read_message_id(id_path);
    await delete_old_message(old_message_id);

    const new_message_id = await send_new_message(embeds);
    await save_message_id(id_path, new_message_id);
  } catch (err) {
    console.error('Error updating embeds:', err.message);
  }
}

module.exports = { send };
