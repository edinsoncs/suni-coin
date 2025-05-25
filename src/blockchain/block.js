import gnHash from '../modules/hash';
import mdDificulty from './modules/mdDifficulty';

const DIFFICULTY = 3; 

class Block{
        constructor(timestamp, previousHash, data, hash, nonce, difficulty){
                this.timestamp = timestamp;
                this.previousHash = previousHash;
                this.data = data;
                this.hash = hash;
                this.nonce = nonce;
                this.difficulty = difficulty;
	}

	static get genesis(){
		const timestamp = (new Date(2020, 1, 1)).getTime();
		return new this(timestamp, undefined, 'S-U-N-I', 'hash-compiled', 0, DIFFICULTY);		
	}

	static mine(previousBlock, data){
		const { "hash": previousHash } = previousBlock;
		let hash;
		let nonce = 0;
		let timestamp;
		let { difficulty } = previousBlock
		do{
			timestamp = Date.now();
			nonce += 1;
			difficulty = mdDificulty(previousBlock, timestamp);
			hash = Block.hash(timestamp, previousHash, data, nonce, difficulty);

		}while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));

		return new this(timestamp, previousHash, data, hash, nonce, difficulty);
	}

	static hash(timestamp, previousHash, data, nonce, difficulty){
		return gnHash(`${timestamp}${previousHash}${data}${nonce}${difficulty}`).toString();
	}

	toString(){

		const {
			timestamp,
			previousHash,
			data,
			hash,
			nonce,
			difficulty
		} = this;

		return ` BLOCK
		Timestamp: ${timestamp}
		Previoushash: ${previousHash}
		Data: ${data}
		Hash: ${hash}
		Nonce: ${nonce}
		Difficulty: ${difficulty}
		`;
	}

}

export { DIFFICULTY };
export default Block;



