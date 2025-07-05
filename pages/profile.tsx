import { useEffect, useState } from 'react'
import { FaPlus, FaSignOutAlt, FaKey, FaStar, FaDownload } from 'react-icons/fa'
import { useWallet } from '../components/WalletContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
    <div className="bg-neutral-950">
      <div className="max-w-4xl mx-auto py-8 space-y-8 text-white font-medium">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-neutral-400">Wallets</h2>
              <Button onClick={createWallet} size="sm" className="gap-2">
                <FaPlus /> New Wallet
              </Button>
            </div>
            <ul className="space-y-1">
              {wallets.slice(page * perPage, (page + 1) * perPage).map((w) => (
                <li
                  key={w.publicKey}
                  className="flex items-center justify-between text-sm hover:bg-white/5 px-4 py-2 rounded-md"
                >
                  <button className="font-mono" onClick={() => selectWallet(w.publicKey)}>
                    {w.publicKey.slice(0, 10)}...
                  </button>
                  <div className="flex items-center gap-3">
                    <FaStar
                      className={cn(
                        'cursor-pointer hover:text-yellow-400',
                        w.favorite ? 'text-yellow-400' : 'text-neutral-400'
                      )}
                      onClick={() => toggleFavorite(w.publicKey)}
                    />
                    <FaDownload
                      className="cursor-pointer text-neutral-400 hover:text-blue-400"
                      onClick={() => handleExportJson(w.publicKey)}
                    />
                  </div>
                </li>
              ))}
            </ul>
            {wallets.length > perPage && (
              <div className="flex justify-between pt-2 text-sm">
                <button
                  className="px-3 py-1 rounded-full hover:bg-white/10 transition disabled:opacity-50"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Prev
                </button>
                <span className="mx-2 flex-1 text-center text-neutral-400">
                  Page {page + 1} / {Math.ceil(wallets.length / perPage)}
                </span>
                <button
                  className="px-3 py-1 rounded-full hover:bg-white/10 transition disabled:opacity-50"
                  disabled={(page + 1) * perPage >= wallets.length}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <div className="space-y-4 flex flex-col">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
              <div>
                <span className="text-neutral-400">Public Key:</span>
                <p className="font-mono break-all text-xs mt-1">{wallet.publicKey}</p>
              </div>
              <div>
                <span className="text-neutral-400">Balance:</span>
                <span className={cn('ml-2', wallet.balance > 0 ? 'text-green-400' : 'text-white')}>
                  {wallet.balance}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleExport} className="gap-2 bg-white text-black hover:bg-white/80">
                <FaKey /> Export Keys
              </Button>
              <Button onClick={logout} variant="ghost" className="gap-2 hover:text-red-400">
                <FaSignOutAlt /> Logout
              </Button>
            </div>
            {mnemonic && (
              <pre className="bg-black/40 p-3 rounded break-all font-mono text-xs">{mnemonic}</pre>
            )}
            {keys && (
              <pre className="bg-black/40 p-3 rounded break-all whitespace-pre-wrap font-mono text-xs">{`Public: ${keys.publicKey}\nPrivate: ${keys.privateKey}`}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
