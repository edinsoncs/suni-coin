import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export function Separator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('shrink-0 bg-border', className)} role="separator" {...props} />
}
