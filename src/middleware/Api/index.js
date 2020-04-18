import express from 'express';
const r = express.Router();

//localhost:3000/api
r.use('/', require('./Endpoints'));


module.exports = r;