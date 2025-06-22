export default (req, res) => {
    const stats = newBlockchain.getExtendedStats();
    res.json(stats);
};
