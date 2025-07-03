import { blockchain } from '../../../service/context.js';

export default (req, res) => {
    const { address } = req.params;
    const stats = blockchain.getAddressStats(address);
    res.json(stats);
};
