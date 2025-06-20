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
   npm start
   ```

2. Open `http://localhost:8000` in your browser to access the web interface.

Multiple nodes can be launched using the extra `start:*` scripts in
`package.json`.

## How It Works

SUNI keeps a chain of blocks linked with hashes. Transactions are collected in a
pool and can be mined via the "Mine Transactions" button on the web interface.
The Proof‑of‑Stake mechanism is simplified for educational purposes.

### AI Data Blocks

Use `POST /api/ai/store` to record metadata about models or datasets on chain.
Each block will contain fields `model`, `description` and `hash` so you can
track AI assets over time.

### For Developers

- Node.js 18 or later is recommended.
- REST API endpoints are defined in `src/middleware/Api/Endpoints`.
- Frontend files live in `src/public` and use Tailwind CSS via CDN.
- The blockchain core can be found under `src/blockchain`.

### For Non‑Programmers and Investors

The web interface lets you create a wallet and send tokens without any coding
knowledge.  It demonstrates how a token ecosystem might operate and is intended
for educational and research use.  Feel free to experiment locally and see how
blocks are created in real time.

### Community

Developer: [Edinsoncs](https://edinsoncs.com) - Edinson Carranza Saldaña







