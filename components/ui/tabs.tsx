import { cn } from '@/lib/utils'
import * as React from 'react'

interface TabsContextValue {
  value: string
  setValue: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange?: (value: string) => void
}

export function Tabs({ className, value, onValueChange, children, ...props }: TabsProps) {
  const [current, setCurrent] = React.useState(value)
  const setValue = (v: string) => {
    setCurrent(v)
    onValueChange?.(v)
  }
  return (
    <TabsContext.Provider value={{ value: current, setValue }}>
      <div className={cn('flex flex-col', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('inline-flex items-center justify-start gap-6 border-b border-white/10 text-neutral-400', className)}
      {...props}
    />
  )
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
  const context = React.useContext(TabsContext)
  const active = context?.value === value
  return (
    <button
      className={cn(
        'relative px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none',
        active
          ? 'text-white after:absolute after:-bottom-px after:left-0 after:right-0 after:h-px after:bg-white transition-all'
          : 'text-neutral-400 hover:text-white',
        className,
      )}
      onClick={() => context?.setValue(value)}
      {...props}
    />
  )
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ className, value, ...props }: TabsContentProps) {
  const context = React.useContext(TabsContext)
  if (context?.value !== value) return null
  return <div className={cn('mt-4', className)} {...props} />
}
