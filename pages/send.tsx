import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useWallet, Wallet } from '../components/WalletContext'
import Modal from '../components/Modal'
import { Mail, Coins, Send as SendIcon, Wallet as WalletIcon } from 'lucide-react'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { cn } from '@/lib/utils'

const GAS_OPTIONS = [
  { label: 'Slow', value: 15 },
  { label: 'Standard', value: 25 },
  { label: 'Fast', value: 35 }
]

function randomHash() {
  const chars = 'abcdef0123456789'
  let out = '0x'
  for (let i = 0; i < 64; i++) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

export default function Send() {
  const router = useRouter()
  const { wallets, wallet, copyToClipboard, refreshBalance } = useWallet()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [gas, setGas] = useState(GAS_OPTIONS[1].value)
  const [toast, setToast] = useState<string | null>(null)
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  useEffect(() => {
    const fav = wallets.find(w => w.favorite)
    if (fav) setFrom(fav.publicKey)
    else if (wallet) setFrom(wallet.publicKey)
  }, [wallets, wallet])

  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(null), 2500)
      return () => clearTimeout(id)
    }
  }, [toast])

  const validAddress = /^0x[a-fA-F0-9]{40}$/.test(to)
  const amt = parseFloat(amount)
  const validAmount = !isNaN(amt) && amt > 0
  const valid = validAddress && validAmount && from && !loading

  function handleMax() {
    const selected = wallets.find(w => w.publicKey === from)
    if (selected) setAmount(selected.balance.toString())
  }

  function handleSend() {
    if (!valid) return
    setModal(true)
  }

  async function confirmSend() {
    setModal(false)
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: to, amount: parseFloat(amount), sender: from })
      })
      const data = await res.json()
      if (res.ok) {
        setTxHash(data.id || null)
        setToast('Transaction sent!')
        await refreshBalance()
        if (data.id) {
          router.push(`/tx/${data.id}`)
        }
      } else {
        const err = typeof data.error === 'object' ? data.error.message : data.error
        setToast(err || 'Transaction failed')
      }
    } catch {
      setToast('Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  const estimatedFee = gas * 21000 / 1e9

  return (
    <div className="bg-neutral-950 min-h-screen py-10 text-white">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Send Transaction</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Recipient Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" data-tooltip-id="to-tip" />
              <Input
                placeholder="0xabc123..."
                className="pl-9 font-mono"
                value={to}
                onChange={e => setTo(e.target.value)}
              />
              <Tooltip id="to-tip" content="Recipient wallet" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <div className="relative">
              <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" data-tooltip-id="amt-tip" />
              <Input
                type="number"
                step="0.000001"
                placeholder="0.00"
                className="pl-9"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
              <button
                type="button"
                onClick={handleMax}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-400 hover:underline"
              >
                Max
              </button>
              <Tooltip id="amt-tip" content="Transaction amount" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm">Network Fee</div>
            <div className="flex gap-2">
              {GAS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGas(opt.value)}
                  className={cn(
                    'px-4 py-1 rounded-full text-sm transition-all',
                    gas === opt.value
                      ? 'bg-green-600 text-white'
                      : 'bg-neutral-800 text-white hover:bg-neutral-700'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="text-sm text-neutral-400">Estimated total fee: {estimatedFee.toFixed(6)} BYD</div>
          </div>
          <div>
            <label className="block text-sm mb-1">From Wallet</label>
            <div className="relative">
              <WalletIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <select
                className="pl-9 pr-3 py-2 w-full rounded-lg bg-black border border-white/20 text-white focus:ring-2 transition-all duration-200"
                value={from}
                onChange={e => setFrom(e.target.value)}
              >
                {wallets.map(w => (
                  <option key={w.publicKey} value={w.publicKey}>
                    {w.publicKey.slice(0, 6)}...{w.publicKey.slice(-4)} ({w.balance})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button
            onClick={handleSend}
            className="w-full gap-2 bg-green-600 text-white px-6 py-2 rounded-lg transition-transform duration-200 hover:scale-105 hover:opacity-80"
            disabled={!valid}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin" />
            ) : (
              <SendIcon className="w-4 h-4" />
            )}
            Send
          </Button>
          {txHash && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between text-sm font-mono break-all">
              <span>{txHash}</span>
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(txHash!)}>
                Copy
              </Button>
            </div>
          )}
        </div>
      </div>
      {toast && <div className="fixed bottom-4 right-4 bg-white/10 text-white px-4 py-2 rounded-xl">{toast}</div>}
      <Modal open={modal} onClose={() => setModal(false)}>
        <h2 className="text-xl mb-4">Are you sure?</h2>
        <p className="text-sm mb-6">
          Send {amount} BYD to {to.slice(0, 6)}...{to.slice(-4)} with fee {gas} gwei?
        </p>
        <div className="flex gap-4">
          <Button onClick={confirmSend} className="flex-1 bg-green-600 hover:bg-green-500">
            Confirm
          </Button>
          <Button variant="ghost" className="flex-1" onClick={() => setModal(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}
