jest.mock('../src/wallet/index.js', () => ({
  __esModule: true,
  Transaction: { reward: jest.fn() },
  blockchainWallet: 'chainWallet'
}));

import Miner from '../src/miner/miner.js';
import { Transaction, blockchainWallet } from '../src/wallet/index.js';
import { MESSAGE } from '../src/service/p2p.js';

beforeEach(() => {
  Transaction.reward.mockReset();
});

describe('Miner.mine', () => {
  test('throws when mempool empty', () => {
    const bc = { memoryPool: { transactions: [] } };
    const p2p = {};
    const wallet = {};
    const miner = new Miner(bc, p2p, wallet);
    expect(() => miner.mine()).toThrow('Transaction not confirmed');
  });

  test('mines block and clears mempool', () => {
    const rewardTx = { id: 'reward' };
    Transaction.reward.mockReturnValue(rewardTx);
    const mempool = {
      transactions: [{ id: 'tx1' }],
      wipe: jest.fn(function () { this.transactions = []; })
    };
    const block = { index: 1 };
    const bc = {
      memoryPool: mempool,
      addBlock: jest.fn(() => block)
    };
    const p2p = { sync: jest.fn(), broadcast: jest.fn() };
    const wallet = { pk: 'miner' };
    const miner = new Miner(bc, p2p, wallet);

    const result = miner.mine();

    expect(Transaction.reward).toHaveBeenCalledWith(wallet, blockchainWallet);
    expect(bc.addBlock).toHaveBeenCalledWith([{ id: 'tx1' }, rewardTx], wallet);
    expect(p2p.sync).toHaveBeenCalled();
    expect(mempool.wipe).toHaveBeenCalled();
    expect(p2p.broadcast).toHaveBeenCalledWith(MESSAGE.WIPE);
    expect(result).toBe(block);
    expect(mempool.transactions).toEqual([]);
  });
});
