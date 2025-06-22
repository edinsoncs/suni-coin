import { blockchain } from '../../../service/context.js';

export default (req, res) => {

        const { memoryPool: { transactions } }  = blockchain;
        res.json(transactions);

};
