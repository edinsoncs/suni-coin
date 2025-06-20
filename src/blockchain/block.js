import gnHash from '../modules/hash.js';

class Block{
        constructor(timestamp, previousHash, data, hash, validator){
                this.timestamp = timestamp;
                this.previousHash = previousHash;
                this.data = data;
                this.hash = hash;
                this.validator = validator;
        }

        static get genesis(){
                const timestamp = (new Date(2020, 1, 1)).getTime();
                return new this(timestamp, undefined, 'S-U-N-I', 'hash-genesis', 'genesis');
        }

        static mine(previousBlock, data, validator){
                const { hash: previousHash } = previousBlock;
                const timestamp = Date.now();
                const hash = Block.hash(timestamp, previousHash, data, validator);
                return new this(timestamp, previousHash, data, hash, validator);
        }

        static hash(timestamp, previousHash, data, validator){
                return gnHash(`${timestamp}${previousHash}${JSON.stringify(data)}${validator}`).toString();
        }

	toString(){

                const {
                        timestamp,
                        previousHash,
                        data,
                        hash,
                        validator
                } = this;

		return ` BLOCK
		Timestamp: ${timestamp}
		Previoushash: ${previousHash}
		Data: ${data}
                Hash: ${hash}
                Validator: ${validator}
                `;
        }

}

export default Block;



