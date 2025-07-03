"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

interface Stats {
  chainLength: number
  totalTransactions: number
  avgBlockTime: number
  totalStake: number
  mempoolSize: number
  uniqueAddresses: number
}

interface BlockData {
  hash: string
  validator: string
  timestamp: number
  data: any
}

interface ValidatorEntry { address: string; stake: number }

export default function BYDChainDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [validators, setValidators] = useState<ValidatorEntry[]>([])
  const [mempool, setMempool] = useState<any[]>([])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const s = await fetch(`${API_BASE}/api/metrics/extended`).then(r => r.json())
        if (active) setStats(s)

        const blks = await fetch(`${API_BASE}/api/blocks`).then(r => r.json())
        if (active && Array.isArray(blks)) setBlocks(blks.slice(-5).reverse())

        const v = await fetch(`${API_BASE}/api/validators`).then(r => r.json())
        if (active && v && typeof v === 'object') {
          setValidators(Object.entries(v).map(([address, stake]) => ({ address, stake: Number(stake) })))
        }

        const mp = await fetch(`${API_BASE}/api/mempool`).then(r => r.json())
        if (active) setMempool(mp)
      } catch (e) {
        console.error(e)
      }
    }

    load()
    const id = setInterval(load, 5000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  if(!stats) return <p>Loading...</p>

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">BYDChain Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Blocks</CardTitle></CardHeader>
          <CardContent>{stats.chainLength}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Transactions</CardTitle></CardHeader>
          <CardContent>{stats.totalTransactions}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Mempool Size</CardTitle></CardHeader>
          <CardContent>{stats.mempoolSize}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Average Block Time</CardTitle></CardHeader>
          <CardContent>{stats.avgBlockTime.toFixed(2)} ms</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Stake</CardTitle></CardHeader>
          <CardContent>{stats.totalStake}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Unique Addresses</CardTitle></CardHeader>
          <CardContent>{stats.uniqueAddresses}</CardContent>
        </Card>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Latest Blocks</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hash</TableHead>
              <TableHead>Validator</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Transactions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blocks.map(b => (
              <TableRow key={b.hash}>
                <TableCell className="font-mono text-sm">{b.hash.slice(0,12)}...</TableCell>
                <TableCell className="font-mono text-sm">{b.validator}</TableCell>
                <TableCell>{new Date(b.timestamp).toLocaleString()}</TableCell>
                <TableCell>{Array.isArray(b.data) ? b.data.length : 1}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Validators</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Stake</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validators.map(v => (
              <TableRow key={v.address}>
                <TableCell className="font-mono text-sm">{v.address}</TableCell>
                <TableCell>{v.stake}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Pending Transactions</h2>
        {mempool.length === 0 ? (
          <p>No pending transactions</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mempool.map((tx, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono text-sm">{tx.input.address}</TableCell>
                  <TableCell className="font-mono text-sm">{tx.outputs[0].address}</TableCell>
                  <TableCell>{tx.outputs[0].amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  )
}
