interface MiniChartProps {
  data: number[]
  color: string
}

export default function MiniChart({ data, color }: MiniChartProps) {
  if (!data.length) return <svg className="w-full h-20" />
  const max = Math.max(...data, 1)
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - (v / max) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox="0 0 100 100" className="w-full h-20">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  )
}
