import { useEffect, useState } from 'react'
import { FaPlus, FaSignOutAlt, FaKey, FaStar, FaDownload } from 'react-icons/fa'
import { useWallet } from '../components/WalletContext'
import { Button } from '@/components/ui/button'

export default function Profile() {
  const { wallet, wallets, createWallet, selectWallet, toggleFavorite, exportJson, logout, exportMnemonic, exportKeys, refreshBalance } = useWallet()
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const [keys, setKeys] = useState<{ privateKey: string; publicKey: string } | null>(null)
  const [page, setPage] = useState(0)
  const perPage = 5

  useEffect(() => {
    if (wallet) refreshBalance()
  }, [wallet, refreshBalance])

  async function handleExport() {
    const m = await exportMnemonic()
    setMnemonic(m)
    const k = await exportKeys()
    setKeys(k)
  }

  function handleExportJson(address: string) {
    const data = exportJson(address)
    if (!data) return
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${address}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!wallet) {
    return (
      <div className="py-6 space-y-4">
        <p>No wallet connected.</p>
        <Button onClick={createWallet} className="gap-2">
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
          <Button onClick={createWallet} size="sm" className="gap-2">
            <FaPlus /> New
          </Button>
        </div>
        <ul className="space-y-1">
          {wallets.slice(page * perPage, (page + 1) * perPage).map((w) => (
            <li key={w.publicKey} className="flex items-center justify-between text-sm gap-2">
              <button
                className="font-mono hover:underline"
                onClick={() => selectWallet(w.publicKey)}
              >
                {w.publicKey.slice(0, 10)}...
              </button>
              <div className="flex items-center gap-2">
                <FaStar
                  className={w.favorite ? 'text-yellow-400 cursor-pointer' : 'text-gray-500 cursor-pointer'}
                  onClick={() => toggleFavorite(w.publicKey)}
                />
                <FaDownload className="cursor-pointer" onClick={() => handleExportJson(w.publicKey)} />
                {wallet && wallet.publicKey === w.publicKey && (
                  <span className="text-xs text-green-500">active</span>
                )}
              </div>
            </li>
          ))}
        </ul>
        {wallets.length > perPage && (
          <div className="flex justify-between mt-2 text-sm">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              Prev
            </Button>
            <span className="mx-2 flex-1 text-center">Page {page + 1} / {Math.ceil(wallets.length / perPage)}</span>
            <Button variant="outline" size="sm" disabled={(page + 1) * perPage >= wallets.length} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
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
