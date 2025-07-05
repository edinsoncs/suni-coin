import { MESSAGE } from '../../../service/p2p.js';
import { currentWallet, wallets, p2pAction } from '../../../service/context.js';
import Joi from '../../../utils/validator.js';

const schema = Joi.object({
    recipient: Joi.string().required(),
    amount: Joi.number().positive().required(),
    script: Joi.string().allow('', null),
    sender: Joi.string().allow('', null)
});

export default (req, res) => {
        const { error, value } = schema.validate(req.body || {});
        if (error) {
                return res.status(400).json({ status: 0, error });
        }
        let { recipient, amount, script, sender } = value;
        recipient = recipient.trim();
        if(recipient.startsWith('0x') || recipient.startsWith('0X')){
                recipient = recipient.slice(2);
        }
        if(!/^[a-fA-F0-9]+$/.test(recipient)){
                return res.status(400).json({ error: 'Invalid recipient address' });
        }

        let wallet = currentWallet;
        if(sender){
                const w = wallets.find(wl => wl.publicKey === sender.trim());
                if(w) wallet = w;
        }

        if(!wallet){
                return res.status(400).json({ error: 'No hay una wallet activa' });
        }

        try{
                const tr = wallet.createTransaction(recipient, amount, script);
                p2pAction.broadcast(MESSAGE.TR, tr);
                res.json(tr);
        }catch(error){
                res.status(400).json({
                        error: error.message
                });
        }
};
