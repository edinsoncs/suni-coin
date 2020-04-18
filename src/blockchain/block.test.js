import Block, { DIFFICULTY } from './block';

describe('Test Class Block', () => {
	let timestamp;
	let previousBlock;
	let data;
	let hash;
	let nonce;
	let difficulty;

	beforeEach(() => {
		timestamp = new Date(2000, 0, 1);
		previousBlock = Block.genesis;
		data = 'bl102xaz1';
		hash = 'b-asl0-2-1-a--a-as-1-21-';
		nonce = 118;
		difficulty = DIFFICULTY;
	});

	it('primer test => instanciar parametros', () => {

		const block = new Block(timestamp, previousBlock.hash, data, hash, nonce, difficulty);
		
		expect(block.timestamp).toEqual(timestamp);
		expect(block.previousHash).toEqual(previousBlock.hash);
		expect(block.data).toEqual(data);
		expect(block.hash).toEqual(hash);
		expect(block.nonce).toEqual(nonce);

	});

	it('segundo test => propiedad estatica mine()', () => {

		const block = Block.mine(previousBlock, data);
		const { difficulty } = block;
		expect(block.hash.substring(0, difficulty)).toEqual('0'.repeat(difficulty));
		expect(block.nonce).not.toEqual(0);

		expect(block.hash.length).toEqual(64);
		expect(block.previousHash).toEqual(previousBlock.hash);
		expect(data).toEqual(data);

	});


	it('tercer test => propiedad o metodo static hash()', () => {
		hash = Block.hash(timestamp, previousBlock.hash, data, nonce, difficulty);
		var hasOutput = '837ffee4571a843c64bbd15f3de16e10ab3827b7edec2a80f425d27591593bd3';
		expect(hash).toEqual(hasOutput);
	});



	it('cuarto test => metodo toString()', () => {
		const block = Block.mine(previousBlock, data);
		expect(typeof block.toString()).toEqual('string');
		console.log(block.toString());
	});


});