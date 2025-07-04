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

  async function handleSend() {
    if (!wallet) return
    const res = await fetch(`${API_BASE}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, amount: parseFloat(amount) })
    })
    const json = await res.json()
    await refreshBalance()
    if (json && json.id) {
      router.push(`/tx/${json.id}`)
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
          <Button onClick={handleSend}>Send</Button>
        </>
      )}
    </div>
  )
}
