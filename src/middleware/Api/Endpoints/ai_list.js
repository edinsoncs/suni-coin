export default (req, res) => {
    const aiBlocks = newBlockchain.blocks.filter(
        ({ data }) => data && data.type === 'AI_DATA'
    );
    res.json(aiBlocks);
};

