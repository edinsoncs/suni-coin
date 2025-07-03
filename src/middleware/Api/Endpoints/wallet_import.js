import Wallet from '../../../wallet/index.js';
import context, { blockchain, wallets } from '../../../service/context.js';
import Joi from '../../../utils/validator.js';

const schema = Joi.object({
    mnemonic: Joi.string().allow('', null),
    encrypted: Joi.string().allow('', null),
    password: Joi.string().allow('', null),
    address: Joi.string().hex().allow('', null)
});

export default (req, res) => {
    const { error, value } = schema.validate(req.body || {});
    if (error) {
        return res.status(400).json({ status: 0, error });
    }
    const { mnemonic, encrypted, password, address } = value;
    try {
        let wallet;
        if(encrypted && password){
            wallet = Wallet.fromEncrypted(blockchain, encrypted, password, 20);
        } else if(address && password){
            wallet = Wallet.loadEncrypted(blockchain, address, password, 20);
        } else if(mnemonic){
            wallet = Wallet.fromMnemonic(blockchain, mnemonic, 20);
        } else {
            return res.status(400).json({ status: 0, error: 'Wallet data missing' });
        }
        wallets.push(wallet);
        context.currentWallet = wallet;
        res.json({ status: 'ok', data: wallet.blockchainWallet() });
    } catch (err) {
        res.json({ status: 0, error: 'Invalid wallet data' });
    }
};
