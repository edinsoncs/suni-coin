export default (req, res) => {
    const { hash } = req.params;
    const block = newBlockchain.findBlockByHash(hash);
    if(block) {
        res.json(block);
    } else {
        res.status(404).json({ error: 'Block not found' });
    }
};
