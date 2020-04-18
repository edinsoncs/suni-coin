import express from 'express';
const r = express.Router();

//localhost:{$port}/
r.use('/', require('./Endpoints'));


module.exports = r;