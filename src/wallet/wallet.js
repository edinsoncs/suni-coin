import Transaction from './transaction.js';
import { gnHash, elliptic } from '../modules/index.js';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import crypto from 'crypto';

const INIT_BL = 100;

class Wallet{

        constructor(blockchain, initBalance = INIT_BL, mnemonic = null, path = "m/44'/0'/0'/0/0"){
                this.balance = initBalance;
                this.blockchain = blockchain;
                this.stakeBalance = 0;

                if(mnemonic){
                        this.mnemonic = mnemonic;
                } else {
                        this.mnemonic = bip39.generateMnemonic();
                }

                const seed = bip39.mnemonicToSeedSync(this.mnemonic);
                const node = bip32.fromSeed(seed);
                const child = node.derivePath(path);
                this.keyPair  = elliptic.fromPrivate(child.privateKey);
                this.publicKey = this.keyPair.getPublic().encode('hex');
        }

	toString(){

		const { balance, publicKey } = this;

		return `
			publicKey: ${publicKey.toString()}
			balance: ${balance}
		 `;
	}

        blockchainWallet(){
                const { balance, publicKey, keyPair } = this;
                return {
                        'publicKey': publicKey.toString(),
                        'balance': balance,
                }
        }

        exportMnemonic(){
                return this.mnemonic;
        }

        static fromMnemonic(blockchain, mnemonic, initBalance = INIT_BL, path = "m/44'/0'/0'/0/0"){
                return new Wallet(blockchain, initBalance, mnemonic, path);
        }

        sign(data){
                return this.keyPair.sign(gnHash(data));
        }

        stake(amount){
                if(amount > this.balance){
                        throw Error(`El monto es: ${amount} superior al balance: ${this.balance}`);
                }
                this.balance -= amount;
                this.stakeBalance += amount;
                this.blockchain.registerStake(this.publicKey, amount);
        }


        createTransaction(receptAddress, amount, script = null, asset = { type: 'COIN', id: null }){
                const { blockchain: { memoryPool } } = this;

                const isCoin = asset.type === 'COIN';
                const balance = isCoin ? this.calculateBalance('COIN') : 0;
                const amt = Number(amount);

                if(amt <= 0){
                   throw Error('El monto debe ser mayor a cero');
                }
                if(receptAddress === this.publicKey){
                   throw Error('No puedes enviarte fondos a ti mismo');
                }
                if(isCoin && amt > balance){
                   throw Error(`El monto es: ${amt} superior al balance: ${balance}`);
                }

                let tr = memoryPool.find(this.publicKey);
                if(isCoin && tr && tr.asset.type === 'COIN'){
                        tr.update(this, receptAddress, amt, script);
                } else {
                        tr = Transaction.create(this, receptAddress, amt, script, asset);
                        memoryPool.addOrUpdate(tr);
                }

                return tr;
        }

        calculateBalance(assetType = 'COIN'){
                return this.blockchain.getBalance(this.publicKey, assetType);
        }

}

export { INIT_BL }

export default Wallet;
