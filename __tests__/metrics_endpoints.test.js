jest.mock('../src/service/context.js', () => ({
  __esModule: true,
  blockchain: { getExtendedStats: jest.fn() },
  p2pAction: { sockets: [] }
}));

import metricsExtended from '../src/middleware/Api/Endpoints/metrics_extended.js';
import metricsPrometheus from '../src/middleware/Api/Endpoints/metrics_prometheus.js';
import { blockchain, p2pAction } from '../src/service/context.js';

beforeEach(() => {
  blockchain.getExtendedStats.mockReset();
  p2pAction.sockets = [];
});

describe('Metrics API endpoints', () => {
  test('metrics_extended returns stats as json', () => {
    const stats = { chainLength: 2 };
    blockchain.getExtendedStats.mockReturnValue(stats);
    const res = { json: jest.fn() };
    metricsExtended({}, res);
    expect(blockchain.getExtendedStats).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(stats);
  });

  test('metrics_prometheus returns formatted metrics', () => {
    const stats = {
      chainLength: 5,
      totalTransactions: 7,
      totalStake: 3,
      avgBlockTime: 10,
      mempoolSize: 0,
      uniqueAddresses: 4
    };
    blockchain.getExtendedStats.mockReturnValue(stats);
    p2pAction.sockets = [1, 2, 3];
    const res = { set: jest.fn(), send: jest.fn() };
    metricsPrometheus({}, res);
    expect(res.set).toHaveBeenCalledWith('Content-Type', 'text/plain');
    const sent = res.send.mock.calls[0][0];
    expect(sent).toContain(`bydchain_block_height ${stats.chainLength}`);
    expect(sent).toContain(`bydchain_total_transactions ${stats.totalTransactions}`);
    expect(sent).toContain(`bydchain_total_stake ${stats.totalStake}`);
    expect(sent).toContain(`bydchain_avg_block_time ${stats.avgBlockTime}`);
    expect(sent).toContain(`bydchain_mempool_size ${stats.mempoolSize}`);
    expect(sent).toContain(`bydchain_connected_nodes ${p2pAction.sockets.length}`);
    expect(sent).toContain(`bydchain_unique_addresses ${stats.uniqueAddresses}`);
  });
});
