import { Transaction } from '../wallet';

class MemoryPool{

	constructor(){
		this.transactions = [];
	}

	addOrUpdate(transaction){

		const { input, outputs = [] } = transaction;
		const outputTotal = outputs.reduce((total, output) => Number(total) + Number(output.amount), 0);

		if(input.amount !== outputTotal){
			throw Error(`Transacción inválida: ${input.address}`);
		}

		if(!Transaction.verify(transaction)){
			throw Error(`La firma es invalida: ${input.address}`);
		}
		const tIndex = this.transactions.findIndex(({ id }) => id === transaction.id);
		if(tIndex >= 0){
			this.transactions[tIndex] = transaction;
		} else {
			this.transactions.push(transaction);
		}
	}

	find(address){
		return this.transactions.find(( { input } ) => input.address === address); 
	}

	wipe(){
		this.transactions = [];
	}

}

export default MemoryPool;