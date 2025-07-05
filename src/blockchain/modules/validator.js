import Block from '../block.js';
import { elliptic, runScript, runWasm } from '../../modules/index.js';

export default(blockchain) => {
	const [genesisBlock, ...blocks] = blockchain;

	if(
		JSON.stringify(genesisBlock) !== 
		JSON.stringify(Block.genesis))
	{
                throw Error('Incorrect Genesis block!');
	}

        for(let i = 0; i < blocks.length; i++){
                const { previousHash, timestamp, data, hash, validator, signature, difficulty } = blocks[i];
                const previousBlock = blockchain[i];

                if(previousHash !== previousBlock.hash){
                        throw Error('Previous hash is incorrect');
                }
                if(hash !== Block.hash(timestamp, previousHash, data, validator, difficulty)){
                        throw Error('Hash is invalid');
                }
                if(!elliptic.verifySignature(validator, signature, hash)){
                        throw Error('Block signature is invalid');
                }

                if(Array.isArray(data)){
                        for (const tx of data) {
                                if (tx.script) {
                                        let ok;
                                        if (typeof tx.script === 'object' && tx.script.type === 'wasm') {
                                                ok = runWasm(tx.script.code, { tx });
                                        } else {
                                                ok = runScript(tx.script, { tx });
                                        }
                                        if (!ok) {
                                                throw Error('Invalid transaction script');
                                        }
                                }
                        }
                }
        }


	return true;

}