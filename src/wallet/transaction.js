import { v1 as uuidv1 } from 'uuid';
import { elliptic } from '../modules/index.js';

const REWARD = 1;

class Transaction{

        constructor(){
                this.id = uuidv1();
                this.input = null;
                this.outputs = [];
                this.script = null;
        }

        static create(senderWallet, receptAddress, amount, script = null){

                const { balance, publicKey } = senderWallet;
                const amt = Number(amount);

                if(amt <= 0){
                        throw Error('El monto debe ser mayor a cero');
                }
                if(receptAddress === publicKey){
                        throw Error('No puedes enviarte fondos a ti mismo');
                }

                if(amt > balance){
                        throw Error(`Tu envío es: ${amt}, excede tu balance`);
                }

                const tr = new Transaction();
                tr.script = script;
		
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

                tr.input = Transaction.sign(tr, senderWallet);

		return tr;

	}

        static reward(minerWallet, blockchainWallet){
                return this.create(blockchainWallet, minerWallet.publicKey, REWARD, null);
        }


        static verify(transaction){
                const { input: { address, signature }, outputs, script } = transaction;
                return elliptic.verifySignature(
                        address,
                        signature,
                        JSON.stringify(outputs) + (script || '')
                );
        }

        static sign(transaction, senderWallet){
                return {
                        timestamp: Date.now(),
                        amount: senderWallet.balance,
                        address: senderWallet.publicKey,
                        signature: senderWallet.sign(
                                JSON.stringify(transaction.outputs) + (transaction.script || '')
                        )
                };
        }

        update(senderWallet, receptAddress, amount, script = null) {

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
                this.input = Transaction.sign(this, senderWallet);

		return this;

	}

}

export { REWARD };

export default Transaction;


