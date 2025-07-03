import { blockchain } from '../../../service/context.js';
import { getMerkleProof } from '../../../blockchain/modules/merkle.js';

export default (req, res) => {
  const { txId } = req.params;
  for(let i = 0; i < blockchain.blocks.length; i++){
    const { data } = blockchain.blocks[i];
    if(Array.isArray(data)){
      const index = data.findIndex(t => t.id === txId);
      if(index >= 0){
        const proof = getMerkleProof(data, index);
        return res.json({
          blockIndex: i,
          index,
          proof,
          merkleRoot: blockchain.blocks[i].merkleRoot
        });
      }
    }
  }
  res.status(404).json({ error: 'Transaction not found' });
};
