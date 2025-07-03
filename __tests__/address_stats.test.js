import Blockchain from '../src/blockchain/index.js';
import Wallet from '../src/wallet/index.js';

describe('Address statistics', () => {
  test('getAddressStats aggregates sent and received', () => {
    const bc = new Blockchain();
    const w1 = new Wallet(bc, 50);
    const w2 = new Wallet(bc, 50);
    w1.stake(1);
    const tx = w1.createTransaction(w2.publicKey, 10);
    bc.addBlock([tx], w1);
    const s1 = bc.getAddressStats(w1.publicKey);
    const s2 = bc.getAddressStats(w2.publicKey);
    expect(s1.sent).toBe(10);
    expect(s1.received).toBe(39); // change output to self
    expect(s1.txCount).toBe(1);
    expect(s2.received).toBe(10);
    expect(s2.sent).toBe(0);
  });
});
