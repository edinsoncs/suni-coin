import Transaction from './transaction.js';
import { gnHash, elliptic } from '../modules/index.js';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import crypto from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const INIT_BL = 20;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WALLET_DIR = path.join(__dirname, '../storage/wallets');

class Wallet{

        constructor(blockchain, initBalance = INIT_BL, mnemonic = null, path = "m/44'/0'/0'/0/0", privateKey = null){
                this.balance = initBalance;
                this.blockchain = blockchain;
                this.stakeBalance = 0;

                if(privateKey){
                        this.mnemonic = null;
                        this.keyPair = elliptic.fromPrivate(privateKey);
                        this.publicKey = this.keyPair.getPublic().encode('hex');
                        return;
                }

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

        exportEncrypted(password){
                return Wallet.encryptPrivateKey(this.keyPair.getPrivate('hex'), password);
        }

        exportPrivateKey(){
                return this.keyPair.getPrivate('hex');
        }

        static fromMnemonic(blockchain, mnemonic, initBalance = INIT_BL, path = "m/44'/0'/0'/0/0"){ 
                return new Wallet(blockchain, initBalance, mnemonic, path);
        }

        static fromPrivateKey(blockchain, privateKey, initBalance = INIT_BL){
                return new Wallet(blockchain, initBalance, null, "m/44'/0'/0'/0/0", privateKey);
        }

        static fromEncrypted(blockchain, encrypted, password, initBalance = INIT_BL){
                const pk = Wallet.decryptPrivateKey(encrypted, password);
                return Wallet.fromPrivateKey(blockchain, pk, initBalance);
        }

        saveEncrypted(password){
                const data = this.exportEncrypted(password);
                if(!existsSync(WALLET_DIR)) mkdirSync(WALLET_DIR, { recursive: true });
                writeFileSync(path.join(WALLET_DIR, `${this.publicKey}.key`), data);
        }

        static loadEncrypted(blockchain, address, password, initBalance = INIT_BL){
                const file = path.join(WALLET_DIR, `${address}.key`);
                if(!existsSync(file)) throw Error('Wallet file not found');
                const data = readFileSync(file, 'utf8');
                return Wallet.fromEncrypted(blockchain, data, password, initBalance);
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
                if(!this.blockchain){
                        return assetType === 'COIN' ? this.balance : 0;
                }
                const chainBalance = this.blockchain.getBalance(this.publicKey, assetType);
                if(assetType === 'COIN'){
                        return this.balance + chainBalance;
                }
                return chainBalance;
        }

        static encryptPrivateKey(privateKeyHex, password){
                const iv = crypto.randomBytes(16);
                const key = crypto.scryptSync(password, 'wallet-salt', 32);
                const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
                const encrypted = Buffer.concat([
                        cipher.update(Buffer.from(privateKeyHex, 'hex')),
                        cipher.final()
                ]);
                return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
        }

        static decryptPrivateKey(encrypted, password){
                const [ivHex, dataHex] = encrypted.split(':');
                const key = crypto.scryptSync(password, 'wallet-salt', 32);
                const decipher = crypto.createDecipheriv(
                        'aes-256-cbc',
                        key,
                        Buffer.from(ivHex, 'hex')
                );
                const decrypted = Buffer.concat([
                        decipher.update(Buffer.from(dataHex, 'hex')),
                        decipher.final()
                ]);
                return decrypted.toString('hex');
        }

}

export { INIT_BL, WALLET_DIR }

export default Wallet;
