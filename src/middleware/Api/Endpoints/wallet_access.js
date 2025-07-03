import { currentWallet } from '../../../service/context.js';
import Joi from '../../../utils/validator.js';

const schema = Joi.object({
        private: Joi.string().required()
});

export default (req, res) => {

        const { error, value } = schema.validate(req.body || {});
        if (error) {
                return res.status(400).json({ status: 0, error });
        }

        const my_wallet = currentWallet.sign(value.private);

        console.log(my_wallet);

        res.json({
                status: 'ok',
                data: {
                        publicKey: currentWallet.publicKey,
                        balance: currentWallet.balance
                }
        });


};
