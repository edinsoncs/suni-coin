import Blockchain from '../blockchain/index.js';
import P2PAction from './p2p.js';
import Wallet from '../wallet/index.js';
import Miner from '../miner/index.js';
import { loadWallets, saveWallets } from './walletStorage.js';

const blockchain = new Blockchain();
const wallets = loadWallets(blockchain);
const walletMiner = new Wallet(blockchain, 0);
const p2pAction = new P2PAction(blockchain);
const miner = new Miner(blockchain, p2pAction, walletMiner);
let currentWallet = wallets[0] || null;

function persistWallets() {
  saveWallets(wallets);
}

process.on('beforeExit', persistWallets);
process.on('SIGINT', () => {
  persistWallets();
  process.exit();
});

export { blockchain, wallets, walletMiner, p2pAction, miner, currentWallet };
export default { blockchain, wallets, walletMiner, p2pAction, miner, currentWallet };
