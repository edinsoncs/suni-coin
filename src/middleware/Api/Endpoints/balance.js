export default (req, res) => {
    const { address } = req.params;
    const balance = newBlockchain.getBalance(address);
    res.json({ address, balance });
};
