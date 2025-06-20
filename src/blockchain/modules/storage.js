import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../storage');
const DATA_FILE = path.join(DATA_DIR, 'chain.json');

export function loadBlocks() {
  if (!existsSync(DATA_FILE)) return null;
  try {
    const data = JSON.parse(readFileSync(DATA_FILE));
    return data;
  } catch (err) {
    console.error('Failed to load blockchain data:', err);
    return null;
  }
}

export function saveBlocks(blocks) {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(blocks, null, 2));
  } catch (err) {
    console.error('Failed to save blockchain data:', err);
  }
}
