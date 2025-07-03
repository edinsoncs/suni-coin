#!/usr/bin/env node
import { Command } from 'commander';
import walletNew from '../src/middleware/Api/Endpoints/wallet_new.js';
import walletImport from '../src/middleware/Api/Endpoints/wallet_import.js';
import walletExport from '../src/middleware/Api/Endpoints/wallet_export.js';
import walletList from '../src/middleware/Api/Endpoints/wallet_list.js';
import walletStake from '../src/middleware/Api/Endpoints/wallet_stake.js';
import transactionsNew from '../src/middleware/Api/Endpoints/transactions_new.js';
import '../src/service/context.js';

function runEndpoint(handler, body = {}) {
  const req = { body };
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      console.log(JSON.stringify(data, null, 2));
    }
  };
  handler(req, res);
}

const program = new Command();
program
  .option('--api <port>', 'API port')
  .option('--p2p-port <port>', 'P2P port')
  .option('--tls-key <path>', 'TLS key path')
  .option('--tls-cert <path>', 'TLS certificate path');

program
  .command('start')
  .description('Start the node')
  .action(() => {
    const opts = program.opts();
    if (opts.api) process.env.PORT = opts.api;
    if (opts.p2pPort) process.env.P2P_PORT = opts.p2pPort;
    if (opts.tlsKey) process.env.WSS_KEY_PATH = opts.tlsKey;
    if (opts.tlsCert) process.env.WSS_CERT_PATH = opts.tlsCert;
    import('../src/service/index.js');
  });

const wallet = program.command('wallet').description('Wallet operations');

wallet
  .command('new')
  .option('-p, --password <password>', 'Password for encryption')
  .action((opts) => {
    runEndpoint(walletNew, { password: opts.password });
  });

wallet
  .command('import')
  .option('-m, --mnemonic <mnemonic>')
  .option('-e, --encrypted <encrypted>')
  .option('-p, --password <password>')
  .option('-a, --address <address>')
  .action((opts) => {
    runEndpoint(walletImport, opts);
  });

wallet
  .command('export')
  .option('-a, --address <address>')
  .option('-p, --password <password>')
  .action((opts) => {
    runEndpoint(walletExport, opts);
  });

wallet
  .command('list')
  .action(() => {
    runEndpoint(walletList, {});
  });

program
  .command('stake <amount>')
  .description('Delegate stake')
  .action((amount) => {
    runEndpoint(walletStake, { amount: Number(amount) });
  });

program
  .command('send <recipient> <amount>')
  .option('-s, --script <script>')
  .description('Send transaction')
  .action((recipient, amount, opts) => {
    runEndpoint(transactionsNew, {
      recipient,
      amount: Number(amount),
      script: opts.script,
    });
  });

program
  .command('auto-mine')
  .description('Automatically mine pending transactions')
  .option('-u, --url <url>', 'Base API URL', 'http://localhost:8000')
  .option('-i, --interval <ms>', 'Check interval in milliseconds', '5000')
  .action((opts) => {
    const api = opts.url;
    const interval = Number(opts.interval) || 5000;

    async function mineIfPending() {
      try {
        const memRes = await fetch(`${api}/api/mempool`);
        const mem = await memRes.json();
        if (Array.isArray(mem) && mem.length > 0) {
          await fetch(`${api}/api/mine/transactions`);
          console.log(`Mined ${mem.length} transaction(s)`);
        }
      } catch (err) {
        console.error('Auto mining failed:', err.message);
      }
    }

    setInterval(mineIfPending, interval);
    console.log('Auto miner running...');
  });

program.parse(process.argv);
