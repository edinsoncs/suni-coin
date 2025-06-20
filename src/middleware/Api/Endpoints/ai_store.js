
export default (req, res) => {
    const { model, description, dataHash } = req.body;
    try {
        const block = newBlockchain.addBlock(
            { type: 'AI_DATA', model, description, hash: dataHash },
            newWalletMiner
        );
        p2pAction.sync();
        res.json({ status: 'ok', block });
    } catch (error) {
        res.json({ status: 0, error: error.message });
    }
};
