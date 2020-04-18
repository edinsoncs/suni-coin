import Block from '../block';

export default(blockchain) => {
	const [genesisBlock, ...blocks] = blockchain;

	if(
		JSON.stringify(genesisBlock) !== 
		JSON.stringify(Block.genesis))
	{
		throw Error('Genesis Block incorrecto!');
	}

	for(var i = 0; i < blocks.length; i++){
		const { previousHash, timestamp, data, hash, nonce, difficulty} 
			  = blocks[i];
		const previousBlock = blockchain[i];
		
		if(previousHash !== previousBlock.hash){
			throw Error('El anterior (Previous) hash es incorrecto');
		}
		if(hash !== Block.hash(timestamp, previousHash, data, nonce, difficulty)){
			throw Error('El hash es invalido');
		}
	}


	return true;

}