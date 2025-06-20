import express from 'express';
import endpoints from './Endpoints/index.js';
const r = express.Router();

//localhost:{$port}/
r.use('/', endpoints);


export default r;
