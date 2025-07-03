import fs from 'fs';
import { MongoClient } from 'mongodb';
import mysql from 'mysql2/promise';
import { Client as PgClient } from 'pg';
import admin from 'firebase-admin';

/**
 * Simple database configuration module.
 * Select the backend with the DB_TYPE environment variable.
 * Supported types: json (default), mongodb, mysql, postgres, firebase.
 * Connection parameters are read from DB_URI, DB_USER, DB_PASSWORD and FIREBASE_CERT.
 *
 * The JSON backend uses local files. MongoDB, MySQL, PostgreSQL and Firebase
 * rely on their official Node.js drivers and operate asynchronously.
 */

export const DB_TYPE = process.env.DB_TYPE || 'json';
export const DB_URI = process.env.DB_URI || '';
export const DB_USER = process.env.DB_USER || '';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const FIREBASE_CERT = process.env.FIREBASE_CERT || '';

let client = null;
let collection = null;

export function getDbType() {
  return DB_TYPE;
}

/**
 * Placeholder connect function for future database support.
 * Applications can extend this to initialize remote connections.
 */
export async function connect() {
  if (client) return client;
  switch (DB_TYPE) {
    case 'mongodb': {
      client = new MongoClient(DB_URI);
      await client.connect();
      collection = client.db().collection('bydchain');
      break;
    }
    case 'mysql': {
      client = await mysql.createConnection({ uri: DB_URI, user: DB_USER, password: DB_PASSWORD });
      await client.execute('CREATE TABLE IF NOT EXISTS storage (`key` VARCHAR(255) PRIMARY KEY, data JSON)');
      break;
    }
    case 'postgres': {
      client = new PgClient({ connectionString: DB_URI, user: DB_USER, password: DB_PASSWORD });
      await client.connect();
      await client.query('CREATE TABLE IF NOT EXISTS storage(key text primary key, data jsonb)');
      break;
    }
    case 'firebase': {
      const cert = FIREBASE_CERT && fs.existsSync(FIREBASE_CERT)
        ? JSON.parse(fs.readFileSync(FIREBASE_CERT))
        : null;
      admin.initializeApp({
        credential: admin.credential.cert(cert),
        databaseURL: DB_URI,
      });
      client = admin.firestore();
      break;
    }
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
  if (DB_TYPE === 'json') {
    if (!fs.existsSync('storage')) fs.mkdirSync('storage', { recursive: true });
    fs.writeFileSync(`storage/${key}.json`, JSON.stringify(data, null, 2));
    return;
  }
  return connect().then(async () => {
    switch (DB_TYPE) {
      case 'mongodb':
      await collection.updateOne({ _id: key }, { $set: { data } }, { upsert: true });
      break;
      case 'mysql':
      await client.execute('REPLACE INTO storage(`key`,`data`) VALUES (?, ?)', [key, JSON.stringify(data)]);
      break;
      case 'postgres':
      await client.query('INSERT INTO storage(key,data) VALUES($1,$2) ON CONFLICT (key) DO UPDATE SET data=EXCLUDED.data', [key, data]);
      break;
      case 'firebase':
      await client.collection('storage').doc(key).set({ data });
      break;
      default:
      throw new Error(`Unsupported DB_TYPE ${DB_TYPE}`);
    }
  });
}

/**
 * Load JSON data previously stored with save().
 */
export function load(key) {
  if (DB_TYPE === 'json') {
    const file = `storage/${key}.json`;
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file));
  }
  return connect().then(async () => {
    switch (DB_TYPE) {
      case 'mongodb': {
      const doc = await collection.findOne({ _id: key });
      return doc ? doc.data : null;
    }
      case 'mysql': {
      const [rows] = await client.execute('SELECT data FROM storage WHERE `key`=?', [key]);
      if (rows.length === 0) return null;
      return JSON.parse(rows[0].data);
    }
      case 'postgres': {
      const res = await client.query('SELECT data FROM storage WHERE key=$1', [key]);
      return res.rows[0] ? res.rows[0].data : null;
    }
      case 'firebase': {
      const doc = await client.collection('storage').doc(key).get();
      return doc.exists ? doc.data().data : null;
    }
      default:
      throw new Error(`Unsupported DB_TYPE ${DB_TYPE}`);
    }
  });
}
