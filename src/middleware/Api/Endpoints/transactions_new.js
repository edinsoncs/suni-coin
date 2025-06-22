import { MESSAGE } from '../../../service/p2p.js';
import { currentWallet, p2pAction } from '../../../service/context.js';

export default (req, res) => {
        const { recipient, amount, script } = req.body || {};

        if(!currentWallet){
                return res.status(400).json({ error: 'No hay una wallet activa' });
        }

        try{
                const tr = currentWallet.createTransaction(recipient, Number(amount), script);
                p2pAction.broadcast(MESSAGE.TR, tr);
                res.json(tr);
        }catch(error){
                res.status(400).json({
                        error: error.message
                });
        }
};
