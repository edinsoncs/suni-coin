import { gnHash } from '../modules/index.js';

class Block {
        constructor(timestamp, previousHash, data, hash, validator, signature) {
                this.timestamp = timestamp;
                this.previousHash = previousHash;
                this.data = data;
                this.hash = hash;
                this.validator = validator;
                this.signature = signature;
        }

        static get genesis() {
                const timestamp = (new Date(2020, 1, 1)).getTime();
                return new this(
                        timestamp,
                        undefined,
                        'S-U-N-I',
                        'hash-genesis',
                        'genesis',
                        'genesis'
                );
        }

        static mine(previousBlock, data, validatorWallet) {
                const { hash: previousHash } = previousBlock;
                const timestamp = Date.now();
                const validator =
                        typeof validatorWallet === 'string'
                                ? validatorWallet
                                : validatorWallet.publicKey;
                const hash = Block.hash(timestamp, previousHash, data, validator);
                let signature;
                if (validatorWallet && typeof validatorWallet.sign === 'function') {
                        const sig = validatorWallet.sign(hash);
                        // store as hex string for serialization
                        signature = typeof sig.toDER === 'function' ? sig.toDER('hex') : sig;
                }
                return new this(timestamp, previousHash, data, hash, validator, signature);
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
                        validator,
                        signature
                } = this;

		return ` BLOCK
		Timestamp: ${timestamp}
		Previoushash: ${previousHash}
		Data: ${data}
                Hash: ${hash}
                Validator: ${validator}
                Signature: ${signature}
                `;
        }

}

export default Block;



