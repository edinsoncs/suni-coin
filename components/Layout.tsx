import { ReactNode, useState } from 'react'
import { Blocks, Search as SearchIcon, Sun, Moon, Network } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { useTheme } from './ThemeContext'
import ConnectWalletModal from './ConnectWalletModal'

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme()
  const [modal, setModal] = useState(false)
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
            <div className="flex-1 max-w-md mx-8 relative">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Search blocks, transactions, addresses..."
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch checked={theme === 'dark'} onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')} />
                <Moon className="h-4 w-4" />
              </div>
              <div className="text-sm text-muted-foreground">
                Block Height: <span className="font-mono font-semibold">1,247,892</span>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setModal(true)}
              >
                <Network className="w-4 h-4" />
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
      <ConnectWalletModal open={modal} onClose={() => setModal(false)} />
    </div>
  )
}
