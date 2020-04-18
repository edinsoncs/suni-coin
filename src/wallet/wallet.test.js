import Wallet, { INIT_BL } from './wallet';
import Blockchain from '../blockchain';

describe('Wallet()', () => {

	let blockchain; 
	let wallet;

	beforeEach(() => {
		blockchain = new Blockchain();
		wallet = new Wallet(blockchain);
	});


	it('test wallet', () => {

		expect(wallet.balance).toEqual(INIT_BL);
		expect(typeof wallet.keyPair).toEqual('object');
		expect(typeof wallet.publicKey).toEqual('string');
		expect(wallet.publicKey.length).toEqual(130);

	});

	it('sing()', () => {
		const signature = wallet.sign('wordl!!!');

		expect(typeof signature).toEqual('object');
		expect(signature).toEqual(wallet.sign('wordl!!!'));
	});


	describe('Test createTransaction()', () => {

		let tr;
		let receptAddress;
		let amount;

		beforeEach(() => {
			receptAddress = 'hyp-78';
			amount = 5;
			tr = wallet.createTransaction(receptAddress, amount);
		});

		describe('haciendo la misma transacción', () => {
			beforeEach(() => {
				tr = wallet.createTransaction(receptAddress, amount);
			});

			it('1. duplicar la cantidad restada del saldo de la wallet', () => {
				const output = tr.outputs.find(( {address} ) => address === wallet.publicKey);
				let rest_wallet = wallet.balance - (amount * 2);
				expect(output.amount).toEqual(rest_wallet);
			});

			it('2. Clona la salida(cantidad) para el destinatario ', () => {
				const amounts = 
				tr.outputs.filter(( { address } ) => address === receptAddress)
				.map((output) => output.amount);
				expect(amounts).toEqual([amount, amount]);
			});

		});

	});	


	describe('cacular un saldo => calculateBalance()', () => {

		let addBalance;
		let times;
		let senderWallet;

		beforeEach(() => {
			addBalance = 16;
			times = 3;
			senderWallet = new Wallet(blockchain);
			
			for(let i=0; i < times; i++){
			 senderWallet.createTransaction(wallet.publicKey, addBalance);
			}

			blockchain.addBlock(blockchain.memoryPool.transactions);

		});


		it('calcular el saldo de las cadenas de bloques que coincidan con el destinatario', () => {

			let w_cSum =  INIT_BL + (addBalance * times);
			expect(wallet.calculateBalance()).toEqual(w_cSum);

		});

		it('calcular el balance para las cadenas de bloques que coincidan con el remitente', () => {

			let w_cRest = INIT_BL - (addBalance * times);
			expect(senderWallet.calculateBalance()).toEqual(w_cRest);

		});


		describe('El receptor realiza una transacción', () => {

			let subtractBalance;
			let recipientBalance;

			beforeEach(() => {
				blockchain.memoryPool.wipe();
				subtractBalance = 64;
				recipientBalance = wallet.calculateBalance();
			
				wallet.createTransaction(senderWallet.publicKey, addBalance);
				blockchain.addBlock(blockchain.memoryPool.transactions);

			});

			describe('El remitente envía otra transacción al destinatario', () => {

				beforeEach(() => {
					blockchain.memoryPool.wipe();
					senderWallet.createTransaction(wallet.publicKey, addBalance);
					blockchain.addBlock(blockchain.memoryPool.transactions);
				});

				it('Calcular el saldo del destinatario solo usando transactions desde sus mas recientes', () => {
					let result = recipientBalance - subtractBalance + addBalance;
					expect(wallet.calculateBalance()).toEqual(result);
				});

			});
		});


	});



});