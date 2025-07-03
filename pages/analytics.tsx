import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000';
const WS_BASE = 'ws://localhost:8000';

function LineChart({ data, color }) {
  if (data.length === 0) return <svg className="w-full h-32" />;
  const max = Math.max(...data, 1);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (v / max) * 100;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg viewBox="0 0 100 100" className="w-full h-32">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  );
}

export default function Analytics() {
  const [blockTimes, setBlockTimes] = useState([]);
  const [mempoolSizes, setMempoolSizes] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/api/metrics/live`);
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      setBlockTimes((b) => [...b.slice(-19), data.blockTime]);
      setMempoolSizes((m) => [...m.slice(-19), data.mempoolSize]);
      setNodes((n) => [...n.slice(-19), data.connectedNodes]);
    };
    return () => ws.close();
  }, []);

  useEffect(() => {
    const load = () => {
      fetch(`${API_BASE}/api/metrics/extended`)
        .then((r) => r.json())
        .then(setStats)
        .catch(console.error);
    };
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="py-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Network Analytics</h1>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h2 className="font-semibold">Block Height</h2>
            <p>{stats.chainLength}</p>
          </div>
          <div>
            <h2 className="font-semibold">Total Transactions</h2>
            <p>{stats.totalTransactions}</p>
          </div>
          <div>
            <h2 className="font-semibold">Average Block Time</h2>
            <p>{stats.avgBlockTime.toFixed(2)} ms</p>
          </div>
          <div>
            <h2 className="font-semibold">Total Stake</h2>
            <p>{stats.totalStake}</p>
          </div>
          <div>
            <h2 className="font-semibold">Mempool Size</h2>
            <p>{stats.mempoolSize}</p>
          </div>
          <div>
            <h2 className="font-semibold">Unique Addresses</h2>
            <p>{stats.uniqueAddresses}</p>
          </div>
        </div>
      )}
      <div>
        <h2 className="font-semibold">Block Time</h2>
        <LineChart data={blockTimes} color="skyblue" />
      </div>
      <div>
        <h2 className="font-semibold">Mempool Size</h2>
        <LineChart data={mempoolSizes} color="orange" />
      </div>
      <div>
        <h2 className="font-semibold">Connected Nodes</h2>
        <LineChart data={nodes} color="limegreen" />
      </div>
    </div>
  );
}
