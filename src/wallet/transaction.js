import { v1 as uuidv1 } from 'uuid';
import { elliptic } from '../modules/index.js';

const REWARD = 1;

class Transaction{

        constructor(asset = { type: 'COIN', id: null }, metadata = null){
                this.id = uuidv1();
                this.input = null;
                this.outputs = [];
                this.script = null;
                this.asset = asset;
                this.metadata = metadata;
        }

        static create(senderWallet, receptAddress, amount, script = null, asset = { type: 'COIN', id: null }, metadata = null){

                const { publicKey } = senderWallet;
                const amt = Number(amount);

                if(amt <= 0){
                        throw Error('El monto debe ser mayor a cero');
                }
                if(receptAddress === publicKey){
                        throw Error('No puedes enviarte fondos a ti mismo');
                }

                const tr = new Transaction(asset, metadata);
                tr.script = script;

                if(asset.type === 'COIN'){
                        const balance = senderWallet.calculateBalance('COIN');
                        if(amt > balance){
                                throw Error(`Tu envío es: ${amt}, excede tu balance`);
                        }

                        tr.outputs.push(...[
                                {
                                        amount: balance - amt,
                                        address: publicKey
                                },
                                {
                                        amount: amt,
                                        address: receptAddress
                                }
                        ]);

                        tr.input = Transaction.sign(tr, senderWallet, balance);
                } else {
                        tr.outputs.push({
                                amount: amt,
                                address: receptAddress
                        });

                        tr.input = Transaction.sign(tr, senderWallet, amt);
                }

                return tr;

        }

        static reward(minerWallet, blockchainWallet){
                return this.create(blockchainWallet, minerWallet.publicKey, REWARD, null, { type: 'COIN', id: null });
        }


        static verify(transaction){
                const { input: { address, signature }, outputs, script, asset = { type: 'COIN', id: null }, metadata } = transaction;
                return elliptic.verifySignature(
                        address,
                        signature,
                        JSON.stringify(outputs) + JSON.stringify(asset) + (script || '') + JSON.stringify(metadata || {})
                );
        }

        static sign(transaction, senderWallet, inputAmount){
                return {
                        timestamp: Date.now(),
                        amount: inputAmount,
                        address: senderWallet.publicKey,
                        signature: senderWallet.sign(
                                JSON.stringify(transaction.outputs) +
                                JSON.stringify(transaction.asset || {}) +
                                (transaction.script || '') +
                                JSON.stringify(transaction.metadata || {})
                        )
                };
        }

        update(senderWallet, receptAddress, amount, script = null, metadata = null) {

                if(this.asset.type !== 'COIN'){
                        throw Error('Solo las transacciones de tipo COIN pueden actualizarse');
                }

                const sendOutput = this.outputs.find((ouput) =>
                ouput.address === senderWallet.publicKey);
                const amt = Number(amount);

                if(amt <= 0)
                        throw Error('El monto debe ser mayor a cero');
                if(receptAddress === senderWallet.publicKey)
                        throw Error('No puedes enviarte fondos a ti mismo');

                if(amt > sendOutput.amount)
                        throw Error(`Tu envío es: ${amt}, excede tu balance`);

                sendOutput.amount -= amt;
                this.outputs.push({
                        amount: amt,
                        address: receptAddress
                });
                if(script) this.script = script;
                if(metadata !== null) this.metadata = metadata;
                this.input = Transaction.sign(this, senderWallet, senderWallet.calculateBalance('COIN'));

		return this;

	}

}

export { REWARD };

export default Transaction;


