import { blockchain } from '../../../service/context.js';

export default (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  if (!q) {
    return res.json([]);
  }

  const results = [];

  blockchain.blocks.forEach((block, idx) => {
    if (String(block.hash).toLowerCase().includes(q)) {
      results.push({ type: 'block', hash: block.hash, height: idx, timestamp: block.timestamp });
    }
    const data = Array.isArray(block.data) ? block.data : [];
    data.forEach(tx => {
      if (String(tx.id).toLowerCase().includes(q)) {
        results.push({ type: 'transaction', id: tx.id, blockHash: block.hash, blockIndex: idx });
      }
      if (tx.input?.address && String(tx.input.address).toLowerCase().includes(q)) {
        results.push({ type: 'address', address: tx.input.address });
      }
      if (Array.isArray(tx.outputs)) {
        tx.outputs.forEach(o => {
          if (String(o.address).toLowerCase().includes(q)) {
            results.push({ type: 'address', address: o.address });
          }
        });
      }
    });
  });

  blockchain.memoryPool.transactions.forEach(tx => {
    if (String(tx.id).toLowerCase().includes(q)) {
      results.push({ type: 'transaction', id: tx.id, pending: true });
    }
    if (tx.input?.address && String(tx.input.address).toLowerCase().includes(q)) {
      results.push({ type: 'address', address: tx.input.address });
    }
    if (Array.isArray(tx.outputs)) {
      tx.outputs.forEach(o => {
        if (String(o.address).toLowerCase().includes(q)) {
          results.push({ type: 'address', address: o.address });
        }
      });
    }
  });

  const seen = new Set();
  const unique = [];
  results.forEach(r => {
    const key = `${r.type}-${r.hash || r.id || r.address}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(r);
    }
  });

  res.json(unique.slice(0, 20));
};
