import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Wallet = {
  publicKey: string
  balance: number
}

interface WalletContextType {
  wallet: Wallet | null
  createWallet: () => Promise<void>
  exportMnemonic: () => Promise<string | null>
  refreshBalance: () => Promise<number | null>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const API_BASE = 'http://localhost:8000'

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('wallet')
    if (stored) setWallet(JSON.parse(stored))
  }, [])

  useEffect(() => {
    if (wallet) localStorage.setItem('wallet', JSON.stringify(wallet))
    else localStorage.removeItem('wallet')
  }, [wallet])

  async function createWallet() {
    const res = await fetch(`${API_BASE}/api/wallet/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const json = await res.json()
    if (json.data) setWallet(json.data)
  }

  async function exportMnemonic() {
    if (!wallet) return null
    const res = await fetch(`${API_BASE}/api/wallet/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: wallet.publicKey })
    })
    const json = await res.json()
    return json.mnemonic || null
  }

  async function refreshBalance() {
    if (!wallet) return null
    const res = await fetch(`${API_BASE}/api/balance/${wallet.publicKey}`)
    const json = await res.json()
    setWallet({ ...wallet, balance: json.balance })
    return json.balance
  }

  return (
    <WalletContext.Provider value={{ wallet, createWallet, exportMnemonic, refreshBalance }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('WalletContext not found')
  return ctx
}
