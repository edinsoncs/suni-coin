import { blockchain } from '../../../service/context.js';

export default (req, res) => {
    const stats = blockchain.getStats();
    res.json(stats);
};
