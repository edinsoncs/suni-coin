export default (req, res) => {
    res.json(newBlockchain.memoryPool.transactions);
};
