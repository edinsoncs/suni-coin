import Blockchain from '../blockchain/index.js';
import P2PAction from './p2p.js';
import Wallet from '../wallet/index.js';
import Miner from '../miner/index.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const blockchain = new Blockchain();
const wallets = [];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MINER_KEY_FILE = path.join(__dirname, '../storage/miner.key');

let walletMiner;
if (existsSync(MINER_KEY_FILE)) {
  try {
    const priv = readFileSync(MINER_KEY_FILE, 'utf8');
    walletMiner = Wallet.fromPrivateKey(blockchain, priv.trim(), 0);
  } catch {
    walletMiner = new Wallet(blockchain, 0);
  }
} else {
  walletMiner = new Wallet(blockchain, 0);
  try {
    writeFileSync(MINER_KEY_FILE, walletMiner.exportPrivateKey());
  } catch {
    /* ignore persistence errors */
  }
}

if (blockchain.getStakeOf(walletMiner.publicKey) === 0) {
  blockchain.registerStake(walletMiner.publicKey, 1);
}

const p2pAction = new P2PAction(blockchain);
const miner = new Miner(blockchain, p2pAction, walletMiner);

let currentWallet = null;

const context = {
  blockchain,
  wallets,
  walletMiner,
  p2pAction,
  miner,
  get currentWallet() {
    return currentWallet;
  },
  set currentWallet(w) {
    currentWallet = w;
  }
};

export { blockchain, wallets, walletMiner, p2pAction, miner, currentWallet };
export default context;
