import { Blocks, Search } from 'lucide-react'
import { useTheme } from './ThemeContext'

interface Props {
  blockHeight: number
  blockHash: string
}

export default function ExplorerHeader({ blockHeight, blockHash }: Props) {
  const { theme, setTheme } = useTheme()
  return (
    <header className="bg-black dark:bg-neutral-900 text-white border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center">
              <Blocks className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">BYDChain</span>
          </div>
          <span className="border border-white/20 text-white px-2 py-0.5 rounded text-xs">Mainnet</span>
          <span className="bg-green-700 text-white px-2 py-1 rounded-full text-xs">Healthy</span>
        </div>
        <div className="flex-1 mx-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search blocks, transactions, addresses..."
              className="w-full rounded-full bg-neutral-800 border border-white/10 pl-10 pr-4 py-2 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="cursor-pointer hover:opacity-80 transition-all duration-300 text-xl"
          >
            {theme === 'dark' ? '🌞' : '🌚'}
          </span>
          <div className="border border-white/20 rounded-lg px-3 py-1 text-sm leading-tight">
            <div>Block Height: {blockHeight}</div>
            <div className="font-mono text-xs truncate">{blockHash}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
