import Blockchain from '../src/blockchain/index.js';

describe('Blockchain stats', () => {
    test('returns basic statistics', () => {
        const bc = new Blockchain();
        const stats = bc.getStats();
        expect(stats.chainLength).toBe(bc.blocks.length);
        expect(stats.validators).toEqual(bc.getValidators());
        expect(typeof stats.totalTransactions).toBe('number');
    });
});
