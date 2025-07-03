import fs from 'fs';

/**
 * Simple database configuration module.
 * Select the backend with the DB_TYPE environment variable.
 * Supported types: json (default), mongodb, mysql, postgres, firebase.
 * Connection parameters are read from DB_URI, DB_USER, DB_PASSWORD and FIREBASE_CERT.
 *
 * Only the JSON backend is implemented synchronously. Other backends require
 * additional libraries and should be implemented as needed.
 */

export const DB_TYPE = process.env.DB_TYPE || 'json';
export const DB_URI = process.env.DB_URI || '';
export const DB_USER = process.env.DB_USER || '';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const FIREBASE_CERT = process.env.FIREBASE_CERT || '';

let client = null;

export function getDbType() {
  return DB_TYPE;
}

/**
 * Placeholder connect function for future database support.
 * Applications can extend this to initialize remote connections.
 */
export function connect() {
  if (client) return client;
  switch (DB_TYPE) {
    case 'mongodb':
    case 'mysql':
    case 'postgres':
    case 'firebase':
      throw new Error('Remote database support not implemented yet');
    default:
      client = null;
  }
  return client;
}

/**
 * Store JSON data under the given key.
 * For remote databases this should be replaced with real queries.
 */
export function save(key, data) {
  if (DB_TYPE !== 'json') {
    console.warn('Remote database support not implemented yet');
    return;
  }
  if (!fs.existsSync('storage')) fs.mkdirSync('storage', { recursive: true });
  fs.writeFileSync(`storage/${key}.json`, JSON.stringify(data, null, 2));
}

/**
 * Load JSON data previously stored with save().
 */
export function load(key) {
  if (DB_TYPE !== 'json') {
    console.warn('Remote database support not implemented yet');
    return null;
  }
  const file = `storage/${key}.json`;
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file));
}
