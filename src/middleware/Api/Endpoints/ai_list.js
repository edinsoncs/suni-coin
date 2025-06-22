import { blockchain } from '../../../service/context.js';

export default (req, res) => {
    const aiBlocks = blockchain.blocks.filter(
        ({ data }) => data && data.type === 'AI_DATA'
    );
    res.json(aiBlocks);
};

