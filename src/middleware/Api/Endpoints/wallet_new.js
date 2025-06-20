import Wallet, { Transaction, blockchainWallet } from '../../../wallet/index.js';


export default (req, res) => {

        // create wallet with zero balance so funds come from the chain
        global.wallet_new = new Wallet(newBlockchain, 0);

        // create funding transaction and mine it using the blockchain wallet
        const initTx = Transaction.create(blockchainWallet, wallet_new.publicKey, 20);
        const block = newBlockchain.addBlock([initTx], blockchainWallet);

        // update wallet balances according to the blockchain
        wallet_new.balance = wallet_new.calculateBalance();
        blockchainWallet.balance = blockchainWallet.calculateBalance();

        res.json({
                status: 'ok',
                data: wallet_new.blockchainWallet(),
                block
        });

};
