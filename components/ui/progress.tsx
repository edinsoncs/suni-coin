import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
}

export function Progress({ className, value = 0, ...props }: ProgressProps) {
  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded bg-muted', className)} {...props}>
      <div className="h-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  )
}
