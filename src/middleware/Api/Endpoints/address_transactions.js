export default (req, res) => {
    const { address } = req.params;
    const txs = newBlockchain.getTransactionsForAddress(address);
    res.json(txs);
};
