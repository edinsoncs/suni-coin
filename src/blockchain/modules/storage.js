import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { load as dbLoad, save as dbSave, getDbType } from '../../config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../storage');
const DATA_FILE = path.join(DATA_DIR, 'chain.json');
const VALIDATORS_FILE = path.join(DATA_DIR, 'validators.json');
const MEMPOOL_FILE = path.join(DATA_DIR, 'mempool.json');

const DB_TYPE = getDbType();

export function loadBlocks() {
  if (DB_TYPE !== 'json') {
    const data = dbLoad('blocks');
    return data || null;
  }
  if (!existsSync(DATA_FILE)) return null;
  try {
    const data = JSON.parse(readFileSync(DATA_FILE));
    return data;
  } catch (err) {
    console.error('Failed to load blockchain data:', err);
    return null;
  }
}

export function loadValidators() {
  if (DB_TYPE !== 'json') {
    const data = dbLoad('validators');
    return data || null;
  }
  if (!existsSync(VALIDATORS_FILE)) return null;
  try {
    return JSON.parse(readFileSync(VALIDATORS_FILE));
  } catch (err) {
    console.error('Failed to load validators data:', err);
    return null;
  }
}

export function saveBlocks(blocks) {
  try {
    if (DB_TYPE !== 'json') {
      dbSave('blocks', blocks);
      return;
    }
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(blocks, null, 2));
  } catch (err) {
    console.error('Failed to save blockchain data:', err);
  }
}

export function saveValidators(validators) {
  try {
    if (DB_TYPE !== 'json') {
      dbSave('validators', validators);
      return;
    }
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(VALIDATORS_FILE, JSON.stringify(validators, null, 2));
  } catch (err) {
    console.error('Failed to save validators data:', err);
  }
}

export function loadMempool() {
  if (DB_TYPE !== 'json') {
    const data = dbLoad('mempool');
    return Array.isArray(data) ? data : [];
  }
  if (!existsSync(MEMPOOL_FILE)) return [];
  try {
    return JSON.parse(readFileSync(MEMPOOL_FILE));
  } catch (err) {
    console.error('Failed to load mempool data:', err);
    return [];
  }
}

export function saveMempool(txs) {
  try {
    if (DB_TYPE !== 'json') {
      dbSave('mempool', txs);
      return;
    }
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(MEMPOOL_FILE, JSON.stringify(txs, null, 2));
  } catch (err) {
    console.error('Failed to save mempool data:', err);
  }
}
