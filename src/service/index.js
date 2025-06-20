import express from 'express';
import bodyParser from 'body-parser';
import Blockchain from '../blockchain/index.js';
import P2PAction from './p2p.js';
import Wallet from '../wallet/index.js';
import Miner from '../miner/index.js';
import middleware from '../middleware/index.js';


const app = express();
const { PORT = 8000 } = process.env;
global.newBlockchain = new Blockchain();
//global.newWallet = new Wallet(newBlockchain, 0);
global.newWalletMiner = new Wallet(newBlockchain, 0);
global.p2pAction = new P2PAction(newBlockchain);
global.newMiner = new Miner(newBlockchain, p2pAction, newWalletMiner);


app.use(bodyParser.json());
// Allow cross-origin requests so the Next.js frontend can call the API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
middleware(app);

app.listen(PORT, () => {
	p2pAction.listen();
});
