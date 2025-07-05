import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatBlockProps {
  title: string
  value: ReactNode
  icon?: ReactNode
}

export default function StatBlock({ title, value, icon }: StatBlockProps) {
  return (
    <div
      className="bg-neutral-900 rounded-xl p-4 flex items-center space-x-3 hover:shadow-md hover:shadow-white/10 transition"
    >
      {icon && (
        <span className="text-xl" aria-label={title}>
          {icon}
        </span>
      )}
      <div>
        <div className="text-neutral-400 uppercase text-xs tracking-wide">
          {title}
        </div>
        <div className="text-white text-xl font-semibold text-balance">
          {value}
        </div>
      </div>
    </div>
  )
}
