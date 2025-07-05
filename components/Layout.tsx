import { ReactNode, useEffect, useState } from 'react'
import { Blocks, Sun, Moon, Network } from 'lucide-react'
import { FaSignOutAlt } from 'react-icons/fa'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { useTheme } from './ThemeContext'
import ConnectWalletModal from './ConnectWalletModal'
import SearchBar from './SearchBar'
import { useWallet } from './WalletContext'
import Link from 'next/link'

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme()
  const { wallet, logout } = useWallet()
  const [modal, setModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    async function fetchHeight() {
      try {
        const res = await fetch('http://localhost:8000/api/metrics')
        const json = await res.json()
        setHeight(json.chainLength)
      } catch (e) {
        console.error(e)
      }
    }
    fetchHeight()
    const id = setInterval(fetchHeight, 10000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('#wallet-dropdown')) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('click', handleClick)
    }
    return () => document.removeEventListener('click', handleClick)
  }, [menuOpen])
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card shadow-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Blocks className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold">BYDChain</h1>
                <Badge className="text-xs" variant="outline">Mainnet</Badge>
              </div>
              <Badge
                variant="secondary"
                className="border-transparent hover:bg-secondary/80 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Healthy
              </Badge>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <SearchBar />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch checked={theme === 'dark'} onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')} />
                <Moon className="h-4 w-4" />
              </div>
              <div className="text-sm text-muted-foreground">
                Block Height:{' '}
                <span className="font-mono font-semibold">
                  {height !== null ? height.toLocaleString() : '...'}
                </span>
              </div>
              {wallet ? (
                <div className="relative" id="wallet-dropdown">
                  <Badge
                    variant="outline"
                    className="font-mono cursor-pointer"
                    onClick={() => setMenuOpen((o) => !o)}
                  >
                    {wallet.publicKey.slice(0, 6)}...{wallet.publicKey.slice(-4)}
                  </Badge>
                  {menuOpen && (
                    <>
                      <div className="fixed inset-0 bg-black/50 z-40" />
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded shadow z-50">
                        <Link
                          href="/send"
                          className="block px-4 py-2 text-sm hover:bg-accent"
                        >
                          Send Transaction
                        </Link>
                        <Link
                          href="/wallet"
                          className="block px-4 py-2 text-sm hover:bg-accent"
                        >
                          Wallet
                        </Link>
                        <Link
                          href="/analytics"
                          className="block px-4 py-2 text-sm hover:bg-accent"
                        >
                          Analytics
                        </Link>
                        <button
                          onClick={() => {
                            logout()
                            setMenuOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                        >
                          <FaSignOutAlt className="inline" /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setModal(true)}
                >
                  <Network className="w-4 h-4" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
      <ConnectWalletModal open={modal} onClose={() => setModal(false)} />
    </div>
  )
}
