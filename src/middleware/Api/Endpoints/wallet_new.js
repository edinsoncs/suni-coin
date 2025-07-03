import Wallet from '../../../wallet/index.js';
import context, { blockchain, wallets } from '../../../service/context.js';
import Joi from '../../../utils/validator.js';

const schema = Joi.object({
        password: Joi.string().allow('', null)
});

export default (req, res) => {
        const { error, value } = schema.validate(req.body || {});
        if (error) {
                return res.status(400).json({ status: 0, error });
        }
        const { password } = value;

        const wallet = new Wallet(blockchain, 20);
        if(password){
                wallet.saveEncrypted(password);
        }
        context.currentWallet = wallet;
        wallets.push(wallet);

        res.json({
                status: 'ok',
                data: wallet.blockchainWallet()
        });
};
