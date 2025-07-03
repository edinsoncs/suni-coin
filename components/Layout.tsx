import { ReactNode, useEffect, useState } from 'react'
import { Blocks, Sun, Moon, Network } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { useTheme } from './ThemeContext'
import ConnectWalletModal from './ConnectWalletModal'
import SearchBar from './SearchBar'
import { useWallet } from './WalletContext'

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme()
  const { wallet } = useWallet()
  const [modal, setModal] = useState(false)
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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card shadow-sm">
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
                <Badge variant="outline" className="font-mono">
                  {wallet.publicKey.slice(0, 6)}...{wallet.publicKey.slice(-4)}
                </Badge>
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
