import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Wallet from '../wallet/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../storage');
const WALLET_FILE = path.join(DATA_DIR, 'wallets.json');

export function loadWallets(blockchain) {
  if (!existsSync(WALLET_FILE)) return [];
  try {
    const data = JSON.parse(readFileSync(WALLET_FILE));
    if (!Array.isArray(data)) return [];
    const wallets = data.map(w => {
      if (w && w.mnemonic) {
        return Wallet.fromMnemonic(blockchain, w.mnemonic, w.balance || 20);
      }
      if (w && w.privateKey) {
        return Wallet.fromPrivateKey(blockchain, w.privateKey, w.balance || 20);
      }
      return null;
    }).filter(Boolean);
    return wallets;
  } catch (err) {
    console.error('Failed to load wallets data:', err);
    return [];
  }
}

export function saveWallets(wallets) {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    const data = wallets.map(w => ({
      mnemonic: w.mnemonic || null,
      privateKey: w.mnemonic ? null : w.keyPair.getPrivate('hex'),
      balance: w.balance,
    }));
    writeFileSync(WALLET_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save wallets data:', err);
  }
}
