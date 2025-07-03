"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/ThemeContext"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"
import { Activity, Blocks, Network, Zap, ArrowLeft, Copy, ExternalLink, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Search, Sun, Moon, TrendingUp, Fuel, Shield, Wallet, PieChart, Database, Code, FileText } from "lucide-react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/router"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

const TOTAL_SUPPLY = 21_000_000

// Enhanced hardcoded demo data
const defaultNetworkStats = {
  blockHeight: 1247892,
  totalTransactions: 5847293,
  activeNodes: 47,
  hashRate: "2.34 TH/s",
  difficulty: "15.78T",
  avgBlockTime: "12.3s",
  networkStatus: "Healthy",
  totalSupply: "21,000,000 BYD",
  circulatingSupply: "18,750,000 BYD",
  networkHashRate: "2,340,000,000,000",
  totalValidators: 156,
  stakingRatio: "68.4%",
  inflationRate: "3.2%",
}

const detailedBlockData = {
  height: 1247892,
  hash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
  parentHash: "0x6e8ebce0b1c46a6af55ab3dbc68ebce0b1c46a6af55ab3dbc6b1b1da6a00a82274",
  merkleRoot: "0x9a1bfce1c2d57b7bg66bc4ebd9a1bfce1c2d57b7bg66bc4ebd8c2c2eb7b11a91385",
  stateRoot: "0xa2c0gdf2d3e68c8ch77cd5fcfa2c0gdf2d3e68c8ch77cd5fcf9d3d3fc8c22ba2496",
  timestamp: "2024-01-15T14:32:18.000Z",
  timestampUnix: 1705329138,
  transactions: 156,
  transactionHashes: [
    "0xa1b2c3d4e5f6789012345678901234567890123456789012345678901234567890",
    "0xb2c3d4e5f6789012345678901234567890123456789012345678901234567890a1",
    "0xc3d4e5f6789012345678901234567890123456789012345678901234567890a1b2",
  ],
  miner: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  size: 1245678,
  gasUsed: "12,456,789",
  gasLimit: "15,000,000",
  baseFeePerGas: "25.4 gwei",
  reward: "6.25 BYD",
  difficulty: "15,780,000,000,000",
  nonce: "0x1a2b3c4d5e6f7890",
  extraData: "0x476574682f76312e302e302f6c696e75782f676f312e342e32",
  logsBloom:
    "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  confirmations: 1247,
  blockReward: "6.25 BYD",
  uncleReward: "0 BYD",
  totalFees: "0.3456 BYD",
}

const detailedTransactionData = {
  hash: "0xa1b2c3d4e5f6789012345678901234567890123456789012345678901234567890",
  blockHash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
  blockNumber: 1247892,
  transactionIndex: 45,
  from: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  to: "0x853e46Dd7745D0643a36c4e0643a36c4e0643a36",
  value: "15.75 BYD",
  valueWei: "15750000000000000000",
  gasPrice: "25400000000",
  gasLimit: "21000",
  gasUsed: "21000",
  fee: "0.0021 BYD",
  status: "Success",
  timestamp: "2024-01-15T14:32:15.000Z",
  confirmations: 1247,
  nonce: 156,
  input: "0x",
  logs: [],
  contractAddress: null,
  cumulativeGasUsed: "1,234,567",
  effectiveGasPrice: "25.4 gwei",
  type: "Legacy",
  maxFeePerGas: null,
  maxPriorityFeePerGas: null,
  accessList: [],
}

const recentBlocks = [
  {
    height: 1247892,
    hash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
    timestamp: "2024-01-15 14:32:18",
    transactions: 156,
    miner: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    size: "1.2 MB",
    gasUsed: "12,456,789",
    reward: "6.25 BYD",
    utilization: 83.0,
  },
  {
    height: 1247891,
    hash: "0x8a0bfde2d1e68b8bg77bc5fbe8a0bfde2d1e68b8bg77bc5fbe8d3d3fc8c22ba2496",
    timestamp: "2024-01-15 14:32:06",
    transactions: 203,
    miner: "0x853e46Dd7745D0643a36c4e0643a36c4e0643a36",
    size: "1.8 MB",
    gasUsed: "18,234,567",
    reward: "6.25 BYD",
    utilization: 91.2,
  },
  {
    height: 1247890,
    hash: "0x9b1cgef3e2f79c9ch88cd6gcf9b1cgef3e2f79c9ch88cd6gcf9e4e4gd9d33cb3507",
    timestamp: "2024-01-15 14:31:54",
    transactions: 89,
    miner: "0x964f57Ee8856E0754b47d5f0754b47d5f0754b47",
    size: "0.9 MB",
    gasUsed: "8,765,432",
    reward: "6.25 BYD",
    utilization: 58.4,
  },
]

