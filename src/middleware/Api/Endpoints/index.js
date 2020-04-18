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
r.route('/mine')
.post(require('./mine'));

r.route('/transactions')
.post(require('./transactions_new'));



module.exports = r;