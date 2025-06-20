import express from 'express';
import home from './home.js';
const r = express.Router();


/**
 * Methods Get
*/
r.route('/')
.get(home);



export default r;
