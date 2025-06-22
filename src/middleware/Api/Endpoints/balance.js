import { blockchain } from '../../../service/context.js';

export default (req, res) => {
    const { address } = req.params;
    const balance = blockchain.getBalance(address);
    res.json({ address, balance });
};
