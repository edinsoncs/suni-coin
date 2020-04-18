import MemoryPool from './memPool';
import Wallet, { Transaction } from '../wallet';

describe('MemPool()', () => {

	let memoryPool;
	let wallet;
	let transaction;

	beforeEach(() => {
		memoryPool = new MemoryPool();
		wallet = new Wallet();
		transaction = Transaction.create(wallet, 'e-d-y-suni', 10);
		memoryPool.addOrUpdate(transaction);
	});


	it('Hacer una transacción', () => {
		expect(memoryPool.transactions.length).toEqual(1);
	});

	it('Agregar una transacción al grupo de memoria', () => {

		const found = memoryPool.transactions.find(( {id} ) => id === transaction.id);

		expect(found).toEqual(transaction);

	});


	it('Actualizar una transacción en el conjunto de memoria', () => {

		const tOld = JSON.stringify(transaction);
		const tNew = transaction.update(wallet, 'anonym-h50', 15);

		memoryPool.addOrUpdate(tNew);
		expect(memoryPool.transactions.length).toEqual(1);

		const found = memoryPool.transactions.find(( {id} ) => id === transaction.id);

		expect(JSON.stringify(found)).not.toEqual(tOld);
		expect(tNew).toEqual(found);

	});


	it('borrara las transacciónes de memoria', () => {

		memoryPool.wipe();
		expect(memoryPool.transactions.length).toEqual(0);

	});



});