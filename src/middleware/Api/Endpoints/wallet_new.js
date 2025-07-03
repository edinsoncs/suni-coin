import Wallet from '../../../wallet/index.js';
import context, { blockchain, wallets } from '../../../service/context.js';
import { saveWallets } from '../../../service/walletStorage.js';

export default (req, res) => {
        const { password } = req.body || {};
        const wallet = new Wallet(blockchain, 20);
        if(password){
                wallet.saveEncrypted(password);
        }
        context.currentWallet = wallet;
        wallets.push(wallet);
        saveWallets(wallets);

        res.json({
                status: 'ok',
                data: wallet.blockchainWallet()
        });
};
