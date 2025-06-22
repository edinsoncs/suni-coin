import express from 'express';
import bodyParser from 'body-parser';
import context from './context.js';
import middleware from '../middleware/index.js';


const app = express();
const { PORT = 8000 } = process.env;


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

app.listen(PORT, () => {
        context.p2pAction.listen();
});
