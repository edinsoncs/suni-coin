import Blockchain from '../blockchain';
import validator from './validator';

describe('Validator test', () => {
	let blockchain;

	beforeEach(() => {
		blockchain = new Blockchain();
	});


	it('Validacion de nuestra moneda', () => {
		blockchain.addBlock('Block - 2');
		blockchain.addBlock('Block - 3');

		expect(validator(blockchain.blocks)).toBe(true);

	});

	it('Bloque GENESIS incorrecto', () => {
		blockchain.blocks[0].data = 'hola,soy,pepito';
		//console.log(blockchain.blocks[0]);
		expect(() => {
			validator(blockchain.blocks);
		}).toThrowError('Genesis Block incorrecto!');
	});

	it('Incorrecto el previousHash', () => {
		blockchain.addBlock('block-2');
		//console.log(blockchain.blocks[1]);
		blockchain.blocks[1].previousHash = 'hash-201-a0020201-31210alao2';

		expect(() => {
			validator(blockchain.blocks);
		}).toThrowError('El anterior (Previous) hash es incorrecto');
	});


	it('La moneda es incorrect', () => {
		blockchain.addBlock('block-2');
		//console.log(blockchain.blocks[1]);
		blockchain.blocks[1].hash = 'sha-256-0129012';
		expect(() => {
			validator(blockchain.blocks);
		}).toThrowError('El hash es invalido');
	});

});
