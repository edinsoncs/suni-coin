import { useEffect, useState } from 'react'
import { useWallet } from '../components/WalletContext'

export default function Profile() {
  const { wallet, exportMnemonic, refreshBalance } = useWallet()
  const [mnemonic, setMnemonic] = useState<string | null>(null)

  useEffect(() => {
    if (wallet) refreshBalance()
  }, [wallet, refreshBalance])

  async function handleExport() {
    const m = await exportMnemonic()
    setMnemonic(m)
  }

  if (!wallet) {
    return <div className="py-6">No wallet connected.</div>
  }

  return (
    <div className="max-w-xl mx-auto py-6 space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
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
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-indigo-500 text-white rounded"
        >
          Export Keys
        </button>
      </div>
      {mnemonic && (
        <pre className="bg-gray-900 p-3 rounded break-all">{mnemonic}</pre>
      )}
    </div>
  )
}
