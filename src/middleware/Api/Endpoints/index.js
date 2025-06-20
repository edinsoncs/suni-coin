import express from 'express';
import blocks from './blocks.js';
import transactions from './transactions.js';
import mineTransactions from './transactions_mine.js';
import walletNew from './wallet_new.js';
import walletAccess from './wallet_access.js';
import walletStake from './wallet_stake.js';
import mine from './mine.js';
import transactionsNew from './transactions_new.js';
import aiStore from './ai_store.js';
import validators from './validators.js';
import verify from './verify.js';
import blockGet from './block_get.js';
import balance from './balance.js';

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

r.route('/validators')
.get(validators);

r.route('/verify')
.get(verify);

r.route('/block/:hash')
.get(blockGet);

r.route('/balance/:address')
.get(balance);


/**
 * Methods Post
*/

r.route('/wallet/new')
.post(walletNew);

r.route('/wallet/access')
.post(walletAccess);

r.route('/wallet/stake')
.post(walletStake);


r.route('/mine')
.post(mine);

r.route('/transactions')
.post(transactionsNew);

r.route('/ai/store')
.post(aiStore);






export default r;
