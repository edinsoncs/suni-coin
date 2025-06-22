import { wallets } from '../../../service/context.js';

export default (req, res) => {
    res.json(wallets.map(w => w.blockchainWallet()));
};
