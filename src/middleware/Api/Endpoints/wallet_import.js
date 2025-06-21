import Wallet from '../../../wallet/index.js';

export default (req, res) => {
    const { mnemonic } = req.body || {};
    try {
        const wallet = Wallet.fromMnemonic(newBlockchain, mnemonic, 20);
        if (!global.wallets) global.wallets = [];
        global.wallets.push(wallet);
        res.json({ status: 'ok', data: wallet.blockchainWallet() });
    } catch (err) {
        res.json({ status: 0, error: 'Invalid mnemonic' });
    }
};
