import Wallet from './wallet';
import Transaction, { REWARD } from './transaction';
import { blockchainWallet } from './index';


describe('Transaction()', () => {

	let wallet;
	let amount;
	let receptAddress;

	let transaction;

	beforeEach(() => {

		wallet = new Wallet();
		receptAddress = 'jhuojh-kll0';
		amount = 6;

		transaction = 
		Transaction.create(wallet, receptAddress, amount);

	});

	it('Restar la cantidada del saldo de la wallet', () => {

		const output = 
		transaction.outputs.find(( { address } ) => address === wallet.publicKey);

		expect(output.amount).toEqual(wallet.balance - amount);

	});


	it('Agregar la cantidad al destinario correspondiente', () => {

		const output = 
		transaction.outputs.find(( {address} ) => address === receptAddress);

		expect(output.amount).toEqual(amount);

	});


	describe('Calcular transacciones con montos superiores a nuestro balance', () => {

		beforeEach(() =>{
          amount = 500;
          transaction = undefined;
		});


		it('no se creo la transaccion', () => {

			expect(() => {
				transaction = 
				Transaction.create(wallet, receptAddress, amount);
			}).toThrowError(`Tu envío es: ${amount}, excede tu balance`);

		});

	});

	it('ingresa saldo en la wallet', () => {
		expect(transaction.input.amount).toEqual(wallet.balance);
	});

	it('address del remitente de la wallet()', () => {
		expect(transaction.input.address).toEqual(wallet.publicKey);
	});

	it('firmar usando signature de la wallet', () =>{
		expect(typeof transaction.input.signature).toEqual('object');
		expect(transaction.input.signature).toEqual(wallet.sign(transaction.outputs));

	});


	it('validar transacción verify()', () => {
		expect(Transaction.verify(transaction)).toBe(true);
	});

	it('transacción corrupta verify()', () => {
		transaction.outputs[0].amount = 500;
		expect(Transaction.verify(transaction)).toBe(false);
	});

	describe('actualizar una transación update()', () => {

		let nextAmount;
		let nextRecipient;

		beforeEach(() => {
			nextAmount = 3;
			nextRecipient = 'matrix-1994';
			transaction = transaction.update(wallet, nextRecipient, nextAmount);
		});

		it('Restar la siguiente cantidad de la wallet remitente', () => {
			const output = transaction.outputs.find(( {address} ) => address === wallet.publicKey);
			let rest = (wallet.balance - amount - nextAmount);
			expect(output.amount).toEqual(rest);
		});

		it('Emitir una cantidad para el próximo destinatario', () =>{
			const output = transaction.outputs.find(( {address} ) => address === nextRecipient);
			expect(output.amount).toEqual(nextAmount);
		});	

	});


	describe('creando una transacción de recompensa', () => {

		beforeEach(() => {
			transaction = Transaction.reward(wallet, blockchainWallet);
		});

		it('recompensar la billetera de los mineros', () => {

			expect(transaction.outputs.length).toEqual(2);

			let output = transaction.outputs.find(( {address} ) => address === wallet.publicKey);
			expect(output.amount).toEqual(REWARD);

			output = transaction.outputs.find(( {address} ) => address === blockchainWallet.publicKey);
			expect(output.amount).toEqual(blockchainWallet.balance - REWARD);

		});


	});


});











