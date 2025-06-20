module.exports = (req, res, next) => {
    const { body: { amount } } = req;
    try {
        wallet_new.stake(Number(amount));
        res.json({ status: 'ok', stake: wallet_new.stakeBalance });
    } catch (error) {
        res.json({ status: 0, error: error.message });
    }
};
