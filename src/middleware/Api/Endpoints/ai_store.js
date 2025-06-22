
import { blockchain, walletMiner, p2pAction } from '../../../service/context.js';

export default (req, res) => {
    const { model, description, dataHash } = req.body;
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
