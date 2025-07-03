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
  .option('--api <port>', 'Puerto API')
  .option('--p2p-port <port>', 'Puerto P2P')
  .option('--tls-key <path>', 'Ruta clave TLS')
  .option('--tls-cert <path>', 'Ruta certificado TLS');

program
  .command('start')
  .description('Arranca el nodo')
  .action(() => {
    const opts = program.opts();
    if (opts.api) process.env.PORT = opts.api;
    if (opts.p2pPort) process.env.P2P_PORT = opts.p2pPort;
    if (opts.tlsKey) process.env.WSS_KEY_PATH = opts.tlsKey;
    if (opts.tlsCert) process.env.WSS_CERT_PATH = opts.tlsCert;
    import('../src/service/index.js');
  });

const wallet = program.command('wallet').description('Operaciones de wallet');

wallet
  .command('new')
  .option('-p, --password <password>', 'Contraseña para encriptar')
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
  .description('Aportar stake')
  .action((amount) => {
    runEndpoint(walletStake, { amount: Number(amount) });
  });

program
  .command('send <recipient> <amount>')
  .option('-s, --script <script>')
  .description('Enviar transacción')
  .action((recipient, amount, opts) => {
    runEndpoint(transactionsNew, {
      recipient,
      amount: Number(amount),
      script: opts.script,
    });
  });

program
  .command('auto-mine')
  .description('Minar automáticamente transacciones pendientes')
  .option('-u, --url <url>', 'URL base del API', 'http://localhost:8000')
  .option('-i, --interval <ms>', 'Intervalo de comprobación en milisegundos', '5000')
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
