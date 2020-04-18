import express from 'express';
const r = express.Router();


/**
 * Methods Get
*/
r.route('/')
.get(require('./home'));