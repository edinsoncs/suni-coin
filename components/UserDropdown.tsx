import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Send, Wallet, BarChart2, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  onLogout?: () => void
  className?: string
}

export default function UserDropdown({ onLogout, className }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <div
      role="menu"
      tabIndex={-1}
      className={cn(
        'absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 shadow-lg space-y-2 text-sm font-medium text-white',
        'transition ease-out duration-200 transform',
        mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        className
      )}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <Link
        href="/send"
        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-white/10 hover:text-white transition-colors duration-200"
      >
        <Send className="w-4 h-4" /> Send Transaction
      </Link>
      <Link
        href="/wallet"
        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-white/10 hover:text-white transition-colors duration-200"
      >
        <Wallet className="w-4 h-4" /> Wallet
      </Link>
      <Link
        href="/analytics"
        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-white/10 hover:text-white transition-colors duration-200"
      >
        <BarChart2 className="w-4 h-4" /> Analytics
      </Link>
      <button
        onClick={onLogout}
        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-red-400 hover:bg-white/10 hover:text-red-500 transition-colors duration-200"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  )
}
