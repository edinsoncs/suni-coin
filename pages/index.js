import { useState, useEffect } from 'react';
import { FaCubes } from 'react-icons/fa';
import { useRouter } from 'next/router';

const API_BASE = 'http://localhost:8000';

export default function Home() {
  const router = useRouter();
  const [wallet, setWallet] = useState(null);
  const [balanceAddress, setBalanceAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionResult, setTransactionResult] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState(null);
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [dataHash, setDataHash] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [chainStatus, setChainStatus] = useState(null);
  const [chainLength, setChainLength] = useState(0);
  const [validators, setValidators] = useState(null);
  const [hashInput, setHashInput] = useState('');
  const [blockInfo, setBlockInfo] = useState(null);
  const [searchAddress, setSearchAddress] = useState('');

  useEffect(() => {
    refreshBlocks();
    verifyChain();
    loadValidators();
  }, []);

  async function createWallet() {
    const res = await fetch(`${API_BASE}/api/wallet/new`, { method: 'POST' });
    const json = await res.json();
    setWallet(json.data);
    setBalanceAddress(json.data.publicKey);
    await getBalance(json.data.publicKey);
  }

  async function getBalance(addr) {
    const address = addr || balanceAddress;
    if (!address) return;
    const res = await fetch(`${API_BASE}/api/balance/${address}`);
    const json = await res.json();
    setBalance(json);
  }

  async function sendTransaction() {
    const amt = parseFloat(amount);
    const res = await fetch(`${API_BASE}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, amount: amt })
    });
    const json = await res.json();
    setTransactionResult(json);
    if (json.id) {
      const infoRes = await fetch(`${API_BASE}/api/transaction/${json.id}`);
      if (infoRes.ok) {
        const infoJson = await infoRes.json();
        setTransactionInfo(infoJson);
      }
    }
  }

  async function storeAIData() {
    await fetch(`${API_BASE}/api/ai/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, description, dataHash })
    });
    refreshBlocks();
  }

  async function mineTransactions() {
    await fetch(`${API_BASE}/api/mine/transactions`);
    refreshBlocks();
  }

  function searchAddressPage() {
    if (!searchAddress) return;
    router.push(`/address/${searchAddress}`);
  }

  async function refreshBlocks() {
    const res = await fetch(`${API_BASE}/api/blocks`);
    const json = await res.json();
    setBlocks(json);
  }

  async function verifyChain() {
    const res = await fetch(`${API_BASE}/api/verify`);
    const json = await res.json();
    setChainStatus(json);
    const blocksRes = await fetch(`${API_BASE}/api/blocks`);
    const blockJson = await blocksRes.json();
    setChainLength(blockJson.length);
  }

  async function loadValidators() {
    const res = await fetch(`${API_BASE}/api/validators`);
    const json = await res.json();
    setValidators(json);
  }

  async function getBlock() {
    if (!hashInput) return;
    const res = await fetch(`${API_BASE}/api/block/${hashInput}`);
    const json = await res.json();
    setBlockInfo(json);
  }

  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold flex justify-center items-center gap-2 mb-2">
          <FaCubes className="text-purple-400" /> BYDChain Dashboard
        </h1>
        <p className="text-gray-300">Explore a simple Proof-of-Stake blockchain.</p>
      </div>
      <p className="text-center mb-6">
        <a href="/blocks" className="text-blue-600 hover:underline">Browse Blocks</a>
      </p>
      <div className="mb-6 max-w-xl mx-auto flex items-end gap-2">
        <input value={searchAddress} onChange={e => setSearchAddress(e.target.value)} placeholder="search address" className="flex-1 border p-2 rounded" />
        <button onClick={searchAddressPage} className="px-4 py-2 bg-blue-500 text-white rounded">Search</button>
      </div>

      <section className="mb-8 max-w-xl mx-auto bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Wallet</h2>
        <button onClick={createWallet} className="px-4 py-2 bg-blue-500 text-white rounded">Create Wallet</button>
        <pre className="mt-4 bg-gray-700 p-4 rounded overflow-auto">{wallet && JSON.stringify(wallet, null, 2)}</pre>
        <div className="mt-4 flex items-end gap-2">
          <input value={balanceAddress} onChange={e => setBalanceAddress(e.target.value)} placeholder="address" className="flex-1 border p-2 rounded bg-gray-700 text-gray-100" />
          <button onClick={() => getBalance()} className="px-4 py-2 bg-blue-500 text-white rounded">Balance</button>
        </div>
        <pre className="mt-2 bg-gray-700 p-4 rounded overflow-auto">{balance && JSON.stringify(balance, null, 2)}</pre>
      </section>

      <section className="mb-8 max-w-xl mx-auto bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Create Transaction</h2>
        <div className="flex flex-col gap-2">
          <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="recipient address" className="border p-2 rounded bg-gray-700 text-gray-100" />
          <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="amount" className="border p-2 rounded bg-gray-700 text-gray-100" />
          <button onClick={sendTransaction} className="px-4 py-2 bg-green-500 text-white rounded">Send</button>
        </div>
        {transactionResult && (
          <div className="mt-4 bg-gray-700 p-4 rounded">
            <p className="mb-2">Transaction submitted.</p>
            <p>
              ID:{' '}
              <a
                href={`/tx/${transactionResult.id}`}
                className="text-blue-400 underline"
              >
                {transactionResult.id}
              </a>
            </p>
            {transactionInfo && (
              <pre className="mt-2 overflow-auto">
                {JSON.stringify(transactionInfo, null, 2)}
              </pre>
            )}
          </div>
        )}
      </section>

      <section className="mb-8 max-w-xl mx-auto bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Store AI Data</h2>
        <div className="flex flex-col gap-2">
          <input value={model} onChange={e => setModel(e.target.value)} placeholder="model name" className="border p-2 rounded bg-gray-700 text-gray-100" />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="description" className="border p-2 rounded bg-gray-700 text-gray-100" />
          <input value={dataHash} onChange={e => setDataHash(e.target.value)} placeholder="data hash" className="border p-2 rounded bg-gray-700 text-gray-100" />
          <button onClick={storeAIData} className="px-4 py-2 bg-indigo-500 text-white rounded">Save AI Data</button>
        </div>
      </section>

      <section className="mb-8 text-center">
        <button onClick={mineTransactions} className="px-4 py-2 bg-purple-500 text-white rounded">Mine Transactions</button>
      </section>

      <section className="max-w-xl mx-auto bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Blocks</h2>
        <button onClick={refreshBlocks} className="px-4 py-2 bg-blue-500 text-white rounded">Refresh Blocks</button>
        <pre className="mt-4 bg-gray-700 p-4 rounded overflow-auto">{JSON.stringify(blocks, null, 2)}</pre>
      </section>

      <section className="max-w-xl mx-auto bg-gray-800 p-6 mt-8 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Chain</h2>
        <div className="flex items-end gap-2 mb-2">
          <button onClick={verifyChain} className="px-4 py-2 bg-green-600 text-white rounded">Verify</button>
          <span className="ml-auto text-sm text-gray-400">{chainLength ? `${chainLength} blocks` : ''}</span>
        </div>
        <pre className="bg-gray-700 p-4 rounded overflow-auto">{chainStatus && JSON.stringify(chainStatus, null, 2)}</pre>
      </section>

      <section className="max-w-xl mx-auto bg-gray-800 p-6 mt-8 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Validators</h2>
        <button onClick={loadValidators} className="px-4 py-2 bg-blue-500 text-white rounded">Load Validators</button>
        <pre className="mt-4 bg-gray-700 p-4 rounded overflow-auto">{validators && JSON.stringify(validators, null, 2)}</pre>
      </section>

      <section className="max-w-xl mx-auto bg-gray-800 p-6 mt-8 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Block Lookup</h2>
        <div className="flex items-end gap-2">
          <input value={hashInput} onChange={e => setHashInput(e.target.value)} placeholder="block hash" className="flex-1 border p-2 rounded bg-gray-700 text-gray-100" />
          <button onClick={getBlock} className="px-4 py-2 bg-blue-500 text-white rounded">Find</button>
        </div>
        <pre className="mt-4 bg-gray-700 p-4 rounded overflow-auto">{blockInfo && JSON.stringify(blockInfo, null, 2)}</pre>
      </section>
    </div>
  );
}
