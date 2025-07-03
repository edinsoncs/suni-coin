import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-border',
    destructive: 'bg-destructive text-destructive-foreground',
  }
  return (
    <span className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold', variants[variant], className)} {...props} />
  )
}
