import { Transaction, blockchainWallet } from '../wallet';
import { MESSAGE } from '../service/p2p';

class Miner {

	constructor(blockchain, p2p, wallet){
		this.blockchain = blockchain;
		this.p2p = p2p;
		this.wallet = wallet;
	}

	mine() {
		const { blockchain: { memoryPool },
		 p2p, wallet } = this;

		if(memoryPool.transactions.length === 0) {
			throw Error('La transacción no esta confirmada');
		} 

		//1
		memoryPool.transactions.push(Transaction.reward(wallet, blockchainWallet));
		//2
		const block = this.blockchain.addBlock(memoryPool.transactions);
		//3
		p2p.sync();
		//4
		memoryPool.wipe();
		//5
		p2p.broadcast(MESSAGE.WIPE);
		return block;

	}
}

export default Miner;