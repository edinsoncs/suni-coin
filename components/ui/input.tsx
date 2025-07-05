import { cn } from '@/lib/utils'
import { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-lg border border-white/20 bg-black px-3 py-2 text-sm text-white placeholder:text-neutral-400 file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none focus:ring-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}
