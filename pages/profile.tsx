import { useEffect, useState } from 'react'
import { FaPlus, FaSignOutAlt, FaKey } from 'react-icons/fa'
import { useWallet } from '../components/WalletContext'
import { Button } from '@/components/ui/button'

export default function Profile() {
  const { wallet, wallets, createWallet, selectWallet, logout, exportMnemonic, exportKeys, refreshBalance } = useWallet()
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const [keys, setKeys] = useState<{ privateKey: string; publicKey: string } | null>(null)

  useEffect(() => {
    if (wallet) refreshBalance()
  }, [wallet, refreshBalance])

  async function handleExport() {
    const m = await exportMnemonic()
    setMnemonic(m)
    const k = await exportKeys()
    setKeys(k)
  }

  if (!wallet) {
    return (
      <div className="py-6 space-y-4">
        <p>No wallet connected.</p>
        <Button onClick={createWallet} disabled={wallets.length >= 10} className="gap-2">
          <FaPlus /> Create Wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-6 space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Wallets</h2>
          <Button onClick={createWallet} disabled={wallets.length >= 10} size="sm" className="gap-2">
            <FaPlus /> New
          </Button>
        </div>
        <ul className="space-y-1">
          {wallets.map((w) => (
            <li key={w.publicKey} className="flex items-center justify-between text-sm">
              <button className="font-mono hover:underline" onClick={() => selectWallet(w.publicKey)}>
                {w.publicKey.slice(0, 10)}...
              </button>
              {wallet && wallet.publicKey === w.publicKey && (
                <span className="text-xs text-green-500">active</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-black border border-gray-700 p-4 rounded space-y-2">
        <div>
          <span className="font-semibold">Public Key:</span>
          <span className="ml-2 break-all">{wallet.publicKey}</span>
        </div>
        <div>
          <span className="font-semibold">Balance:</span>
          <span className="ml-2">{wallet.balance}</span>
        </div>
      </div>
      <div className="space-x-2">
        <Button onClick={handleExport} className="gap-2">
          <FaKey className="inline" /> Export Keys
        </Button>
        <Button onClick={logout} variant="outline" className="gap-2">
          <FaSignOutAlt /> Logout
        </Button>
      </div>
      {mnemonic && (
        <pre className="bg-gray-900 p-3 rounded break-all">{mnemonic}</pre>
      )}
      {keys && (
        <pre className="bg-gray-900 p-3 rounded break-all whitespace-pre-wrap">
{`Public: ${keys.publicKey}\nPrivate: ${keys.privateKey}`}
        </pre>
      )}
    </div>
  )
}
