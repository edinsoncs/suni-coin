import Blockchain from '../src/blockchain/index.js';
import Wallet from '../src/wallet/index.js';
import { getMerkleRoot, getMerkleProof } from '../src/blockchain/modules/merkle.js';

describe('Merkle tree', () => {
  test('block stores correct merkle root', () => {
    const bc = new Blockchain();
    const w = new Wallet(bc, 50);
    w.stake(1);
    const tx1 = w.createTransaction('a', 5);
    const tx2 = w.createTransaction('b', 6);
    const block = bc.addBlock([tx1, tx2], w);
    const root = getMerkleRoot([tx1, tx2]);
    expect(block.merkleRoot).toBe(root);
  });

  test('verifyMerkleProof validates inclusion', () => {
    const bc = new Blockchain();
    const w = new Wallet(bc, 50);
    w.stake(1);
    const tx1 = w.createTransaction('x', 1);
    const tx2 = w.createTransaction('y', 2);
    const block = bc.addBlock([tx1, tx2], w);
    const proof = getMerkleProof([tx1, tx2], 1);
    const valid = bc.verifyMerkleProof(tx2, proof, 1, block.merkleRoot);
    expect(valid).toBe(true);
  });
});
