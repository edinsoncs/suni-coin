import { blockchain } from '../../../service/context.js';

export default (req, res) => {
    const { hash } = req.params;
    const block = blockchain.findBlockByHash(hash);
    if(block) {
        res.json(block);
    } else {
        res.status(404).json({ error: 'Block not found' });
    }
};
