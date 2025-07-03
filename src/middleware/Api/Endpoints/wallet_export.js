import { wallets } from '../../../service/context.js';

export default (req, res) => {
    const { address, password } = req.body || {};
    const wallet = wallets.find(w => w.publicKey === address);
    if (!wallet) {
        res.json({ status: 0, error: 'Wallet not found' });
        return;
    }
    if(password){
        res.json({ status: 'ok', encrypted: wallet.exportEncrypted(password) });
    } else {
        res.json({ status: 'ok', mnemonic: wallet.exportMnemonic() });
    }
};
