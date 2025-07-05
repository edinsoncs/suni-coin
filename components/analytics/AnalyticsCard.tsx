import { ReactNode } from 'react'
import MiniChart from './MiniChart'
import StatBlock from './StatBlock'

interface AnalyticsCardProps {
  title: string
  value: ReactNode
  icon?: ReactNode
  data?: number[]
  color?: string
}

export default function AnalyticsCard({
  title,
  value,
  icon,
  data = [],
  color = '#3b82f6',
}: AnalyticsCardProps) {
  return (
    <div className="bg-neutral-900 rounded-xl p-4 hover:shadow-md hover:shadow-white/10 transition space-y-2">
      <StatBlock title={title} value={value} icon={icon} />
      {data.length > 0 && <MiniChart data={data} color={color} />}
    </div>
  )
}
