import express from 'express';
import bodyParser from 'body-parser';
import context from './context.js';
import middleware from '../middleware/index.js';
import Metrics from './metrics.js';


const app = express();
const { PORT = 8000 } = process.env;
const metrics = new Metrics(context.blockchain, context.p2pAction);


app.use(bodyParser.json());
// Allow cross-origin requests so the Next.js frontend can call the API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
middleware(app);

const server = app.listen(PORT, () => {
        context.p2pAction.listen();
        metrics.listen(server);
});
