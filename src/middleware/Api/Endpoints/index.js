import express from 'express';
const r = express.Router();


/**
 * Methods Get
*/
r.route('/blocks')
.get(require('./blocks'));

r.route('/transactions')
.get(require('./transactions'));

r.route('/mine/transactions')
.get(require('./transactions_mine'));


/**
 * Methods Post
*/

r.route('/wallet/new')
.post(require('./wallet_new'));

r.route('/wallet/access')
.post(require('./wallet_access'));

r.route('/mine')
.post(require('./mine'));

r.route('/transactions')
.post(require('./transactions_new'));






module.exports = r;