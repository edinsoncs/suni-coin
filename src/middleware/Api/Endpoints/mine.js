import { blockchain, walletMiner, p2pAction } from '../../../service/context.js';
import Joi from '../../../utils/validator.js';

const schema = Joi.object({
        data: Joi.string().required()
});

export default (req, res) => {

        const { error, value } = schema.validate(req.body || {});
        if (error) {
                return res.status(400).json({ status: 0, error });
        }

        blockchain.setCurrentDelegate(walletMiner.publicKey);
        const block = blockchain.addBlock(value.data, walletMiner);
        p2pAction.sync();

        res.json({
                'blocks': blockchain.blocks.length,
                block
        });

};
