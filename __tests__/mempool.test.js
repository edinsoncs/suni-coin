jest.mock('../src/blockchain/modules/storage.js', () => ({
  __esModule: true,
  loadMempool: jest.fn(() => []),
  saveMempool: jest.fn(),
}));

import MemoryPool from '../src/blockchain/memPool.js';
import Wallet from '../src/wallet/wallet.js';
import Transaction from '../src/wallet/transaction.js';
import { saveMempool } from '../src/blockchain/modules/storage.js';

function createWallet() {
  const fakeChain = { getBalance: () => 100 };
  return new Wallet(fakeChain, 0);
}

describe('MemoryPool', () => {
  beforeEach(() => {
    saveMempool.mockClear();
  });

  test('addOrUpdate adds a new transaction', () => {
    const wallet = createWallet();
    const tx = new Transaction();
    tx.outputs.push({ amount: 10, address: 'receiver' });
    tx.input = Transaction.sign(tx, wallet, 10);

    const mp = new MemoryPool();
    mp.addOrUpdate(tx);

    expect(mp.transactions).toHaveLength(1);
    expect(mp.transactions[0]).toBe(tx);
    expect(saveMempool).toHaveBeenCalledWith([tx]);
  });

  test('addOrUpdate replaces existing transaction', () => {
    const wallet = createWallet();
    const tx = new Transaction();
    tx.outputs.push({ amount: 5, address: 'one' });
    tx.input = Transaction.sign(tx, wallet, 5);

    const mp = new MemoryPool();
    mp.addOrUpdate(tx);

    const updated = new Transaction();
    updated.id = tx.id;
    updated.outputs.push({ amount: 7, address: 'two' });
    updated.input = Transaction.sign(updated, wallet, 7);

    saveMempool.mockClear();
    mp.addOrUpdate(updated);

    expect(mp.transactions).toHaveLength(1);
    expect(mp.transactions[0]).toBe(updated);
    expect(saveMempool).toHaveBeenCalledWith([updated]);
  });

  test('find returns transaction and wipe clears pool', () => {
    const wallet = createWallet();
    const tx = new Transaction();
    tx.outputs.push({ amount: 20, address: 'dest' });
    tx.input = Transaction.sign(tx, wallet, 20);

    const mp = new MemoryPool();
    mp.addOrUpdate(tx);

    const found = mp.find(wallet.publicKey);
    expect(found).toBe(tx);

    saveMempool.mockClear();
    mp.wipe();
    expect(mp.transactions).toHaveLength(0);
    expect(saveMempool).toHaveBeenCalledWith([]);
  });
});
