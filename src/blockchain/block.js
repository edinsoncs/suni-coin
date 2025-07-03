import { gnHash } from '../modules/index.js';
import adjustDifficulty from './modules/mdDifficulty.js';
import { getMerkleRoot } from './modules/merkle.js';

class Block {
        constructor(timestamp, previousHash, data, hash, validator, signature, difficulty = 1, merkleRoot = '') {
                this.timestamp = timestamp;
                this.previousHash = previousHash;
                this.data = data;
                this.hash = hash;
                this.validator = validator;
                this.signature = signature;
                this.difficulty = difficulty;
                this.merkleRoot = merkleRoot;
        }

        static get genesis() {
                const timestamp = (new Date(2020, 1, 1)).getTime();
                return new this(
                        timestamp,
                        undefined,
                        'S-U-N-I',
                        'hash-genesis',
                        'genesis',
                        'genesis',
                        1,
                        gnHash('S-U-N-I')
                );
        }

        static mine(previousBlock, data, validatorWallet) {
                const { hash: previousHash } = previousBlock;
                const timestamp = Date.now();
                const difficulty = adjustDifficulty(previousBlock, timestamp);
                const validator =
                        typeof validatorWallet === 'string'
                                ? validatorWallet
                                : validatorWallet.publicKey;
                const hash = Block.hash(timestamp, previousHash, data, validator, difficulty);
                const merkleRoot = Array.isArray(data) ? getMerkleRoot(data) : gnHash(data);
                let signature;
                if (validatorWallet && typeof validatorWallet.sign === 'function') {
                        const sig = validatorWallet.sign(hash);
                        // store as hex string for serialization
                        signature = typeof sig.toDER === 'function' ? sig.toDER('hex') : sig;
                }
                return new this(timestamp, previousHash, data, hash, validator, signature, difficulty, merkleRoot);
        }

        static hash(timestamp, previousHash, data, validator, difficulty){
                return gnHash(`${timestamp}${previousHash}${JSON.stringify(data)}${validator}${difficulty}`).toString();
        }

	toString(){

                const {
                        timestamp,
                        previousHash,
                        data,
                        hash,
                        validator,
                        signature,
                        difficulty,
                        merkleRoot
                } = this;

		return ` BLOCK
		Timestamp: ${timestamp}
		Previoushash: ${previousHash}
		Data: ${data}
                Hash: ${hash}
                Validator: ${validator}
                Signature: ${signature}
                Difficulty: ${difficulty}
                MerkleRoot: ${merkleRoot}
                `;
        }

}

export default Block;



