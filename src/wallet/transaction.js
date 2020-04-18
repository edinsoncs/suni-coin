import { v1 as uuidv1 } from 'uuid';
import { elliptic } from '../modules';

const REWARD = 1;

class Transaction{

	constructor(){
		this.id = uuidv1();
		this.input = null;
		this.outputs = [];
	}

	static create(senderWallet, receptAddress, amount){

		const { balance, publicKey } = senderWallet;

		if(amount > balance){
			throw Error(`Tu envío es: ${amount}, excede tu balance`);
		}

		const tr = new Transaction();
		
		tr.outputs.push(...[
			{
				amount: balance - amount,
				address: publicKey
			},
			{
				amount,
				address: receptAddress
			}
		]);

		tr.input = Transaction.sign(tr, senderWallet);

		return tr;

	}

	static reward(minerWallet, blockchainWallet){
		return this.create(blockchainWallet, minerWallet.publicKey, REWARD);
	}


	static verify(transaction){
		const { input: { address, signature }, outputs } = transaction;
   		return elliptic.verifySignature(address, signature, outputs);
	}

	static sign(transaction, senderWallet){
		return {
			timestamp: Date.now(),
			amount: senderWallet.balance,
			address: senderWallet.publicKey,
			signature: senderWallet.sign(transaction.outputs)
		}
	}

	update(senderWallet, receptAddress, amount) {

		const sendOutput = this.outputs.find((ouput) =>
		ouput.address === senderWallet.publicKey);

		if(amount > sendOutput.amount) 
			throw Error(`Tu envío es: ${amount}, excede tu balance`);

		sendOutput.amount -= amount;
		this.outputs.push({
			amount,
			address: receptAddress			
		});
		this.input = Transaction.sign(this, senderWallet);

		return this;

	}

}

export { REWARD };

export default Transaction;


