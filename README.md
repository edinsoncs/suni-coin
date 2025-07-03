# BYDChain

BYDChain is an experimental Delegated Proof‑of‑Stake blockchain written in Node.js. It includes
a lightweight wallet, mining utilities and a web interface styled with
Tailwind CSS. The Next.js frontend now offers a basic explorer in the spirit of
Etherscan or Solscan. The project is focused on exploring how blockchain technology can
be used alongside Artificial Intelligence. The chain can store AI dataset or
model information so researchers can track and share their assets.


## Why AI?

AI projects often need a trusted ledger to exchange data or rewards. BYDChain aims
to be a minimal starting point for that purpose. Blocks can store hashes of
datasets or model checkpoints while tokens can be used to incentivise agents.

## Getting Started

1. Install dependencies and start the node:

   ```bash
   npm install
   npm run dev
  ```

2. Open `http://localhost:3000` in your browser to access the new Next.js front end.
   The blockchain API continues to run on `http://localhost:8000`.
   Cross-origin requests are allowed so the UI can communicate with the API while both servers run on different ports.

Chain data is automatically saved to disk so blocks remain after you restart the server.

Multiple nodes can be launched using the extra `start:*` scripts in
`package.json`.

### Desktop Builds

The same interface can be wrapped in an Electron shell so it runs like a
regular application on Windows or macOS.

```bash
npm run build            # export the Next.js frontend
npm run desktop:win      # create a Windows installer
npm run desktop:mac      # create a macOS installer
```

## How It Works

BYDChain keeps a chain of blocks linked with hashes. Transactions are collected in a
pool and can be mined via the "Mine Transactions" button on the web interface.
Blocks are minted using a Delegated Proof‑of‑Stake model where the top
validators by stake take turns producing blocks.

### AI Data Blocks

Use `POST /api/ai/store` to record metadata about models or datasets on chain.
Each block will contain fields `model`, `description` and `hash` so you can
track AI assets over time. List all recorded AI blocks via
`GET /api/ai/list`.

### Smart Contract Scripts

Transactions may include a small JavaScript snippet stored in the `script`
field. When new blocks are validated these scripts are executed in a sandboxed
VM. The block is rejected if any script returns `false`. This allows simple
conditions such as enforcing minimum payments or custom rules without a full
virtual machine.

For more advanced logic the chain now also accepts WebAssembly contracts. To
use this, include an object `{ type: 'wasm', code: '<base64>' }` in the
`script` field where `code` is a base64 encoded WebAssembly module exporting a
`main` function that returns `1` on success. These modules run in a minimal
environment, providing the transaction data through the `env` import object.

### API Endpoints

The REST API exposes several helpers for querying the chain:

- `GET /api/validators` – list validator stakes
- `GET /api/verify` – check whether the chain is valid
- `GET /api/block/:hash` – fetch a block by its hash
- `GET /api/balance/:address` – show the balance of a wallet address
- `GET /api/address/:address/transactions` – list all transactions involving an address
- `GET /api/address/:address/stats` – summarize sent and received amounts for an address
- `GET /api/ai/list` – list all blocks that contain AI data
- `GET /api/metrics` – retrieve overall blockchain statistics
- `GET /api/metrics/extended` – retrieve advanced network statistics

### Blockchain Utilities

Several helper methods are exposed through the `Blockchain` class:

- `verifyChain()` returns `true` if every block links correctly and the
  stored hashes match.
- `findBlockByHash(hash)` looks up a specific block based on its hash.
- `getBalance(address)` aggregates all transactions to compute the balance
  for a wallet.
- `getStakeOf(key)` returns how many tokens a validator has staked.
- `getValidators()` gives the full validator table.
- `getExtendedStats()` provides advanced chain metrics.
- `getAddressStats(address)` summarizes total sent and received amounts for an address.

Validators are persisted to `src/storage/validators.json` and a random
validator is now selected based on stake when new blocks are mined.

You can inspect pending transactions via `GET /api/mempool`.

### Mining Transactions

Pending transfers remain in the mempool until a block is produced. You can
manually confirm them from the UI by pressing **Mine Transactions** or by
calling `GET /api/mine/transactions`.

For unattended nodes run `npm run cli -- auto-mine` in a separate terminal.
This command checks the mempool every few seconds and mines a new block
whenever pending transactions are detected. You can adjust the polling
interval and API URL with `--interval` and `--url` options.

The chain is loaded from `src/storage/chain.json` on start and saved back to
this file whenever new blocks are added, ensuring persistence between restarts.


### For Developers

- Node.js 18 or later is recommended.
- REST API endpoints are defined in `src/middleware/Api/Endpoints`.
- Frontend pages are built with Next.js under `pages/` and styled with
  Tailwind CSS via CDN.
- The blockchain core can be found under `src/blockchain`.
- Chain data is saved to `src/storage/chain.json` so your history persists across restarts.
- Helper methods now let you verify the chain, query balances and inspect validator stakes.

### For Non‑Programmers and Investors

The web interface lets you create a wallet and send tokens without any coding
knowledge.  It demonstrates how a token ecosystem might operate and is intended
for educational and research use.  Feel free to experiment locally and see how
blocks are created in real time.

### Web Interface Features

- View your wallet balance and lookup any address
- Load the current validator list and their stakes
- Verify that the chain is valid and view the total block count
- Search for a block by its hash
- Browse blocks in a table via the new **Blocks** section
- Manage your wallet from the **Profile** page and submit metadata to the chain
- Export and import wallets using password‑encrypted keys
- Search for an address to view its balance and transactions
- Monitor real-time analytics from the **Analytics** page

## Professional Overview

BYDChain is designed to showcase core blockchain concepts in a clear and
research‑friendly way. The validator selection process now uses a Delegated
Proof‑of‑Stake system and the API provides endpoints for inspecting
every aspect of the chain. Tokens are awarded when a wallet is created so
new users can immediately experiment with transactions and staking.

The Next.js frontend now includes additional pages for wallet management,
browsing blocks and submitting metadata. Modern icons and webfonts give the
UI a polished feel while keeping the codebase lightweight.

## Troubleshooting

If `npm run dev` fails with a message like `Cannot find module '@babel/preset-env'`,
make sure dependencies are installed by running `npm install` first. The
project now uses the built-in `next/babel` preset so no extra Babel packages are
required once dependencies have been installed.

### Community

Developer: [Edinsoncs](https://edinsoncs.com) - Edinson Carranza Saldaña







