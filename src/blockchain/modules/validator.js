import Block from '../block.js';
import { elliptic } from '../../modules/index.js';

export default(blockchain) => {
	const [genesisBlock, ...blocks] = blockchain;

	if(
		JSON.stringify(genesisBlock) !== 
		JSON.stringify(Block.genesis))
	{
		throw Error('Genesis Block incorrecto!');
	}

        for(let i = 0; i < blocks.length; i++){
                const { previousHash, timestamp, data, hash, validator, signature } = blocks[i];
                const previousBlock = blockchain[i];

                if(previousHash !== previousBlock.hash){
                        throw Error('El anterior (Previous) hash es incorrecto');
                }
                if(hash !== Block.hash(timestamp, previousHash, data, validator)){
                        throw Error('El hash es invalido');
                }
                if(!elliptic.verifySignature(validator, signature, hash)){
                        throw Error('La firma del bloque es invalida');
                }
        }


	return true;

}