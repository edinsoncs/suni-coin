import { Transaction, blockchainWallet } from '../wallet/index.js';
import { MESSAGE } from '../service/p2p.js';

class Miner {

	constructor(blockchain, p2p, wallet){
		this.blockchain = blockchain;
		this.p2p = p2p;
		this.wallet = wallet;
	}

        mine() {
                const { blockchain, p2p, wallet } = this;
                const { memoryPool } = blockchain;

                if(memoryPool.transactions.length === 0) {
                        throw Error('Transaction not confirmed');
                }

                memoryPool.transactions.push(Transaction.reward(wallet, blockchainWallet));
                const block = blockchain.addBlock(memoryPool.transactions, wallet);
                p2p.sync();
                memoryPool.wipe();
                p2p.broadcast(MESSAGE.WIPE);
                return block;

        }
}

export default Miner;
