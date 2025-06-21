import Blockchain from '../src/blockchain/index.js';
import Wallet from '../src/wallet/index.js';

describe('Wallet mnemonic import/export', () => {
    test('exported mnemonic can recreate wallet', () => {
        const bc = new Blockchain();
        const w1 = new Wallet(bc, 50);
        const mnemonic = w1.exportMnemonic();
        const w2 = Wallet.fromMnemonic(bc, mnemonic, 50);
        expect(w2.publicKey).toBe(w1.publicKey);
    });
});
