import Block from './block';
import validator from './modules/validator';
import MemoryPool from './memPool';

class Blockchain {

	constructor(){
		this.blocks = [Block.genesis];
		this.memoryPool = new MemoryPool();
	}

	addBlock(data){
		const previousBlock = this.blocks[this.blocks.length - 1];
    	const block = Block.mine(previousBlock, data);
		this.blocks.push(block);
		
		return block;
	}

	replace(newBlocks = []){
		
		if(newBlocks.length < this.blocks.length){
			throw Error('La cadena no es mas larga que la actual');
		}

		try {
			validator(newBlocks);
		}catch(error) {
			throw Error('La cadena es invalida');
		}

		this.blocks = newBlocks;

		return this.blocks;

	}

}

export default Blockchain;