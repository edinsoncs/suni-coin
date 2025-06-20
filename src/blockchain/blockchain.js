import Block from './block.js';
import validator from './modules/validator.js';
import MemoryPool from './memPool.js';
import { loadBlocks, saveBlocks } from './modules/storage.js';

class Blockchain {

        constructor(){
                const stored = loadBlocks();
                if(stored && Array.isArray(stored) && stored.length > 0){
                        this.blocks = stored.map((b) => new Block(b.timestamp, b.previousHash, b.data, b.hash, b.validator));
                } else {
                        this.blocks = [Block.genesis];
                }
                this.memoryPool = new MemoryPool();
                this.validators = {};
        }

        registerStake(publicKey, amount){
                if(!this.validators[publicKey]) this.validators[publicKey] = 0;
                this.validators[publicKey] += amount;
        }

        addBlock(data, validatorKey){
                if(!this.validators[validatorKey]){
                        throw Error('Validator has no stake');
                }
                const previousBlock = this.blocks[this.blocks.length - 1];
                const block = Block.mine(previousBlock, data, validatorKey);
                this.blocks.push(block);
                saveBlocks(this.blocks);

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
                saveBlocks(this.blocks);

                return this.blocks;

        }

        getLatestBlock(){
                return this.blocks[this.blocks.length - 1];
        }

        verifyChain(chain = this.blocks){
                try {
                        validator(chain);
                        return true;
                } catch(err){
                        return false;
                }
        }

        findBlockByHash(hash){
                return this.blocks.find((block) => block.hash === hash);
        }

        getBalance(address){
                let balance = 0;
                this.blocks.forEach(({data = []}) => {
                        if(Array.isArray(data)){
                                data.forEach(({input, outputs}) => {
                                        outputs.forEach(({address: addr, amount}) => {
                                                if(addr === address) balance += Number(amount);
                                        });
                                        if(input.address === address) balance -= Number(input.amount);
                                });
                        }
                });
                return balance;
        }

        getStakeOf(validatorKey){
                return this.validators[validatorKey] || 0;
        }

        getValidators(){
                return { ...this.validators };
        }

}

export default Blockchain;