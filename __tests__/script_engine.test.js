import Blockchain from '../src/blockchain/index.js';
import Wallet from '../src/wallet/index.js';
import Transaction from '../src/wallet/transaction.js';

describe('Transaction script validation', () => {
    test('valid script keeps chain valid', () => {
        const bc = new Blockchain();
        const wallet = new Wallet(bc, 50);
        const tx = Transaction.create(wallet, 'receiver', 10, 'true');
        bc.addBlock([tx], wallet);
        expect(bc.verifyChain()).toBe(true);
    });

    test('failing script invalidates chain', () => {
        const bc = new Blockchain();
        const wallet = new Wallet(bc, 50);
        const tx = Transaction.create(wallet, 'receiver', 10, 'false');
        bc.addBlock([tx], wallet);
        expect(bc.verifyChain()).toBe(false);
    });

    test('valid wasm script keeps chain valid', () => {
        const wasm = 'AGFzbQEAAAABBQFgAAF/AwIBAAcIAQRtYWluAAAKBgEEAEEBCw==';
        const bc = new Blockchain();
        const wallet = new Wallet(bc, 50);
        const tx = Transaction.create(wallet, 'receiver', 10, { type: 'wasm', code: wasm });
        bc.addBlock([tx], wallet);
        expect(bc.verifyChain()).toBe(true);
    });

    test('failing wasm script invalidates chain', () => {
        const wasm = 'AGFzbQEAAAABBQFgAAF/AwIBAAcIAQRtYWluAAAKBgEEAEEACw==';
        const bc = new Blockchain();
        const wallet = new Wallet(bc, 50);
        const tx = Transaction.create(wallet, 'receiver', 10, { type: 'wasm', code: wasm });
        bc.addBlock([tx], wallet);
        expect(bc.verifyChain()).toBe(false);
    });
});
