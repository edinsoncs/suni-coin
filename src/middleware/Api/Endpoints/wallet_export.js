import { wallets } from '../../../service/context.js';
import Joi from '../../../utils/validator.js';

const schema = Joi.object({
    address: Joi.string().hex().required(),
    password: Joi.string().allow('', null)
});

export default (req, res) => {
    const { error, value } = schema.validate(req.body || {});
    if (error) {
        return res.status(400).json({ status: 0, error });
    }
    const { address, password } = value;
    const wallet = wallets.find(w => w.publicKey === address);
    if (!wallet) {
        return res.json({ status: 0, error: 'Wallet not found' });
    }
    if(password){
        res.json({ status: 'ok', encrypted: wallet.exportEncrypted(password) });
    } else {
        res.json({ status: 'ok', mnemonic: wallet.exportMnemonic() });
    }
};
