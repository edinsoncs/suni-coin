import { blockchain } from '../../../service/context.js';

export default (req, res) => {
    const stats = blockchain.getExtendedStats();
    res.json(stats);
};
