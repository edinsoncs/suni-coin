import { useEffect, useState } from 'react'
import {
  FaStar,
  FaDownload,
  FaTrashAlt,
  FaPlus,
  FaCopy,
  FaSignOutAlt
} from 'react-icons/fa'
import { useWallet, Wallet } from '../WalletContext'
import { Button } from '../ui/button'
import Modal from '../Modal'
import { cn } from '@/lib/utils'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

interface WalletActionsProps {
  wallet: Wallet
  onFavorite: () => void
  onExport: () => void
  onDelete: () => void
}

function WalletActions({ wallet, onFavorite, onExport, onDelete }: WalletActionsProps) {
  return (
    <div className="flex items-center gap-3 text-neutral-400">
      <button
        tabIndex={0}
        aria-label="favorite"
        data-tooltip-id={`fav-${wallet.publicKey}`}
        data-tooltip-content="Favorite"
        onClick={onFavorite}
        className={cn(
          'hover:text-yellow-400 transition-all duration-300',
          wallet.favorite && 'text-yellow-400'
        )}
      >
        <FaStar />
      </button>
      <Tooltip id={`fav-${wallet.publicKey}`} />

      <button
        tabIndex={0}
        aria-label="export key"
        data-tooltip-id={`exp-${wallet.publicKey}`}
        data-tooltip-content="Export"
        onClick={onExport}
        className="hover:text-blue-400 transition-all duration-300"
      >
        <FaDownload />
      </button>
      <Tooltip id={`exp-${wallet.publicKey}`} />

      <button
        tabIndex={0}
        aria-label="delete"
        data-tooltip-id={`del-${wallet.publicKey}`}
        data-tooltip-content="Delete"
        onClick={onDelete}
        className="hover:text-red-400 transition-all duration-300"
      >
        <FaTrashAlt />
      </button>
      <Tooltip id={`del-${wallet.publicKey}`} />
    </div>
  )
}

interface WalletListProps {
  wallets: Wallet[]
  selected: string | null
  onSelect: (addr: string) => void
  onFavorite: (addr: string) => void
  onExport: (addr: string) => void
  onDelete: (addr: string) => void
  onNew: () => void
  onExportAll: () => void
}

