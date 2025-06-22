import { wallets } from '../../../service/context.js';

export default (req, res) => {
    const { address } = req.body || {};
    const wallet = wallets.find(w => w.publicKey === address);
    if (!wallet) {
        res.json({ status: 0, error: 'Wallet not found' });
        return;
    }
    res.json({ status: 'ok', mnemonic: wallet.exportMnemonic() });
};
