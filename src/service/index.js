import express from 'express';
import bodyParser from 'body-parser';
import Blockchain from '../blockchain';
import P2PAction from './p2p';
import Wallet from '../wallet';
import Miner from '../miner';


const app = express();
const { PORT = 80 } = process.env;
global.newBlockchain = new Blockchain();
global.newWallet = new Wallet(newBlockchain);
global.newWalletMiner = new Wallet(newBlockchain, 0);
global.p2pAction = new P2PAction(newBlockchain);
global.newMiner = new Miner(newBlockchain, p2pAction, newWalletMiner);


app.use(bodyParser.json());
require('../middleware')(app)

app.listen(PORT, () => {
	console.log(`Servidor ready: ${PORT}, 
		Wallet: ${newWallet}`);
	p2pAction.listen();
});