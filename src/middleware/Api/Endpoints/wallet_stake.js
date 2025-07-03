


import { currentWallet } from '../../../service/context.js';
import Joi from '../../../utils/validator.js';

const schema = Joi.object({
    amount: Joi.number().positive().required()
});

export default (req, res) => {

    const { error, value } = schema.validate(req.body || {});
    if (error) {
        return res.status(400).json({ status: 0, error });
    }

    try {
        currentWallet.stake(value.amount);
        res.json({ status: 'ok', stake: currentWallet.stakeBalance });
    } catch (error) {
        res.json({ status: 0, error: error.message });
    }
};
