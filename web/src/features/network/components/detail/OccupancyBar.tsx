import { cn } from '@/shared/utils'

function occupancyTone(percent: number): 'online' | 'alert' | 'offline' {
  if (percent > 80) return 'offline'
  if (percent > 60) return 'alert'
  return 'online'
}

function occupancyEmoji(percent: number) {
  if (percent > 80) return '🔴'
  if (percent > 60) return '🟡'
  return '🟢'
}

interface OccupancyBarProps {
  percent: number
  occupied: number
  capacity: number
  free: number
  className?: string
}

export function OccupancyBar({
  percent,
  occupied,
  capacity,
  free,
  className,
}: OccupancyBarProps) {
  const tone = occupancyTone(percent)
  const width = Math.min(100, Math.max(0, percent))

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium">
          {occupancyEmoji(percent)}{' '}
          {percent.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% ocupação
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          {occupied}/{capacity} · {free} livres
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            tone === 'online' && 'bg-[var(--status-online)]',
            tone === 'alert' && 'bg-[var(--status-alert)]',
            tone === 'offline' && 'bg-[var(--status-offline)]',
          )}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}
