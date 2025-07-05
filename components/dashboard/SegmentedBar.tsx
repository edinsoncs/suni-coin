import { cn } from '@/lib/utils'

interface Segment {
  value: number
  color: string
}

export default function SegmentedBar({ segments, className }: { segments: Segment[]; className?: string }) {
  const total = segments.reduce((acc, s) => acc + s.value, 0)
  return (
    <div className={cn('flex h-2 w-full overflow-hidden rounded', className)}>
      {segments.map((s, i) => (
        <div
          key={i}
          style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
          className="transition-all"
        />
      ))}
    </div>
  )
}
