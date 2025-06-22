import Wallet from '../../../wallet/index.js';
import context, { blockchain, wallets } from '../../../service/context.js';

export default (req, res) => {
    const { mnemonic } = req.body || {};
    try {
        const wallet = Wallet.fromMnemonic(blockchain, mnemonic, 20);
        wallets.push(wallet);
        context.currentWallet = wallet;
        res.json({ status: 'ok', data: wallet.blockchainWallet() });
    } catch (err) {
        res.json({ status: 0, error: 'Invalid mnemonic' });
    }
};
