import Blockchain from '../src/blockchain/index.js';
import Wallet from '../src/wallet/index.js';

describe('Additional blockchain functions', () => {
  test('getBlockByIndex returns the correct block', () => {
    const bc = new Blockchain();
    const wallet = new Wallet(bc, 0);
    wallet.stake(1);
    const block = bc.addBlock('foo', wallet);
    expect(bc.getBlockByIndex(1)).toBe(block);
  });

  test('isValidator reflects staking status', () => {
    const bc = new Blockchain();
    const wallet = new Wallet(bc, 0);
    expect(bc.isValidator(wallet.publicKey)).toBe(false);
    wallet.stake(5);
    expect(bc.isValidator(wallet.publicKey)).toBe(true);
  });

  test('getAllTransactions aggregates transactions', () => {
    const bc = new Blockchain();
    const wallet = new Wallet(bc, 50);
    wallet.stake(1);
    const tx = wallet.createTransaction('receiver', 10);
    bc.addBlock([tx], wallet);
    const all = bc.getAllTransactions();
    expect(Array.isArray(all)).toBe(true);
    expect(all).toContain(tx);
  });
});
