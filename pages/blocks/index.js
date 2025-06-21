import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = 'http://localhost:8000';

export default function BlocksPage() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/blocks`).then(res => res.json()).then(setBlocks);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Blocks</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-2 py-1">#</th>
              <th className="px-2 py-1">Hash</th>
              <th className="px-2 py-1">Validator</th>
              <th className="px-2 py-1">Time</th>
              <th className="px-2 py-1">Txs</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b, idx) => (
              <tr key={b.hash} className="border-b last:border-none">
                <td className="px-2 py-1">{blocks.length - idx - 1}</td>
                <td className="px-2 py-1 truncate">
                  <Link href={`/blocks/${b.hash}`} className="text-blue-600 hover:underline">
                    {b.hash.slice(0, 20)}...
                  </Link>
                </td>
                <td className="px-2 py-1 truncate">{b.validator}</td>
                <td className="px-2 py-1">{new Date(b.timestamp).toLocaleString()}</td>
                <td className="px-2 py-1">{Array.isArray(b.data) ? b.data.length : 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
