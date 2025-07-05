import { useEffect, useState } from 'react'
import AnalyticsCard from '@/components/analytics/AnalyticsCard'
import MiniChart from '@/components/analytics/MiniChart'

const API_BASE = 'http://localhost:8000'
const WS_BASE = 'ws://localhost:8000'

const ranges = ['Last 10 blocks', 'Last hour', 'All time']

function formatTime(ms: number) {
  const sec = ms / 1000
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

export default function Analytics() {
  const [stats, setStats] = useState<any>(null)
  const [blockTimes, setBlockTimes] = useState<number[]>([])
  const [mempoolSizes, setMempoolSizes] = useState<number[]>([])
  const [nodes, setNodes] = useState<number[]>([])
  const [heights, setHeights] = useState<number[]>([])
  const [range, setRange] = useState(ranges[0])

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/api/metrics/live`)
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data)
      setBlockTimes((b) => [...b.slice(-19), data.blockTime])
      setMempoolSizes((m) => [...m.slice(-19), data.mempoolSize])
      setNodes((n) => [...n.slice(-19), data.connectedNodes])
      setHeights((h) => [...h.slice(-29), data.blockHeight])
    }
    return () => ws.close()
  }, [])

  useEffect(() => {
    const load = () => {
      fetch(`${API_BASE}/api/metrics/extended`)
        .then((r) => r.json())
        .then(setStats)
        .catch(console.error)
    }
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-neutral-950 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Network Analytics</h1>
          <select
            className="bg-neutral-900 text-white rounded px-3 py-2"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            {ranges.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <AnalyticsCard
              title="Block Height"
              value={stats.chainLength.toLocaleString()}
              icon="⛓"
              data={heights}
              color="#e879f9"
            />
            <AnalyticsCard
              title="Total Stake"
              value={stats.totalStake.toLocaleString()}
              icon="💰"
            />
            <AnalyticsCard
              title="Total Transactions"
              value={stats.totalTransactions.toLocaleString()}
              icon="🔄"
            />
            <AnalyticsCard
              title="Mempool Size"
              value={stats.mempoolSize.toLocaleString()}
              icon="📥"
              data={mempoolSizes}
              color="#f97316"
            />
            <AnalyticsCard
              title="Average Block Time"
              value={formatTime(stats.avgBlockTime)}
              icon="⏱"
              data={blockTimes}
              color="#3b82f6"
            />
            <AnalyticsCard
              title="Unique Addresses"
              value={stats.uniqueAddresses.toLocaleString()}
              icon="🏷"
            />
            <AnalyticsCard
              title="Connected Nodes"
              value={stats.connectedNodes.toLocaleString()}
              icon="🌐"
              data={nodes}
              color="#22c55e"
            />
            {stats.syncStatus && (
              <AnalyticsCard
                title="Sync Status"
                value={stats.syncStatus}
                icon="🔄"
              />
            )}
          </div>
        )}
        <div className="bg-neutral-900 rounded-xl p-4">
          <h2 className="text-neutral-400 uppercase text-sm tracking-wide mb-2">
            Live Block Height
          </h2>
          <MiniChart data={heights} color="#e879f9" />
        </div>
      </div>
    </div>
  )
}
