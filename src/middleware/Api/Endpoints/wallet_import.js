import Wallet from '../../../wallet/index.js';
import context, { blockchain, wallets } from '../../../service/context.js';

export default (req, res) => {
    const { mnemonic, encrypted, password, address } = req.body || {};
    try {
        let wallet;
        if(encrypted && password){
            wallet = Wallet.fromEncrypted(blockchain, encrypted, password, 20);
        } else if(address && password){
            wallet = Wallet.loadEncrypted(blockchain, address, password, 20);
        } else {
            wallet = Wallet.fromMnemonic(blockchain, mnemonic, 20);
        }
        wallets.push(wallet);
        context.currentWallet = wallet;
        res.json({ status: 'ok', data: wallet.blockchainWallet() });
    } catch (err) {
        res.json({ status: 0, error: 'Invalid wallet data' });
    }
};
