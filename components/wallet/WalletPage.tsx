import { useEffect, useState } from 'react'
import { FaStar, FaDownload, FaTrashAlt, FaPlus, FaCopy, FaSignOutAlt } from 'react-icons/fa'
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
        data-tooltip-id={`fav-${wallet.publicKey}`}
        data-tooltip-content="Favorite"
        onClick={onFavorite}
        className={cn('hover:text-yellow-400 transition-colors', wallet.favorite && 'text-yellow-400')}
      >
        <FaStar />
      </button>
      <Tooltip id={`fav-${wallet.publicKey}`} />

      <button
        data-tooltip-id={`exp-${wallet.publicKey}`}
        data-tooltip-content="Export"
        onClick={onExport}
        className="hover:text-blue-400 transition-colors"
      >
        <FaDownload />
      </button>
      <Tooltip id={`exp-${wallet.publicKey}`} />

      <button
        data-tooltip-id={`del-${wallet.publicKey}`}
        data-tooltip-content="Delete"
        onClick={onDelete}
        className="hover:text-red-400 transition-colors"
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
  page: number
  perPage: number
  onSelect: (addr: string) => void
  onFavorite: (addr: string) => void
  onExport: (addr: string) => void
  onDelete: (addr: string) => void
  onNew: () => void
  onExportAll: () => void
  onPageChange: (p: number) => void
}

function WalletList({ wallets, selected, page, perPage, onSelect, onFavorite, onExport, onDelete, onNew, onExportAll, onPageChange }: WalletListProps) {
  const pageCount = Math.ceil(wallets.length / perPage)
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
              <FaDownload /> Export All
            </Button>
          )}
        </div>
      </div>
      <ul className="space-y-1">
        {wallets.slice(page * perPage, (page + 1) * perPage).map(w => (
          <li
            key={w.publicKey}
            className={cn('flex items-center justify-between px-4 py-2 rounded-xl hover:bg-white/5 transition-all', selected === w.publicKey && 'bg-white/5')}
          >
            <button onClick={() => onSelect(w.publicKey)} className="font-mono text-sm">
              {w.publicKey.slice(0, 4)}...{w.publicKey.slice(-4)}
            </button>
            <WalletActions wallet={w} onFavorite={() => onFavorite(w.publicKey)} onExport={() => onExport(w.publicKey)} onDelete={() => onDelete(w.publicKey)} />
          </li>
        ))}
      </ul>
      {pageCount > 1 && (
        <div className="flex justify-between text-sm pt-2">
          <button
            className="px-3 py-1 rounded-full hover:bg-white/10 transition disabled:opacity-50"
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
          >
            Prev
          </button>
          <span className="flex-1 text-center text-neutral-400">
            Page {page + 1} / {pageCount}
          </span>
          <button
            className="px-3 py-1 rounded-full hover:bg-white/10 transition disabled:opacity-50"
            disabled={page + 1 >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

interface WalletDetailProps {
  wallet: Wallet | null
  onCopy: () => void
}

function WalletDetail({ wallet, onCopy }: WalletDetailProps) {
  if (!wallet) {
    return <div className="p-4 rounded-xl bg-white/5 text-center text-neutral-400">Select a wallet</div>
  }
  return (
    <div className="space-y-4">
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-white/5 space-y-2">
        <div>
          <span className="text-neutral-400">Public Key:</span>
          <p className="font-mono break-all text-xs mt-1">{wallet.publicKey}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Balance:</span>
          <span className="text-green-500">{wallet.balance}</span>
          <button
            data-tooltip-id="copy-tip"
            data-tooltip-content="Copiar"
            onClick={onCopy}
            className="ml-auto text-neutral-400 hover:text-white transition-colors"
          >
            <FaCopy />
          </button>
          <Tooltip id="copy-tip" />
        </div>
      </div>
      {wallet.history && (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-white/5 space-y-2 text-sm">
          <h3 className="text-neutral-400">Últimas transacciones</h3>
          <ul className="list-disc list-inside space-y-1">
            {wallet.history.map((h: any, idx: number) => (
              <li key={idx} className="font-mono break-all">{h}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function WalletPage() {
  const { wallets, wallet, createWallet, selectWallet, toggleFavorite, exportJson, logout, refreshBalance, deleteWallet, copyToClipboard } = useWallet()
  const [page, setPage] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [toDelete, setToDelete] = useState<string | null>(null)
  const perPage = 5

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
    a.download = `wallets.json`
    a.click()
    URL.revokeObjectURL(url)
    setToast('Exportadas todas las wallets')
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

  return (
    <div className="bg-neutral-950 min-h-screen py-8 text-white">
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
        <WalletList
          wallets={wallets}
          selected={wallet ? wallet.publicKey : null}
          page={page}
          perPage={perPage}
          onSelect={selectWallet}
          onFavorite={toggleFavorite}
          onExport={handleExport}
          onDelete={(addr) => setToDelete(addr)}
          onNew={createWallet}
          onExportAll={handleExportAll}
          onPageChange={(p) => setPage(Math.max(0, p))}
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
      {toast && <div className="fixed bottom-4 right-4 bg-white/10 text-white px-4 py-2 rounded-xl">{toast}</div>}
      <Modal open={!!toDelete} onClose={() => setToDelete(null)}>
        <h2 className="text-xl mb-4">¿Eliminar wallet?</h2>
        <div className="flex gap-4">
          <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-500">Eliminar</Button>
          <Button variant="ghost" onClick={() => setToDelete(null)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export { WalletList, WalletDetail, WalletActions }