const recentTransactions = [
  {
    hash: "0xa1b2c3d4e5f6789012345678901234567890123456789012345678901234567890",
    from: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    to: "0x853e46Dd7745D0643a36c4e0643a36c4e0643a36",
    value: "15.75 BYD",
    fee: "0.0021 BYD",
    status: "Success",
    timestamp: "2024-01-15 14:32:15",
    method: "Transfer",
    gasUsed: "21,000",
  },
  {
    hash: "0xb2c3d4e5f6789012345678901234567890123456789012345678901234567890a1",
    from: "0x964f57Ee8856E0754b47d5f0754b47d5f0754b47",
    to: "0xa75g68Ff9967F0865c58e6g0865c58e6g0865c58",
    value: "3.42 BYD",
    fee: "0.0018 BYD",
    status: "Success",
    timestamp: "2024-01-15 14:32:12",
    method: "Transfer",
    gasUsed: "21,000",
  },
  {
    hash: "0xc3d4e5f6789012345678901234567890123456789012345678901234567890a1b2",
    from: "0xb86h79Gg0a78G0976d69f7h0976d69f7h0976d69",
    to: "0xc97i80Hh1b89H1a87e70g8i1a87e70g8i1a87e70",
    value: "0.89 BYD",
    fee: "0.0015 BYD",
    status: "Pending",
    timestamp: "2024-01-15 14:32:08",
    method: "Transfer",
    gasUsed: "21,000",
  },
]

const defaultValidators = [
  {
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    stake: "50,000 BYD",
    uptime: "99.8%",
    blocks: 1247,
    status: "Active",
    commission: "5%",
    delegators: 234,
  },
  {
    address: "0x853e46Dd7745D0643a36c4e0643a36c4e0643a36",
    stake: "45,000 BYD",
    uptime: "99.5%",
    blocks: 1156,
    status: "Active",
    commission: "7%",
    delegators: 189,
  },
  {
    address: "0x964f57Ee8856E0754b47d5f0754b47d5f0754b47",
    stake: "38,000 BYD",
    uptime: "98.9%",
    blocks: 987,
    status: "Active",
    commission: "6%",
    delegators: 156,
  },
]

const marketData = {
  price: "$45.67",
  change24h: "+5.23%",
  marketCap: "$856.7M",
  volume24h: "$23.4M",
  high24h: "$47.12",
  low24h: "$43.89",
  totalValueLocked: "$234.5M",
  stakingAPR: "8.4%",
}

const gasTracker = {
  slow: "15 gwei",
  standard: "25 gwei",
  fast: "35 gwei",
  avgGasPrice: "25.4 gwei",
  gasUsedPercent: 67.8,
  baseFee: "22.1 gwei",
  priorityFee: "3.3 gwei",
}

const topAddresses = [
  {
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    balance: "125,847.23 BYD",
    type: "Exchange",
    txCount: 45678,
  },
  { address: "0x853e46Dd7745D0643a36c4e0643a36c4e0643a36", balance: "98,234.56 BYD", type: "Whale", txCount: 12345 },
  { address: "0x964f57Ee8856E0754b47d5f0754b47d5f0754b47", balance: "76,543.21 BYD", type: "Contract", txCount: 98765 },
  { address: "0xa75g68Ff9967F0865c58e6g0865c58e6g0865c58", balance: "54,321.98 BYD", type: "Whale", txCount: 6789 },
]

const miningPools = [
  { name: "BYDPool", hashrate: "45.2%", blocks: 567, miners: 1234 },
  { name: "MegaMine", hashrate: "23.8%", blocks: 298, miners: 678 },
  { name: "ChainDigger", hashrate: "18.5%", blocks: 231, miners: 456 },
  { name: "Others", hashrate: "12.5%", blocks: 156, miners: 234 },
]

const mempoolData = {
  pendingTxs: 2847,
  totalSize: "45.7 MB",
  avgFee: "0.0023 BYD",
  congestionLevel: "Low",
  queuedTxs: 1234,
  replacementTxs: 56,
}

