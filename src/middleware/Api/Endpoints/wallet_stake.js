


import { currentWallet } from '../../../service/context.js';

export default (req, res) => {

    const { body: { amount } } = req;
    try {
        currentWallet.stake(Number(amount));
        res.json({ status: 'ok', stake: currentWallet.stakeBalance });
    } catch (error) {
        res.json({ status: 0, error: error.message });
    }
};
