import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function Admin() {
  const [metrics, setMetrics] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/metrics`).then(res => res.json()).then(setMetrics);
    fetch(`${API_BASE}/api/nodes`).then(res => res.json()).then(setNodes);
    fetch(`${API_BASE}/api/blocks`).then(res => res.json()).then(setBlocks);
  }, []);

  return (
    <div className="py-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      <section className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Metrics</h2>
        <pre className="bg-gray-700 p-3 rounded overflow-auto">{metrics && JSON.stringify(metrics, null, 2)}</pre>
      </section>

      <section className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Nodes</h2>
        <pre className="bg-gray-700 p-3 rounded overflow-auto">{JSON.stringify(nodes, null, 2)}</pre>
      </section>

      <section className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Blocks</h2>
        <pre className="bg-gray-700 p-3 rounded overflow-auto">{JSON.stringify(blocks, null, 2)}</pre>
      </section>
    </div>
  );
}
