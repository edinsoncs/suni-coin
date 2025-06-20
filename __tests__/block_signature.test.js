import Blockchain from '../src/blockchain/index.js';
import Wallet from '../src/wallet/index.js';
import { elliptic } from '../src/modules/index.js';

describe('Block signature', () => {
    test('mined block has a valid signature', () => {
        const bc = new Blockchain();
        const wallet = new Wallet(bc, 0);
        const block = bc.addBlock('data', wallet);
        expect(block.signature).toBeDefined();
        const valid = elliptic.verifySignature(block.validator, block.signature, block.hash);
        expect(valid).toBe(true);
    });

    test('chain validation fails with wrong signature', () => {
        const bc = new Blockchain();
        const wallet = new Wallet(bc, 0);
        const block = bc.addBlock('data', wallet);
        block.signature = '00';
        expect(bc.verifyChain()).toBe(false);
    });
});
