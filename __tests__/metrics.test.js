import Blockchain from '../src/blockchain/index.js';
import Wallet from '../src/wallet/index.js';

describe('Blockchain stats', () => {
    test('returns basic statistics', () => {
        const bc = new Blockchain();
        const stats = bc.getStats();
        expect(stats.chainLength).toBe(bc.blocks.length);
        expect(stats.validators).toEqual(bc.getValidators());
        expect(typeof stats.totalTransactions).toBe('number');
    });

    test('returns extended statistics', () => {
        const bc = new Blockchain();
        const wallet = new Wallet(bc, 50);
        wallet.stake(5);
        const tx = wallet.createTransaction('receiver', 10);
        bc.addBlock([tx], wallet);
        const ext = bc.getExtendedStats();
        expect(ext.totalStake).toBeGreaterThan(0);
        expect(typeof ext.avgBlockTime).toBe('number');
        expect(ext.uniqueAddresses).toBeGreaterThan(0);
        expect(typeof ext.mempoolSize).toBe('number');
    });
});
