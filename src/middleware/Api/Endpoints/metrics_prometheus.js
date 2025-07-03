import { blockchain, p2pAction } from '../../../service/context.js';

export default (req, res) => {
  const stats = blockchain.getExtendedStats();
  const connectedNodes = p2pAction.sockets.length;

  const lines = [
    '# HELP bydchain_block_height Current chain length',
    '# TYPE bydchain_block_height gauge',
    `bydchain_block_height ${stats.chainLength}`,
    '# HELP bydchain_total_transactions Total transactions on chain',
    '# TYPE bydchain_total_transactions counter',
    `bydchain_total_transactions ${stats.totalTransactions}`,
    '# HELP bydchain_total_stake Sum of validator stakes',
    '# TYPE bydchain_total_stake gauge',
    `bydchain_total_stake ${stats.totalStake}`,
    '# HELP bydchain_avg_block_time Average time between blocks',
    '# TYPE bydchain_avg_block_time gauge',
    `bydchain_avg_block_time ${stats.avgBlockTime}`,
    '# HELP bydchain_mempool_size Pending transactions in mempool',
    '# TYPE bydchain_mempool_size gauge',
    `bydchain_mempool_size ${stats.mempoolSize}`,
    '# HELP bydchain_connected_nodes Connected peers',
    '# TYPE bydchain_connected_nodes gauge',
    `bydchain_connected_nodes ${connectedNodes}`,
    '# HELP bydchain_unique_addresses Unique addresses that have transacted',
    '# TYPE bydchain_unique_addresses gauge',
    `bydchain_unique_addresses ${stats.uniqueAddresses}`
  ].join('\n');

  res.set('Content-Type', 'text/plain');
  res.send(lines + '\n');
};
