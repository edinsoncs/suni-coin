import { useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function Profile() {
  const [password, setPassword] = useState('');
  const [wallet, setWallet] = useState(null);

  async function createWallet() {
    const res = await fetch(`${API_BASE}/api/wallet/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const json = await res.json();
    setWallet(json.data);
  }

  return (
    <div className="max-w-xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        Create Wallet
      </h1>
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="password"
          className="border p-2 rounded"
        />
        <button
          onClick={createWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create
        </button>
      </div>
      {wallet && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(wallet, null, 2)}
        </pre>
      )}
    </div>
  );
}
