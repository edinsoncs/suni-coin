import Blockchain from '../src/blockchain/index.js';
import Wallet from '../src/wallet/index.js';

describe('Wallet encrypted import/export', () => {
  test('encrypted private key restores wallet', () => {
    const bc = new Blockchain();
    const w1 = new Wallet(bc, 50);
    const enc = w1.exportEncrypted('testpass');
    const w2 = Wallet.fromEncrypted(bc, enc, 'testpass', 50);
    expect(w2.publicKey).toBe(w1.publicKey);
  });
});
