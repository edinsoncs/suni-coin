
import { blockchain, walletMiner, p2pAction } from '../../../service/context.js';
import Joi from '../../../utils/validator.js';

const schema = Joi.object({
    model: Joi.string().required(),
    description: Joi.string().required(),
    dataHash: Joi.string().required()
});

export default (req, res) => {
    const { error, value } = schema.validate(req.body || {});
    if (error) {
        return res.status(400).json({ status: 0, error });
    }
    const { model, description, dataHash } = value;
    try {
        const block = blockchain.addBlock(
            { type: 'AI_DATA', model, description, hash: dataHash },
            walletMiner
        );
        p2pAction.sync();
        res.json({ status: 'ok', block });
    } catch (error) {
        res.json({ status: 0, error: error.message });
    }
};
