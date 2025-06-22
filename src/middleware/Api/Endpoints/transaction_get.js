import { blockchain } from '../../../service/context.js';

export default (req, res) => {
  const { id } = req.params;
  const memTx = blockchain.memoryPool.transactions.find(t => t.id === id);
  if (memTx) {
    return res.json({ status: 'pending', transaction: memTx });
  }

  for (let i = blockchain.blocks.length - 1; i >= 0; i--) {
    const { data } = blockchain.blocks[i];
    if (Array.isArray(data)) {
      const found = data.find(t => t.id === id);
      if (found) {
        return res.json({
          status: 'confirmed',
          blockIndex: i,
          transaction: found
        });
      }
    }
  }

  res.status(404).json({ error: 'Transaction not found' });
};