export default function BYDChainDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { theme, setTheme } = useTheme()
  const [networkStats, setNetworkStats] = useState(defaultNetworkStats)
  const [validators, setValidators] = useState(defaultValidators)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const router = useRouter()
  const [currentView, setCurrentView] = useState<"dashboard" | "block" | "transaction" | "address">("dashboard")
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const metrics = await fetch(`${API_BASE}/api/metrics/extended`).then(r => r.json())

        if (isMounted) {
          setNetworkStats((s) => ({
            ...s,
            blockHeight: metrics.chainLength ?? s.blockHeight,
            totalTransactions: metrics.totalTransactions ?? s.totalTransactions,
            totalValidators: Object.keys(metrics.validators || {}).length,
            stakingRatio: metrics.totalStake ? `${((metrics.totalStake / TOTAL_SUPPLY) * 100).toFixed(1)}%` : s.stakingRatio,
          }))
        }

        const vals = await fetch(`${API_BASE}/api/validators`).then(r => r.json())
        if (isMounted && Array.isArray(vals)) setValidators(vals)
      } catch (e) {
        console.error(e)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    const id = setInterval(load, 5000)
    return () => {
      isMounted = false
      clearInterval(id)
    }
  }, [])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 1) {
      try {
        const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const json = await res.json()
          setSearchResults(json)
        } else {
          setSearchResults([])
        }
      } catch (e) {
        console.error(e)
        setSearchResults([])
      }
    } else {
      setSearchResults([])
    }
  }

  const handleSearchResultClick = (result: any) => {
    setSearchResults([])
    setSearchQuery("")

    if (result.type === "block") {
      router.push(`/blocks/${result.hash}`)
    } else if (result.type === "transaction") {
      router.push(`/tx/${result.id}`)
    } else if (result.type === "address") {
      router.push(`/address/${result.address}`)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  if (currentView === "block" && selectedItem) {
    return (
      <div className="min-h-screen">
        <div className="min-h-screen bg-background text-foreground">
          {/* Header */}
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" onClick={() => setCurrentView("dashboard")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Blocks className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Block #{selectedItem.height}</h1>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <Switch checked={theme === 'dark'} onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')} />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-6">
            {/* Block Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Block Height</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">#{selectedItem.height}</div>
                  <p className="text-xs text-muted-foreground">{selectedItem.confirmations} confirmations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Timestamp</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{formatTimeAgo(selectedItem.timestamp)}</div>
                  <p className="text-xs text-muted-foreground">{formatTimestamp(selectedItem.timestamp)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedItem.transactions}</div>
                  <p className="text-xs text-muted-foreground">in this block</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Block Reward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedItem.blockReward}</div>
                  <p className="text-xs text-muted-foreground">+ {selectedItem.totalFees} fees</p>
                </CardContent>
              </Card>
            </div>

            {/* Block Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Block Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-muted-foreground">Block Hash</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono break-all">{selectedItem.hash}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedItem.hash)} data-tooltip-id="copy-tip" data-tooltip-content="Copy hash">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-muted-foreground">Parent Hash</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono break-all">{selectedItem.parentHash}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedItem.parentHash)} data-tooltip-id="copy-tip" data-tooltip-content="Copy hash">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Merkle Root</span>
                      <span className="text-sm font-mono">{selectedItem.merkleRoot.slice(0, 20)}...</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">State Root</span>
                      <span className="text-sm font-mono">{selectedItem.stateRoot.slice(0, 20)}...</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Miner</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono">
                          {selectedItem.miner.slice(0, 10)}...{selectedItem.miner.slice(-8)}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedItem.miner)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Difficulty</span>
                      <span className="text-sm font-mono">{selectedItem.difficulty}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Nonce</span>
                      <span className="text-sm font-mono">{selectedItem.nonce}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Size</span>
                      <span className="text-sm">{(selectedItem.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                </CardContent>
                <Tooltip id="copy-tip" />
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fuel className="w-5 h-5" />
                    Gas & Fees
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Gas Used</span>
                      <span className="text-sm font-mono">{selectedItem.gasUsed}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Gas Limit</span>
                      <span className="text-sm font-mono">{selectedItem.gasLimit}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Gas Utilization</span>
                        <span className="text-sm">83.0%</span>
                      </div>
                      <Progress value={83.0} className="h-2" />
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Base Fee</span>
                      <span className="text-sm font-mono">{selectedItem.baseFeePerGas}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Total Fees</span>
                      <span className="text-sm font-bold text-green-600">{selectedItem.totalFees}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Block Reward</span>
                      <span className="text-sm font-bold text-blue-600">{selectedItem.blockReward}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Uncle Reward</span>
                      <span className="text-sm font-mono">{selectedItem.uncleReward}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions in Block */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Transactions ({selectedItem.transactions})
                </CardTitle>
                <CardDescription>All transactions included in this block</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hash</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((tx) => (
                      <TableRow
                        key={tx.hash}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => {
                          setSelectedItem(detailedTransactionData)
                          setCurrentView("transaction")
                        }}
                      >
                        <TableCell className="font-mono text-sm">
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                        </TableCell>
                        <TableCell className="font-medium">{tx.value}</TableCell>
                        <TableCell>{tx.fee}</TableCell>
                        <TableCell>
                          <Badge variant={tx.status === "Success" ? "default" : "secondary"}>
                            {tx.status === "Success" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {tx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "transaction" && selectedItem) {
    return (
      <div className="min-h-screen">
        <div className="min-h-screen bg-background text-foreground">
          {/* Header */}
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" onClick={() => setCurrentView("dashboard")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Transaction Details</h1>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <Switch checked={theme === 'dark'} onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')} />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-6">
            {/* Transaction Status */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedItem.status === "Success"
                          ? "bg-green-100 dark:bg-green-900"
                          : "bg-yellow-100 dark:bg-yellow-900"
                      }`}
                    >
                      {selectedItem.status === "Success" ? (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Transaction {selectedItem.status}</h2>
                      <p className="text-muted-foreground">{selectedItem.confirmations} block confirmations</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{selectedItem.value}</div>
                    <p className="text-sm text-muted-foreground">Value Transferred</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Block Number</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">#{selectedItem.blockNumber}</div>
                  <p className="text-xs text-muted-foreground">Position: {selectedItem.transactionIndex}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Timestamp</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{formatTimeAgo(selectedItem.timestamp)}</div>
                  <p className="text-xs text-muted-foreground">{formatTimestamp(selectedItem.timestamp)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Gas Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{selectedItem.gasUsed.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">of {selectedItem.gasLimit.toLocaleString()} limit</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Transaction Fee</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{selectedItem.fee}</div>
                  <p className="text-xs text-muted-foreground">{selectedItem.effectiveGasPrice}</p>
                </CardContent>
              </Card>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Transaction Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-muted-foreground">Transaction Hash</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono break-all">{selectedItem.hash}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedItem.hash)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-muted-foreground">Block Hash</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono break-all">{selectedItem.blockHash.slice(0, 20)}...</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedItem.blockHash)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-muted-foreground">From</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono">{selectedItem.from}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedItem.from)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-muted-foreground">To</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono">{selectedItem.to}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedItem.to)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Value</span>
                      <span className="text-sm font-bold">{selectedItem.value}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Value (Wei)</span>
                      <span className="text-sm font-mono">{selectedItem.valueWei}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Transaction Type</span>
                      <Badge variant="outline">{selectedItem.type}</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Nonce</span>
                      <span className="text-sm font-mono">{selectedItem.nonce}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fuel className="w-5 h-5" />
                    Gas & Fees Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Gas Limit</span>
                      <span className="text-sm font-mono">{selectedItem.gasLimit.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Gas Used</span>
                      <span className="text-sm font-mono">{selectedItem.gasUsed.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Gas Utilization</span>
                        <span className="text-sm">100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Gas Price</span>
                      <span className="text-sm font-mono">{(Number(selectedItem.gasPrice) / 1000000000).toFixed(1)} gwei</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Effective Gas Price</span>
                      <span className="text-sm font-mono">{selectedItem.effectiveGasPrice}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Transaction Fee</span>
                      <span className="text-sm font-bold text-red-600">{selectedItem.fee}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Cumulative Gas Used</span>
                      <span className="text-sm font-mono">{selectedItem.cumulativeGasUsed}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Input Data */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Input Data
                </CardTitle>
                <CardDescription>Raw transaction input data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm font-mono break-all">
                    {selectedItem.input === "0x" ? "No input data (simple transfer)" : selectedItem.input}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-background text-foreground">


        <div className="container mx-auto px-4 py-6">
          <div className="mb-4 relative">
            <Input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search blocks, transactions or addresses"
              className="bg-black text-white placeholder-gray-400"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full bg-black text-white border border-gray-700 mt-1 rounded">
                {searchResults.map((r, i) => (
                  <div
                    key={i}
                    className="p-2 cursor-pointer hover:bg-gray-700"
                    onClick={() => handleSearchResultClick(r)}
                  >
                    <div className="flex justify-between">
                      <span className="truncate mr-2">
                        {r.hash || r.id || r.address}
                      </span>
                      <span className="text-xs text-gray-400 uppercase">{r.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="blocks">Blocks</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="validators">Validators</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Enhanced Network Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">BYD Price</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? <Skeleton width={60} /> : marketData.price}
                    </div>
                    <p className="text-xs text-green-500 font-medium">
                      {loading ? <Skeleton width={40} /> : marketData.change24h}
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Block Height</CardTitle>
                    <Blocks className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? <Skeleton width={80} /> : networkStats.blockHeight.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">+12 from last hour</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gas Price</CardTitle>
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? <Skeleton width={60} /> : gasTracker.avgGasPrice}
                    </div>
                    <p className="text-xs text-muted-foreground">Base: {gasTracker.baseFee}</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? <Skeleton width={80} /> : networkStats.totalTransactions.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">+2.1% from yesterday</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Validators</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? <Skeleton width={40} /> : networkStats.totalValidators}
                    </div>
                    <p className="text-xs text-muted-foreground">Staking: {networkStats.stakingRatio}</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hash Rate</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? <Skeleton width={80} /> : networkStats.hashRate}
                    </div>
                    <p className="text-xs text-muted-foreground">+5.2% from last hour</p>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Widgets Row */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Enhanced Market Data Widget */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Market Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Market Cap</span>
                      <span className="font-medium">{loading ? <Skeleton width={80} /> : marketData.marketCap}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">24h Volume</span>
                      <span className="font-medium">{loading ? <Skeleton width={80} /> : marketData.volume24h}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">TVL</span>
                      <span className="font-medium text-blue-600">{loading ? <Skeleton width={80} /> : marketData.totalValueLocked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Staking APR</span>
                      <span className="font-medium text-green-600">{loading ? <Skeleton width={60} /> : marketData.stakingAPR}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Gas Tracker Widget */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Fuel className="w-4 h-4" />
                      Gas Tracker
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Slow</span>
                      <Badge variant="secondary">{loading ? <Skeleton width={40} /> : gasTracker.slow}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Standard</span>
                      <Badge variant="default">{loading ? <Skeleton width={40} /> : gasTracker.standard}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Fast</span>
                      <Badge variant="destructive">{loading ? <Skeleton width={40} /> : gasTracker.fast}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Network Usage</span>
                        <span>{loading ? <Skeleton width={30} /> : `${gasTracker.gasUsedPercent}%`}</span>
                      </div>
                      <Progress value={loading ? 0 : gasTracker.gasUsedPercent} />
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Mempool Status Widget */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Mempool Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Pending Txs</span>
                      <span className="font-medium">{loading ? <Skeleton width={50} /> : mempoolData.pendingTxs.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Queued Txs</span>
                      <span className="font-medium">{loading ? <Skeleton width={50} /> : mempoolData.queuedTxs.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Size</span>
                      <span className="font-medium">{loading ? <Skeleton width={60} /> : mempoolData.totalSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Congestion</span>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        {loading ? <Skeleton width={40} /> : mempoolData.congestionLevel}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Top Addresses Widget */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Top Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {loading ? (
                      <Skeleton count={4} height={20} className="my-1" />
                    ) : (
                      topAddresses.slice(0, 4).map((addr, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {addr.type}
                            </Badge>
                            <span className="text-sm font-mono">
                              {addr.address.slice(0, 6)}...{addr.address.slice(-4)}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium">{addr.balance.split(" ")[0]}K</div>
                            <div className="text-xs text-muted-foreground">{addr.txCount} txs</div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Network Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Network Information</CardTitle>
                    <CardDescription>Current blockchain network status and metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Difficulty</span>
                      <span className="text-sm font-mono">{loading ? <Skeleton width={80} /> : networkStats.difficulty}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Avg Block Time</span>
                      <span className="text-sm font-mono">{loading ? <Skeleton width={60} /> : networkStats.avgBlockTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Total Supply</span>
                      <span className="text-sm font-mono">{loading ? <Skeleton width={80} /> : networkStats.totalSupply}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Circulating Supply</span>
                      <span className="text-sm font-mono">{loading ? <Skeleton width={80} /> : networkStats.circulatingSupply}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Inflation Rate</span>
                      <span className="text-sm font-mono">{loading ? <Skeleton width={40} /> : networkStats.inflationRate}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Supply Progress</span>
                        <span className="text-sm">89.3%</span>
                      </div>
                      <Progress value={89.3} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Mining Pools Distribution */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-4 h-4" />
                      Mining Pools
                    </CardTitle>
                    <CardDescription>Hash rate distribution across mining pools</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {miningPools.map((pool, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{pool.name}</span>
                          <span className="text-sm">{pool.hashrate}</span>
                        </div>
                        <Progress value={Number.parseFloat(pool.hashrate)} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{pool.blocks} blocks</span>
                          <span>{pool.miners} miners</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest blocks and transaction summary</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {recentBlocks.slice(0, 3).map((block) => (
                        <div
                          key={block.height}
                          className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => {
                            setSelectedItem(detailedBlockData)
                            setCurrentView("block")
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <Blocks className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="font-medium">Block #{block.height}</div>
                              <div className="text-sm text-muted-foreground">{block.transactions} transactions</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{block.reward}</div>
                            <div className="text-xs text-muted-foreground">{block.utilization}% full</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="blocks" className="space-y-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Recent Blocks</CardTitle>
                  <CardDescription>Latest blocks mined on the BYDChain network</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Height</TableHead>
                        <TableHead>Hash</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Transactions</TableHead>
                        <TableHead>Miner</TableHead>
                        <TableHead>Gas Used</TableHead>
                        <TableHead>Reward</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentBlocks.map((block) => (
                        <TableRow
                          key={block.height}
                          className="cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => {
                            setSelectedItem(detailedBlockData)
                            setCurrentView("block")
                          }}
                        >
                          <TableCell className="font-medium">#{block.height}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {block.hash.slice(0, 10)}...{block.hash.slice(-8)}
                          </TableCell>
                          <TableCell>{formatTimeAgo(block.timestamp)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{block.transactions}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {block.miner.slice(0, 6)}...{block.miner.slice(-4)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">{block.gasUsed}</span>
                              <div className="w-16">
                                <Progress value={block.utilization} className="h-1" />
                              </div>
                              <span className="text-xs text-muted-foreground">{block.utilization}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-green-600">{block.reward}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest transactions on the BYDChain network</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hash</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Age</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransactions.map((tx) => (
                        <TableRow
                          key={tx.hash}
                          className="cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => {
                            setSelectedItem(detailedTransactionData)
                            setCurrentView("transaction")
                          }}
                        >
                          <TableCell className="font-mono text-sm">
                            {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{tx.method}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                          </TableCell>
                          <TableCell className="font-medium">{tx.value}</TableCell>
                          <TableCell className="text-red-600">{tx.fee}</TableCell>
                          <TableCell>
                            <Badge variant={tx.status === "Success" ? "default" : "secondary"}>
                              {tx.status === "Success" ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {tx.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatTimeAgo(tx.timestamp)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="validators" className="space-y-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Active Validators</CardTitle>
                  <CardDescription>Current validators securing the BYDChain network</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Validator Address</TableHead>
                        <TableHead>Stake</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Uptime</TableHead>
                        <TableHead>Blocks Validated</TableHead>
                        <TableHead>Delegators</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validators.map((validator) => (
                        <TableRow key={validator.address}>
                          <TableCell className="font-mono text-sm">
                            {validator.address.slice(0, 10)}...{validator.address.slice(-8)}
                          </TableCell>
                          <TableCell className="font-medium">{validator.stake}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{validator.commission}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={Number.parseFloat(validator.uptime)} className="w-16 h-2" />
                              <span className="text-sm">{validator.uptime}</span>
                            </div>
                          </TableCell>
                          <TableCell>{validator.blocks.toLocaleString()}</TableCell>
                          <TableCell>{validator.delegators}</TableCell>
                          <TableCell>
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {validator.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
