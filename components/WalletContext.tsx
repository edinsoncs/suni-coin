import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Wallet = {
  publicKey: string
  balance: number
}

interface WalletContextType {
  wallet: Wallet | null
  wallets: Wallet[]
  createWallet: () => Promise<void>
  selectWallet: (address: string) => void
  logout: () => void
  exportMnemonic: () => Promise<string | null>
  exportKeys: () => Promise<{ privateKey: string; publicKey: string } | null>
  refreshBalance: () => Promise<number | null>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const API_BASE = 'http://localhost:8000'

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [wallets, setWallets] = useState<Wallet[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('wallet')
    const list = localStorage.getItem('wallets')
    if (stored) setWallet(JSON.parse(stored))
    if (list) setWallets(JSON.parse(list))
  }, [])

  useEffect(() => {
    if (wallet) localStorage.setItem('wallet', JSON.stringify(wallet))
    else localStorage.removeItem('wallet')
  }, [wallet])

  useEffect(() => {
    localStorage.setItem('wallets', JSON.stringify(wallets))
  }, [wallets])

  async function createWallet() {
    if (wallets.length >= 10) return
    const res = await fetch(`${API_BASE}/api/wallet/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const json = await res.json()
    if (json.data) {
      setWallet(json.data)
      setWallets((w) => [...w, json.data])
    }
  }

  function selectWallet(address: string) {
    const w = wallets.find((wl) => wl.publicKey === address) || null
    setWallet(w)
  }

  function logout() {
    setWallet(null)
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

  async function exportKeys() {
    if (!wallet) return null
    const res = await fetch(`${API_BASE}/api/wallet/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: wallet.publicKey })
    })
    const json = await res.json()
    if (json.status === 'ok') return { privateKey: json.privateKey, publicKey: json.publicKey }
    return null
  }

  async function refreshBalance() {
    if (!wallet) return null
    const res = await fetch(`${API_BASE}/api/balance/${wallet.publicKey}`)
    const json = await res.json()
    setWallet({ ...wallet, balance: json.balance })
    return json.balance
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        wallets,
        createWallet,
        selectWallet,
        logout,
        exportMnemonic,
        exportKeys,
        refreshBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('WalletContext not found')
  return ctx
}
