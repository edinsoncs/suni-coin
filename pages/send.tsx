import { useState } from 'react'
import { useRouter } from 'next/router'
import { useWallet } from '../components/WalletContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const API_BASE = 'http://localhost:8000'

export default function Send() {
  const { wallet, refreshBalance } = useWallet()
  const router = useRouter()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [metadata, setMetadata] = useState('')

  async function handleSend() {
    if (!wallet || sending) return
    setSending(true)
    setMessage(null)
    try {
      let meta
      if (metadata) {
        try { meta = JSON.parse(metadata) } catch { meta = metadata }
      }
      const res = await fetch(`${API_BASE}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, amount: parseFloat(amount), sender: wallet.publicKey, metadata: meta })
      })
      const data = await res.json()
      await refreshBalance()
      if (res.ok && data && data.id) {
        setMessage('Transaction sent! Redirecting...')
        router.push(`/tx/${data.id}`)
      } else {
        const err = typeof data.error === 'object' ? data.error.message : data.error
        setMessage(err || 'Transaction failed')
      }
    } catch {
      setMessage('Transaction failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-6 space-y-4">
      <h1 className="text-2xl font-bold">Send Transaction</h1>
      {!wallet ? (
        <p>Please connect a wallet.</p>
      ) : (
        <>
          <Input
            placeholder="Recipient address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <Input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            placeholder="Metadata (JSON optional)"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
          />
          <Button onClick={handleSend} disabled={sending}>
            {sending ? 'Sending...' : 'Send'}
          </Button>
          {message && <p className="text-sm mt-2">{message}</p>}
        </>
      )}
    </div>
  )
}
