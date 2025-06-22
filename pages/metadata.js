import { useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function Metadata() {
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [dataHash, setDataHash] = useState('');
  const [result, setResult] = useState(null);

  async function storeData() {
    const res = await fetch(`${API_BASE}/api/ai/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, description, dataHash })
    });
    const json = await res.json();
    setResult(json);
  }

  return (
    <div className="max-w-xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        Store Metadata
      </h1>
      <div className="flex flex-col gap-2">
        <input
          value={model}
          onChange={e => setModel(e.target.value)}
          placeholder="model name"
          className="border p-2 rounded bg-gray-900 text-gray-100"
        />
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="description"
          className="border p-2 rounded bg-gray-900 text-gray-100"
        />
        <input
          value={dataHash}
          onChange={e => setDataHash(e.target.value)}
          placeholder="data hash"
          className="border p-2 rounded bg-gray-900 text-gray-100"
        />
        <button
          onClick={storeData}
          className="px-4 py-2 bg-indigo-500 text-white rounded"
        >
          Save
        </button>
      </div>
      {result && (
        <pre className="mt-4 bg-gray-900 p-4 rounded overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
