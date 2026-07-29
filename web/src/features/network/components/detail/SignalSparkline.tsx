import { cn } from '@/shared/utils'

/** Sparkline fake de histórico de sinal (placeholder Dia 05 / base Dia 06). */
export function SignalSparkline({
  powerDbm,
  className,
}: {
  powerDbm: number
  className?: string
}) {
  const points = Array.from({ length: 24 }, (_, index) => {
    const wobble = Math.sin(index / 2.2) * 1.4 + Math.cos(index / 3.1) * 0.8
    return powerDbm + wobble + ((index % 5) - 2) * 0.15
  })

  const min = Math.min(...points) - 1
  const max = Math.max(...points) + 1
  const range = max - min || 1
  const width = 240
  const height = 48

  const path = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <div className={cn('space-y-2', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-12 w-full text-[var(--accent)]"
        role="img"
        aria-label="Histórico simulado de potência"
      >
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <p className="text-xs text-[var(--text-muted)]">
        Últimas 24 amostras simuladas · média {powerDbm.toFixed(1)} dBm
      </p>
    </div>
  )
}
