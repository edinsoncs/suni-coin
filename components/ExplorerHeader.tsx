import { Blocks, Search } from 'lucide-react'
import { useTheme } from './ThemeContext'

interface Props {
  blockHeight: number
  blockHash: string
}

export default function ExplorerHeader({ blockHeight, blockHash }: Props) {
  const { theme, setTheme } = useTheme()
  return (
    <header className="h-16 bg-neutral-950 border-b border-white/10 px-6 text-white">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-purple-500 to-fuchsia-600">
              <Blocks className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">BYDChain</span>
          </div>
          <span className="rounded-md border border-white/20 px-2 py-0.5 text-xs text-white">Mainnet</span>
          <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs text-white">Healthy</span>
        </div>
        <div className="mx-8 flex-1 max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              aria-label="Search"
              placeholder="Search blocks, transactions, addresses..."
              className="w-full rounded-md border border-white/20 bg-transparent py-1.5 pl-9 pr-4 text-sm placeholder:text-neutral-400 hover:border-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/50 transition-all duration-200"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-lg transition-opacity hover:opacity-75"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <div className="flex items-center space-x-2 text-xs">
            <span className="whitespace-nowrap">
              <span aria-hidden="true" className="mr-1">🌒</span>Block Height: {blockHeight}
            </span>
            <span className="truncate rounded border border-white/20 bg-white/5 px-2 py-0.5 font-mono">
              {blockHash}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
