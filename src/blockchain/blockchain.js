import Block from './block.js';
import validator from './modules/validator.js';
import MemoryPool from './memPool.js';
import { loadBlocks, saveBlocks, loadValidators, saveValidators } from './modules/storage.js';

class Blockchain {

        constructor(){
                const stored = loadBlocks();
                if(stored && Array.isArray(stored) && stored.length > 0){
                        this.blocks = stored.map((b) =>
                                new Block(
                                        b.timestamp,
                                        b.previousHash,
                                        b.data,
                                        b.hash,
                                        b.validator,
                                        b.signature
                                )
                        );
                } else {
                        this.blocks = [Block.genesis];
                }
                this.memoryPool = new MemoryPool();
                const storedValidators = loadValidators();
                this.validators = storedValidators && typeof storedValidators === 'object' ? storedValidators : {};
        }

        registerStake(publicKey, amount){
                if(!this.validators[publicKey]) this.validators[publicKey] = 0;
                this.validators[publicKey] += amount;
                saveValidators(this.validators);
        }

        addBlock(data, validatorWallet) {
                const vKey =
                        typeof validatorWallet === 'string'
                                ? validatorWallet
                                : validatorWallet.publicKey;

                if(!this.validators[vKey]){
                        if(Object.keys(this.validators).length === 0){
                                this.registerStake(vKey, 1);
                        } else {
                                throw Error('Validator has no stake');
                        }
                }

                if(Object.keys(this.validators).length > 0){
                        const selected = this.selectValidator();
                        if(selected && selected !== vKey){
                                throw Error('Validator not selected');
                        }
                }

                const previousBlock = this.blocks[this.blocks.length - 1];
                const block = Block.mine(previousBlock, data, validatorWallet);
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

        selectValidator(){
                const entries = Object.entries(this.validators);
                const total = entries.reduce((t, [, stake]) => t + Number(stake), 0);
                if(total === 0) return null;
                let rnd = Math.random() * total;
                for(const [key, stake] of entries){
                        rnd -= Number(stake);
                        if(rnd <= 0) return key;
                }
                return entries[0][0];
        }

        getStats(){
                const chainLength = this.blocks.length;
                let totalTransactions = 0;
                this.blocks.forEach(({ data }) => {
                        if(Array.isArray(data)){
                                totalTransactions += data.length;
                        } else if(data && data !== 'S-U-N-I') {
                                totalTransactions += 1;
                        }
                });
                return {
                        chainLength,
                        totalTransactions,
                        validators: this.getValidators()
                };
        }

        getTransactionsForAddress(address){
                const txs = [];
                this.blocks.forEach((block, index) => {
                        const { data = [] } = block;
                        if(Array.isArray(data)){
                                data.forEach((tx) => {
                                        const involved = tx.input?.address === address ||
                                                (Array.isArray(tx.outputs) && tx.outputs.some(o => o.address === address));
                                        if(involved){
                                                txs.push({ blockIndex: index, transaction: tx });
                                        }
                                });
                        }
                });
                return txs;
        }

        /**
         * Retrieve a block by its index in the chain
         * @param {number} index
         * @returns {Block|null}
         */
        getBlockByIndex(index){
                if(index < 0 || index >= this.blocks.length) return null;
                return this.blocks[index];
        }

        /**
         * Check if an address currently has staking power
         * @param {string} address
         * @returns {boolean}
         */
        isValidator(address){
                return Boolean(this.validators[address] && this.validators[address] > 0);
        }

        /**
         * Get all transactions contained in the blockchain
         * @returns {Array}
         */
        getAllTransactions(){
                const txs = [];
                this.blocks.forEach(({ data = [] }) => {
                        if(Array.isArray(data)) txs.push(...data);
                });
                return txs;
        }

        /**
         * Calculate extended network statistics
         * @returns {Object}
         */
        getExtendedStats(){
                const stats = this.getStats();

                if(this.blocks.length > 1){
                        const intervals = [];
                        for(let i = 1; i < this.blocks.length; i++){
                                intervals.push(this.blocks[i].timestamp - this.blocks[i - 1].timestamp);
                        }
                        stats.avgBlockTime = intervals.reduce((t, v) => t + v, 0) / intervals.length;
                } else {
                        stats.avgBlockTime = 0;
                }

                stats.totalStake = Object.values(this.validators)
                        .reduce((t, v) => t + Number(v), 0);

                stats.mempoolSize = this.memoryPool.transactions.length;

                const addresses = new Set();
                this.getAllTransactions().forEach(tx => {
                        if(tx.input?.address) addresses.add(tx.input.address);
                        if(Array.isArray(tx.outputs)){
                                tx.outputs.forEach(o => addresses.add(o.address));
                        }
                });
                stats.uniqueAddresses = addresses.size;

                return stats;
        }

}

export default Blockchain;