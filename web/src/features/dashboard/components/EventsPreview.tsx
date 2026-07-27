import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Radio } from 'lucide-react'
import { CardShell, StatusBadge } from '@/shared/ui'
import type { EventSeverity, NetworkEvent } from '@/shared/types/network'

function severityTone(severity: EventSeverity): 'online' | 'alert' | 'offline' | 'neutral' {
  if (severity === 'critical') return 'offline'
  if (severity === 'warning') return 'alert'
  if (severity === 'info') return 'online'
  return 'neutral'
}

interface EventsPreviewProps {
  events: NetworkEvent[]
  isLoading: boolean
  error: Error | null
}

export function EventsPreview({ events, isLoading, error }: EventsPreviewProps) {
  return (
    <CardShell className="lg:col-span-2">
      <div className="mb-3 flex items-center gap-2">
        <Radio size={16} className="text-[var(--accent)]" />
        <h3 className="font-medium">Últimos eventos</h3>
      </div>

      {error ? (
        <p className="text-sm text-[var(--status-offline)]">Não foi possível carregar os eventos.</p>
      ) : null}

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2"
            >
              <div className="h-3 w-48 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading && !error && events.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          Nenhum evento ainda. Aplique o seed Firebase para popular a demo.
        </p>
      ) : null}

      {!isLoading && events.length > 0 ? (
        <ul className="space-y-2">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium">{event.title}</p>
                  <StatusBadge label={event.severity} tone={severityTone(event.severity)} />
                </div>
                <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                  {event.assetName} · {event.description}
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-[var(--text-muted)]">
                {formatDistanceToNow(new Date(event.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </CardShell>
  )
}
