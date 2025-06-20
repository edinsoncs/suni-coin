import Transaction from './transaction.js';
import { gnHash, elliptic } from '../modules/index.js';

const INIT_BL = 100;

class Wallet{

        constructor(blockchain, initBalance = INIT_BL){
                this.balance = initBalance;
                this.keyPair  = elliptic.createKeyPair();
                this.publicKey = this.keyPair.getPublic().encode('hex');
                this.blockchain = blockchain;
                this.stakeBalance = 0;
        }

	toString(){

		const { balance, publicKey } = this;

		return `
			publicKey: ${publicKey.toString()}
			balance: ${balance}
		 `;
	}

	blockchainWallet(){
		const { balance, publicKey, keyPair } = this;
		return {
			'publicKey': publicKey.toString(),
			'balance': balance,
		}	
	}

        sign(data){
                return this.keyPair.sign(gnHash(data));
        }

        stake(amount){
                if(amount > this.balance){
                        throw Error(`El monto es: ${amount} superior al balance: ${this.balance}`);
                }
                this.balance -= amount;
                this.stakeBalance += amount;
                this.blockchain.registerStake(this.publicKey, amount);
        }


	createTransaction(receptAddress, amount){
		const { blockchain: { memoryPool } } = this;

		const balance = this.calculateBalance();

		if(amount > balance){
		   throw Error(`El monto es: ${amount} superior al balance: ${balance}`);
		}

		let tr = memoryPool.find(this.publicKey);
		if(tr){
			tr.update(this, receptAddress, amount);
		} else {
			tr = Transaction.create(this, receptAddress, amount);
			memoryPool.addOrUpdate(tr);
		}

		return tr;

	}

	calculateBalance(){

		const { blockchain: { blocks = [] }, publicKey} = this;
		let { balance } = this;

		const tr = [];

		blocks.forEach(( { data = []} ) => {
			if(Array.isArray(data)){
				data.forEach((trs) => tr.push(trs));
			}
		});

		const walletInputTr = tr.filter((trs) => trs.input.address === publicKey);
		let timestamp = 0;

		if(walletInputTr.length > 0){
			const recentInpuTr = walletInputTr.sort((a, b) => a.input.timestamp - b.input.timestamp).pop();
			balance = recentInpuTr.outputs.find(( {address} ) => address === publicKey).amount;
			
			timestamp = recentInpuTr.input.timestamp;
		}

		tr
		.filter(( {input } ) =>  input.timestamp > timestamp)
		.forEach(( {outputs} ) => {
			outputs.find(( {address, amount}) => {
				if(address === publicKey) balance += amount;
			});
		});

		return balance;

	}


}

export { INIT_BL }

export default Wallet;