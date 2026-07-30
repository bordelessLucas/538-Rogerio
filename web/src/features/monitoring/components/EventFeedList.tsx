import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  AlertTriangle,
  Check,
  ExternalLink,
  Radio,
  RefreshCw,
  Signal,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  EVENT_SEVERITY_LABEL,
  EVENT_TYPE_LABEL,
} from '@/features/monitoring/domain/types'
import { eventAssetPath } from '@/features/monitoring/utils/monitoringFilters'
import { StatusBadge } from '@/shared/ui'
import type { EventSeverity, EventType, NetworkEvent } from '@/shared/types/network'
import { cn } from '@/shared/utils'

function severityTone(severity: EventSeverity): 'online' | 'alert' | 'offline' | 'neutral' {
  if (severity === 'critical') return 'offline'
  if (severity === 'warning') return 'alert'
  if (severity === 'info') return 'online'
  return 'neutral'
}

function EventIcon({ type }: { type: EventType }) {
  const className = 'shrink-0 text-[var(--text-muted)]'
  if (type === 'client_offline') return <WifiOff size={16} className={className} />
  if (type === 'client_online') return <Wifi size={16} className={className} />
  if (type === 'power_alert') return <Signal size={16} className={className} />
  if (type === 'signal_oscillation') return <Radio size={16} className={className} />
  if (type === 'onu_reboot') return <RefreshCw size={16} className={className} />
  return <AlertTriangle size={16} className={className} />
}

interface EventFeedListProps {
  events: NetworkEvent[]
  isLoading: boolean
  error: Error | null
  acknowledgingId: string | null
  onAcknowledge: (id: string) => void
}

export function EventFeedList({
  events,
  isLoading,
  error,
  acknowledgingId,
  onAcknowledge,
}: EventFeedListProps) {
  if (error) {
    return (
      <p className="text-sm text-[var(--status-offline)]">
        Falha ao carregar eventos: {error.message}
      </p>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-20 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]"
          />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-panel)] px-4 py-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          Nenhum evento com os filtros atuais.
        </p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Use o simulador (admin), a demo automática ou aplique o seed no Dashboard.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-slate-950"
        >
          Ir ao Dashboard
        </Link>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {events.map((event) => {
        const detailPath = eventAssetPath(event)
        const border =
          event.severity === 'critical'
            ? 'border-[var(--status-offline)]/35'
            : event.severity === 'warning'
              ? 'border-[var(--status-alert)]/35'
              : 'border-[var(--border)]'

        return (
          <li
            key={event.id}
            className={cn(
              'rounded-xl border bg-[var(--bg-panel)] px-3 py-3 md:px-4',
              border,
              event.acknowledged && 'opacity-70',
            )}
          >
            <div className="flex items-start gap-3">
              <EventIcon type={event.type} />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{event.title}</p>
                  <StatusBadge
                    label={EVENT_SEVERITY_LABEL[event.severity]}
                    tone={severityTone(event.severity)}
                  />
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {EVENT_TYPE_LABEL[event.type]}
                  </span>
                  {event.acknowledged ? (
                    <span className="text-[11px] text-[var(--status-online)]">Reconhecido</span>
                  ) : null}
                </div>
                <p className="text-sm text-[var(--text-muted)]">{event.description}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {event.assetName} ·{' '}
                  {formatDistanceToNow(new Date(event.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {detailPath ? (
                    <Link
                      to={detailPath}
                      className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 text-xs hover:border-[var(--accent)]"
                    >
                      <ExternalLink size={12} /> Ver ativo
                    </Link>
                  ) : null}
                  {!event.acknowledged ? (
                    <button
                      type="button"
                      disabled={acknowledgingId === event.id}
                      onClick={() => onAcknowledge(event.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 text-xs hover:border-[var(--status-online)] disabled:opacity-50"
                    >
                      <Check size={12} /> Reconhecer
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
