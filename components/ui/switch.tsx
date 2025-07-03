import { cn } from '@/lib/utils'
import * as React from 'react'

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function Switch({ className, checked = false, onCheckedChange, ...props }: SwitchProps) {
  const [isChecked, setChecked] = React.useState(checked)

  React.useEffect(() => {
    setChecked(checked)
  }, [checked])

  const toggle = () => {
    const val = !isChecked
    setChecked(val)
    onCheckedChange?.(val)
  }
  return (
    <button
      type="button"
      aria-checked={isChecked}
      role="switch"
      onClick={toggle}
      className={cn('inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50', isChecked ? 'bg-primary' : 'bg-input', className)}
      {...props}
    >
      <span className={cn('pointer-events-none block h-5 w-5 transform rounded-full bg-background shadow transition-transform', isChecked ? 'translate-x-5' : 'translate-x-0')} />
    </button>
  )
}
