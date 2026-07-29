import { AlertTriangle, Radio, Signal, WifiOff } from 'lucide-react'
import type { MonitoringSummary } from '@/features/monitoring/domain/types'
import { CardShell } from '@/shared/ui'

function SummaryCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string
  value: number
  icon: typeof WifiOff
  tone: 'offline' | 'alert' | 'warn' | 'info'
}) {
  const color =
    tone === 'offline'
      ? 'text-[var(--status-offline)]'
      : tone === 'alert'
        ? 'text-[var(--status-alert)]'
        : tone === 'warn'
          ? 'text-orange-400'
          : 'text-[var(--accent)]'

  return (
    <CardShell className="space-y-2 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-[var(--text-muted)]">{title}</p>
        <Icon size={14} className={color} />
      </div>
      <p className={`text-2xl font-semibold tabular-nums ${color}`}>{value}</p>
    </CardShell>
  )
}

export function MonitoringSummaryCards({ summary }: { summary: MonitoringSummary }) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <SummaryCard
        title="Offline agora"
        value={summary.offlineNow}
        icon={WifiOff}
        tone="offline"
      />
      <SummaryCard
        title="Alertas de potência"
        value={summary.powerAlerts}
        icon={Signal}
        tone="alert"
      />
      <SummaryCard
        title="Oscilações (1h)"
        value={summary.oscillationsLastHour}
        icon={Radio}
        tone="warn"
      />
      <SummaryCard
        title="Críticos não reconhecidos"
        value={summary.criticalUnacked}
        icon={AlertTriangle}
        tone="offline"
      />
    </div>
  )
}
