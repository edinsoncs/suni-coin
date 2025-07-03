import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_BASE}/api/metrics/extended`);
      const json = await res.json();
      setStats(json);
    }
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">Network Analytics</h1>
      <pre className="bg-gray-900 p-4 rounded overflow-auto">
        {stats && JSON.stringify(stats, null, 2)}
      </pre>
    </div>
  );
}
