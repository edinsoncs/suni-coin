import Block from '../block.js';
import { elliptic, runScript, runWasm } from '../../modules/index.js';

export default(blockchain) => {
	const [genesisBlock, ...blocks] = blockchain;

	if(
		JSON.stringify(genesisBlock) !== 
		JSON.stringify(Block.genesis))
	{
		throw Error('Genesis Block incorrecto!');
	}

        for(let i = 0; i < blocks.length; i++){
                const { previousHash, timestamp, data, hash, validator, signature, difficulty } = blocks[i];
                const previousBlock = blockchain[i];

                if(previousHash !== previousBlock.hash){
                        throw Error('El anterior (Previous) hash es incorrecto');
                }
                if(hash !== Block.hash(timestamp, previousHash, data, validator, difficulty)){
                        throw Error('El hash es invalido');
                }
                if(!elliptic.verifySignature(validator, signature, hash)){
                        throw Error('La firma del bloque es invalida');
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
                                                throw Error('Script de transaccion invalido');
                                        }
                                }
                        }
                }
        }


	return true;

}