function WalletList({
  wallets,
  selected,
  onSelect,
  onFavorite,
  onExport,
  onDelete,
  onNew,
  onExportAll
}: WalletListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-neutral-400">Wallets</h2>
        <div className="flex gap-2">
          <Button size="sm" className="gap-1" onClick={onNew}>
            <FaPlus /> New Wallet
          </Button>
          {wallets.length > 0 && (
            <Button size="sm" variant="outline" className="gap-1" onClick={onExportAll}>
              <FaDownload /> Export Keys
            </Button>
          )}
        </div>
      </div>
      <ul className="space-y-1">
        {wallets.map((w) => (
          <li
            key={w.publicKey}
            className={cn(
              'flex items-center justify-between px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-300',
              selected === w.publicKey && 'bg-white/5'
            )}
          >
            <button
              onClick={() => onSelect(w.publicKey)}
              className="font-mono text-sm"
            >
              {w.publicKey.slice(0, 4)}...{w.publicKey.slice(-4)}
            </button>
            <WalletActions
              wallet={w}
              onFavorite={() => onFavorite(w.publicKey)}
              onExport={() => onExport(w.publicKey)}
              onDelete={() => onDelete(w.publicKey)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

interface WalletDetailProps {
  wallet: Wallet | null
  onCopy: () => void
}

function WalletDetail({ wallet, onCopy }: WalletDetailProps) {
  if (!wallet) {
    return (
      <div className="p-4 rounded-xl bg-white/5 text-center text-neutral-400">
        Select a wallet
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-white/5 space-y-2">
        <div>
          <span className="text-neutral-400">Public Key:</span>
          <p className="font-mono break-words text-sm mt-1">{wallet.publicKey}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Balance:</span>
          <span className="text-green-500 text-lg font-semibold">{wallet.balance}</span>
          <button
            tabIndex={0}
            aria-label="copy address"
            data-tooltip-id="copy-tip"
            data-tooltip-content="Copiar"
            onClick={onCopy}
            className="ml-auto text-neutral-400 hover:text-white transition-all duration-300"
          >
            <FaCopy />
          </button>
          <Tooltip id="copy-tip" />
        </div>
        <div className="text-neutral-400 text-xs">
          Created: {wallet.createdAt ? new Date(wallet.createdAt).toLocaleDateString() : '-'}
          <span className="ml-4">Type: {wallet.type || '-'}</span>
        </div>
      </div>
    </div>
  )
}

export default function WalletSection() {
  const {
    wallets,
    wallet,
    createWallet,
    selectWallet,
    toggleFavorite,
    exportJson,
    deleteWallet,
    copyToClipboard,
    logout,
    refreshBalance,
    importWallet
  } = useWallet()

  const [toast, setToast] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [importValue, setImportValue] = useState('')
  const [toDelete, setToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (wallet) refreshBalance()
  }, [wallet, refreshBalance])

  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(null), 2000)
      return () => clearTimeout(id)
    }
  }, [toast])

  function handleExport(address: string) {
    const data = exportJson(address)
    if (!data) return
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${address}.json`
    a.click()
    URL.revokeObjectURL(url)
    setToast('Clave exportada')
  }

  function handleExportAll() {
    const data = JSON.stringify(wallets)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wallets.json'
    a.click()
    URL.revokeObjectURL(url)
    setToast('Exportación exitosa')
  }

  function handleCopy() {
    if (wallet) {
      copyToClipboard(wallet.publicKey)
      setToast('Copiado')
    }
  }

  function confirmDelete() {
    if (toDelete) {
      deleteWallet(toDelete)
      setToast('Wallet eliminada')
      setToDelete(null)
    }
  }

  async function handleImport() {
    if (importValue) {
      await importWallet(importValue)
      setToast('Wallet importada')
      setImportValue('')
      setShowNew(false)
    }
  }

  function handleCreate() {
    createWallet()
    setShowNew(false)
  }

  return (
    <section className="bg-neutral-950 text-white">
      <div className="max-w-5xl mx-auto py-10 px-6 grid gap-6 md:grid-cols-2">
        <WalletList
          wallets={wallets}
          selected={wallet ? wallet.publicKey : null}
          onSelect={selectWallet}
          onFavorite={toggleFavorite}
          onExport={handleExport}
          onDelete={(addr) => setToDelete(addr)}
          onNew={() => setShowNew(true)}
          onExportAll={handleExportAll}
        />
        <div className="space-y-4 flex flex-col">
          <WalletDetail wallet={wallet} onCopy={handleCopy} />
          <div className="flex items-center gap-2">
            <Button onClick={logout} variant="ghost" className="gap-2 hover:text-red-400">
              <FaSignOutAlt /> Logout
            </Button>
          </div>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-4 right-4 bg-white/10 text-white px-4 py-2 rounded-xl">
          {toast}
        </div>
      )}
      <Modal open={showNew} onClose={() => setShowNew(false)}>
        <h2 className="text-xl mb-4">New Wallet</h2>
        <div className="space-y-3">
          <Button className="w-full gap-2" onClick={handleCreate}>
            <FaPlus /> Create New
          </Button>
          <div className="space-y-2">
            <input
              value={importValue}
              onChange={(e) => setImportValue(e.target.value)}
              placeholder="Mnemonic"
              className="w-full p-2 rounded bg-black/20 text-white"
            />
            <Button variant="outline" className="w-full" onClick={handleImport}>
              Import
            </Button>
          </div>
        </div>
      </Modal>
      <Modal open={!!toDelete} onClose={() => setToDelete(null)}>
        <h2 className="text-xl mb-4">Are you sure?</h2>
        <div className="flex gap-4">
          <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-500">
            Delete
          </Button>
          <Button variant="ghost" onClick={() => setToDelete(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </section>
  )
}

export { WalletList, WalletDetail, WalletActions }

