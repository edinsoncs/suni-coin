import { blockchain } from '../../../service/context.js';

export default (req, res) => {
    const { address } = req.params;
    const txs = blockchain.getTransactionsForAddress(address);
    res.json(txs);
};
