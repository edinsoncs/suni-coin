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
middleware(app);

app.listen(PORT, () => {
	p2pAction.listen();
});