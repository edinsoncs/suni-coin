export default (req, res) => {
    const stats = newBlockchain.getStats();
    res.json(stats);
};
