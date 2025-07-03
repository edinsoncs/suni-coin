import Blockchain from '../blockchain/index.js';
import P2PAction from './p2p.js';
import Wallet from '../wallet/index.js';
import Miner from '../miner/index.js';

const blockchain = new Blockchain();
const wallets = [];
const walletMiner = new Wallet(blockchain, 0);
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
