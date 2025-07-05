import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Wallet = {
  publicKey: string
  balance: number
  favorite?: boolean
}

interface WalletContextType {
  wallet: Wallet | null
  wallets: Wallet[]
  createWallet: () => Promise<void>
  selectWallet: (address: string) => void
  toggleFavorite: (address: string) => void
  exportJson: (address: string) => string | null
  deleteWallet: (address: string) => void
  copyToClipboard: (text: string) => void
  getBalance: (address: string) => Promise<number | null>
  exportAll: () => string
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
    if (list) {
      const parsed: Wallet[] = JSON.parse(list)
      setWallets(parsed.map(w => ({ favorite: false, ...w })))
    }
  }, [])

  useEffect(() => {
    if (wallet) localStorage.setItem('wallet', JSON.stringify(wallet))
    else localStorage.removeItem('wallet')
  }, [wallet])

  useEffect(() => {
    localStorage.setItem('wallets', JSON.stringify(wallets))
  }, [wallets])

  async function createWallet() {
    const res = await fetch(`${API_BASE}/api/wallet/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const json = await res.json()
    if (json.data) {
      setWallet(json.data)
      setWallets((w) => [...w, { ...json.data, favorite: false }])
    }
  }

  function selectWallet(address: string) {
    const w = wallets.find((wl) => wl.publicKey === address) || null
    setWallet(w)
  }

  function toggleFavorite(address: string) {
    setWallets((wls) =>
      wls.map((w) =>
        w.publicKey === address ? { ...w, favorite: !w.favorite } : w
      )
    )
  }

  function exportJson(address: string) {
    const w = wallets.find((wl) => wl.publicKey === address)
    return w ? JSON.stringify(w) : null
  }

  function deleteWallet(address: string) {
    setWallets((wls) => wls.filter((w) => w.publicKey !== address))
    if (wallet?.publicKey === address) setWallet(null)
  }

  function copyToClipboard(text: string) {
    if (navigator?.clipboard) navigator.clipboard.writeText(text)
  }

  async function getBalance(address: string) {
    const res = await fetch(`${API_BASE}/api/balance/${address}`)
    const json = await res.json()
    return json.balance
  }

  function exportAll() {
    return JSON.stringify(wallets)
  }

  function logout() {
    setWallet(null)
    setWallets([])
    localStorage.removeItem('wallet')
    localStorage.removeItem('wallets')
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
    try {
      const res = await fetch(`${API_BASE}/api/balance/${wallet.publicKey}`)
      const json = await res.json()
      setWallet({ ...wallet, balance: json.balance })
      return json.balance
    } catch {
      return null
    }
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        wallets,
        createWallet,
        selectWallet,
        toggleFavorite,
        exportJson,
        deleteWallet,
        copyToClipboard,
        getBalance,
        exportAll,
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
