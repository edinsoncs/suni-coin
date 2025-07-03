import Blockchain from '../src/blockchain/index.js';
import Wallet from '../src/wallet/index.js';
import Metrics from '../src/service/metrics.js';

describe('Metrics module', () => {
  test('gather returns mempool size and node count', () => {
    const bc = new Blockchain();
    const fakeP2P = { sockets: [1, 2] };
    const metrics = new Metrics(bc, fakeP2P);
    const data = metrics.gather();
    expect(data.mempoolSize).toBe(0);
    expect(data.connectedNodes).toBe(2);
  });

  test('block time updates after new block', () => {
    const bc = new Blockchain();
    const fakeP2P = { sockets: [] };
    const metrics = new Metrics(bc, fakeP2P);
    const w = new Wallet(bc, 0);
    bc.addBlock('data', w);
    const data = metrics.gather();
    expect(typeof data.blockTime).toBe('number');
  });
});
