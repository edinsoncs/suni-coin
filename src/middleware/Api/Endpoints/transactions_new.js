import { MESSAGE } from '../../../service/p2p.js';
import { currentWallet, p2pAction } from '../../../service/context.js';
import Joi from '../../../utils/validator.js';

const schema = Joi.object({
    recipient: Joi.string().hex().required(),
    amount: Joi.number().positive().required(),
    script: Joi.string().allow('', null)
});

export default (req, res) => {
        const { error, value } = schema.validate(req.body || {});
        if (error) {
                return res.status(400).json({ status: 0, error });
        }
        const { recipient, amount, script } = value;

        if(!currentWallet){
                return res.status(400).json({ error: 'No hay una wallet activa' });
        }

        try{
                const tr = currentWallet.createTransaction(recipient.trim(), amount, script);
                p2pAction.broadcast(MESSAGE.TR, tr);
                res.json(tr);
        }catch(error){
                res.status(400).json({
                        error: error.message
                });
        }
};
