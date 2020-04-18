import Blockchain from './blockchain';
import Block from './block';

describe('Blockchain Test', () => {

	let blockchain;
	let blockchain2;

	beforeEach(() => {
		blockchain = new Blockchain();
		blockchain2 = new Blockchain();
	});


	it('Blockchain genesis', () => {
		const [genesisBlock] = blockchain.blocks;
		expect(genesisBlock).toEqual(Block.genesis);
		expect(blockchain.blocks.length).toEqual(1);
	});

	it('Usando addBlock()', () => {
		const data = 'tp1p1';
		blockchain.addBlock(data);

		const [, lastBlock] = blockchain.blocks;
		expect(lastBlock.data).toEqual(data);
		expect(blockchain.blocks.length).toEqual(2);

	});


	it('replace de cadena por una cadena válida', () => {
		blockchain2.addBlock('Block 2');
		blockchain2.replace(blockchain2.blocks);

		expect(blockchain2.blocks).toEqual(blockchain2.blocks);
	});

	it('no reemplazar la cadena con una menor en bloques', () => {
		blockchain.addBlock('Block 2');
		expect(() => {
			blockchain.replace(blockchain2.blocks);
		}).toThrowError('La cadena no es mas larga que la actual');

	});

	it('no reemplazar la cadena por una valida', () => {
		blockchain2.addBlock('block-2');
		blockchain2.blocks[1].data = 'ok. megacursos';
		//console.log(blockchain2.blocks);

		expect(() => {
			blockchain.replace(blockchain2.blocks);
		}).toThrowError('La cadena es invalida');

	});

});






