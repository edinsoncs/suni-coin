export default (req, res) => {
    const valid = newBlockchain.verifyChain();
    res.json({ valid });
};
