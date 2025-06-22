import Blockchain from '../src/blockchain/index.js';
import Wallet from '../src/wallet/index.js';
import Block from '../src/blockchain/block.js';

describe('Additional blockchain functions', () => {
  test('getBlockByIndex returns genesis and mined blocks', () => {
    const bc = new Blockchain();
    const wallet = new Wallet(bc, 0);
    const mined = bc.addBlock('data', wallet);
    expect(bc.getBlockByIndex(0)).toEqual(Block.genesis);
    expect(bc.getBlockByIndex(1)).toEqual(mined);
    expect(bc.getBlockByIndex(99)).toBeNull();
  });

  test('getAllTransactions aggregates transactions', () => {
    const bc = new Blockchain();
    const wallet = new Wallet(bc, 0);
    bc.addBlock(['tx1', 'tx2'], wallet);
    const txs = bc.getAllTransactions();
    expect(txs.length).toBe(2);
    expect(txs[0].blockIndex).toBe(1);
  });

  test('getAverageBlockTime returns positive number', () => {
    const bc = new Blockchain();
    const wallet = new Wallet(bc, 0);
    bc.addBlock('a', wallet);
    bc.addBlock('b', wallet);
    const avg = bc.getAverageBlockTime();
    expect(avg).toBeGreaterThan(0);
  });
});
