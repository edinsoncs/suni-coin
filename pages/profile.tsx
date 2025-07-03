import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

export default function Profile() {
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [wallets, setWallets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [transactions, setTransactions] = useState([]);

  async function loadWallets() {
    const res = await fetch(`${API_BASE}/api/wallet/list`);
    const json = await res.json();
    setWallets(json);
  }

  useEffect(() => { loadWallets(); }, []);

  async function createWallet() {
    await fetch(`${API_BASE}/api/wallet/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    setPassword('');
    loadWallets();
  }

  async function importWallet() {
    await fetch(`${API_BASE}/api/wallet/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mnemonic })
    });
    setMnemonic('');
    loadWallets();
  }

  async function exportWallet(address) {
    const res = await fetch(`${API_BASE}/api/wallet/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });
    const json = await res.json();
    if (json.mnemonic) alert(json.mnemonic);
  }

  async function selectWallet(address) {
    setSelected(address);
    const res = await fetch(`${API_BASE}/api/address/${address}/transactions`);
    const json = await res.json();
    setTransactions(json);
  }

  return (
    <div className="max-w-xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        Wallets
      </h1>
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="password"
          className="border p-2 rounded bg-gray-900 text-gray-100"
        />
        <button
          onClick={createWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <input
          value={mnemonic}
          onChange={e => setMnemonic(e.target.value)}
          placeholder="mnemonic"
          className="border p-2 rounded bg-gray-900 text-gray-100"
        />
        <button
          onClick={importWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Import
        </button>
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">My Wallets</h2>
        {wallets.map(w => (
          <div key={w.publicKey} className="bg-black border border-gray-700 p-3 rounded mb-2 flex items-center gap-2">
            <button
              onClick={() => selectWallet(w.publicKey)}
              className="px-2 py-1 bg-green-500 text-white rounded"
            >
              Select
            </button>
            <button
              onClick={() => exportWallet(w.publicKey)}
              className="px-2 py-1 bg-indigo-500 text-white rounded"
            >
              Export
            </button>
            <span className="ml-2 break-all">{w.publicKey}</span>
          </div>
        ))}
      </section>

      {selected && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Transactions</h2>
          <pre className="bg-gray-900 p-4 rounded overflow-auto">
            {JSON.stringify(transactions, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
