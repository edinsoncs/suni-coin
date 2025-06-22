import { blockchain } from '../../../service/context.js';

export default (req, res) => {
    res.json(blockchain.getValidators());
};
