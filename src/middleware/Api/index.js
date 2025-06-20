import express from 'express';
import endpoints from './Endpoints/index.js';
const r = express.Router();

//localhost:3000/api
r.use('/', endpoints);

export default r;
