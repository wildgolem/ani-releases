const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'released.json');

function load() {
  if (!fs.existsSync(FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function save(log) {
  if (log.length >= 50) {
    log = log.slice(-12);
  }
  fs.writeFileSync(FILE, JSON.stringify(log, null, 2));
}

module.exports = { load, save };
