import { blockchain } from '../../../service/context.js';

export default (req, res) => {
    const valid = blockchain.verifyChain();
    res.json({ valid });
};
