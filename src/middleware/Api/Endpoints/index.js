import express from 'express';
import blocks from './blocks.js';
import transactions from './transactions.js';
import mineTransactions from './transactions_mine.js';
import walletNew from './wallet_new.js';
import walletAccess from './wallet_access.js';
import walletStake from './wallet_stake.js';
import walletList from './wallet_list.js';
import walletExport from './wallet_export.js';
import walletImport from './wallet_import.js';
import mine from './mine.js';
import transactionsNew from './transactions_new.js';
import aiStore from './ai_store.js';
import aiList from './ai_list.js';
import mempool from './mempool.js';
import validators from './validators.js';
import verify from './verify.js';
import blockGet from './block_get.js';
import transactionGet from './transaction_get.js';
import balance from './balance.js';
import addressTransactions from './address_transactions.js';
import addressStats from './address_stats.js';
import metrics from './metrics.js';
import metricsExtended from './metrics_extended.js';
import nodes from './nodes.js';
import proof from './proof.js';

const r = express.Router();


/**
 * Methods Get
*/
r.route('/blocks')
.get(blocks);

r.route('/transactions')
.get(transactions);

r.route('/mine/transactions')
.get(mineTransactions);

r.route('/mempool')
.get(mempool);

r.route('/validators')
.get(validators);

r.route('/verify')
.get(verify);

r.route('/block/:hash')
.get(blockGet);

r.route('/transaction/:id')
  .get(transactionGet);

r.route('/proof/:txId')
  .get(proof);

r.route('/balance/:address')
.get(balance);

r.route('/address/:address/transactions')
.get(addressTransactions);

r.route('/address/:address/stats')
  .get(addressStats);

r.route('/ai/list')
.get(aiList);

r.route('/metrics')
.get(metrics);

r.route('/metrics/extended')
  .get(metricsExtended);

r.route('/nodes')
  .get(nodes);

r.route('/wallet/list')
  .get(walletList);


/**
 * Methods Post
*/

r.route('/wallet/new')
.post(walletNew);

r.route('/wallet/access')
.post(walletAccess);

r.route('/wallet/stake')
.post(walletStake);

r.route('/wallet/export')
  .post(walletExport);

r.route('/wallet/import')
  .post(walletImport);


r.route('/mine')
.post(mine);

r.route('/transactions')
.post(transactionsNew);

r.route('/ai/store')
.post(aiStore);






export default r;
