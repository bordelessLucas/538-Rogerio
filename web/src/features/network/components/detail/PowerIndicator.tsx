import { cn } from '@/shared/utils'

/** Limiar típico FTTH: potencia < -26 dBm = sinal ruim. */
export const POWER_ALERT_DBM = -26

interface PowerIndicatorProps {
  powerDbm: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function powerTone(powerDbm: number): 'online' | 'alert' | 'offline' {
  if (powerDbm < POWER_ALERT_DBM - 2) return 'offline'
  if (powerDbm < POWER_ALERT_DBM) return 'alert'
  return 'online'
}

export function PowerIndicator({ powerDbm, className, size = 'md' }: PowerIndicatorProps) {
  const tone = powerTone(powerDbm)
  const isBad = powerDbm < POWER_ALERT_DBM

  return (
    <div className={cn('inline-flex flex-col gap-1', className)}>
      <span
        className={cn(
          'inline-flex items-baseline gap-1 font-mono-metric font-semibold tabular-nums',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-3xl',
          tone === 'online' && 'text-[var(--status-online)]',
          tone === 'alert' && 'text-[var(--status-alert)]',
          tone === 'offline' && 'text-[var(--status-offline)]',
        )}
      >
        {powerDbm.toFixed(1)}
        <span className="text-sm font-normal text-[var(--text-muted)]">dBm</span>
      </span>
      {isBad ? (
        <span className="text-xs text-[var(--status-alert)]">
          Abaixo de {POWER_ALERT_DBM} dBm — sinal ruim
        </span>
      ) : (
        <span className="text-xs text-[var(--text-muted)]">Dentro do limiar operacional</span>
      )}
    </div>
  )
}
