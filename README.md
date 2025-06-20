# SUNI

SUNI is an experimental Proof‑of‑Stake blockchain written in Node.js. It includes
a lightweight wallet, mining utilities and a simple web interface styled with
Tailwind CSS.  The project is focused on exploring how blockchain technology can
be used alongside Artificial Intelligence. The chain can store AI dataset or
model information so researchers can track and share their assets.


## Why AI?

AI projects often need a trusted ledger to exchange data or rewards. SUNI aims
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

Chain data is automatically saved to disk so blocks remain after you restart the server.

Multiple nodes can be launched using the extra `start:*` scripts in
`package.json`.

## How It Works

SUNI keeps a chain of blocks linked with hashes. Transactions are collected in a
pool and can be mined via the "Mine Transactions" button on the web interface.
Blocks are minted using a basic Proof‑of‑Stake algorithm that randomly selects a
validator proportionally to their stake.

### AI Data Blocks

Use `POST /api/ai/store` to record metadata about models or datasets on chain.
Each block will contain fields `model`, `description` and `hash` so you can
track AI assets over time. List all recorded AI blocks via
`GET /api/ai/list`.

### API Endpoints

The REST API exposes several helpers for querying the chain:

- `GET /api/validators` – list validator stakes
- `GET /api/verify` – check whether the chain is valid
- `GET /api/block/:hash` – fetch a block by its hash
- `GET /api/balance/:address` – show the balance of a wallet address
- `GET /api/ai/list` – list all blocks that contain AI data

### Blockchain Utilities

Several helper methods are exposed through the `Blockchain` class:

- `verifyChain()` returns `true` if every block links correctly and the
  stored hashes match.
- `findBlockByHash(hash)` looks up a specific block based on its hash.
- `getBalance(address)` aggregates all transactions to compute the balance
  for a wallet.
- `getStakeOf(key)` returns how many tokens a validator has staked.
- `getValidators()` gives the full validator table.

Validators are persisted to `src/storage/validators.json` and a random
validator is now selected based on stake when new blocks are mined.

You can inspect pending transactions via `GET /api/mempool`.

The chain is loaded from `src/storage/chain.json` on start and saved back to
this file whenever new blocks are added, ensuring persistence between restarts.


### For Developers

- Node.js 18 or later is recommended.
- REST API endpoints are defined in `src/middleware/Api/Endpoints`.
- Frontend files live in `src/public` and use Tailwind CSS via CDN.
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

## Troubleshooting

If `npm run dev` fails with a message like `Cannot find module '@babel/preset-env'`,
make sure dependencies are installed by running `npm install` first. The
project now uses the built-in `next/babel` preset so no extra Babel packages are
required once dependencies have been installed.

### Community

Developer: [Edinsoncs](https://edinsoncs.com) - Edinson Carranza Saldaña







