import {
  EVENT_SEVERITY_LABEL,
  EVENT_TYPE_LABEL,
  type EventPeriod,
  type MonitoringFilters,
} from '@/features/monitoring/domain/types'
import type { EventSeverity, EventType } from '@/shared/types/network'
import { CardShell } from '@/shared/ui'

const TYPES = Object.keys(EVENT_TYPE_LABEL) as EventType[]
const SEVERITIES = Object.keys(EVENT_SEVERITY_LABEL) as EventSeverity[]
const PERIODS: Array<{ value: EventPeriod; label: string }> = [
  { value: '1h', label: '1 hora' },
  { value: '24h', label: '24 horas' },
  { value: '7d', label: '7 dias' },
  { value: 'all', label: 'Todos' },
]

interface EventFiltersPanelProps {
  filters: MonitoringFilters
  visibleCount: number
  onChange: (next: MonitoringFilters) => void
  onClearDeepLink: () => void
}

export function EventFiltersPanel({
  filters,
  visibleCount,
  onChange,
  onClearDeepLink,
}: EventFiltersPanelProps) {
  return (
    <CardShell className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium">Filtros</h3>
        <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] text-[var(--text-muted)]">
          {visibleCount} visíveis
        </span>
      </div>

      {(filters.ctoId || filters.clientId) && (
        <div className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-2 text-xs">
          <p className="text-[var(--text-muted)]">Filtro do detalhe</p>
          <p className="font-medium text-[var(--accent)]">
            {filters.ctoId ? `CTO ${filters.ctoId.slice(0, 8)}…` : null}
            {filters.clientId ? `Cliente ${filters.clientId.slice(0, 8)}…` : null}
          </p>
          <button
            type="button"
            onClick={onClearDeepLink}
            className="mt-1 text-[var(--accent)] underline"
          >
            Limpar filtro de ativo
          </button>
        </div>
      )}

      <label className="block space-y-1">
        <span className="text-xs text-[var(--text-muted)]">Busca</span>
        <input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Nome do ativo..."
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs text-[var(--text-muted)]">Tipo</span>
        <select
          value={filters.type}
          onChange={(e) =>
            onChange({
              ...filters,
              type: e.target.value as MonitoringFilters['type'],
            })
          }
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
        >
          <option value="all">Todos</option>
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {EVENT_TYPE_LABEL[type]}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-xs text-[var(--text-muted)]">Severidade</span>
        <select
          value={filters.severity}
          onChange={(e) =>
            onChange({
              ...filters,
              severity: e.target.value as MonitoringFilters['severity'],
            })
          }
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
        >
          <option value="all">Todas</option>
          {SEVERITIES.map((severity) => (
            <option key={severity} value={severity}>
              {EVENT_SEVERITY_LABEL[severity]}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-xs text-[var(--text-muted)]">Período</span>
        <select
          value={filters.period}
          onChange={(e) =>
            onChange({
              ...filters,
              period: e.target.value as EventPeriod,
            })
          }
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
        >
          {PERIODS.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.onlyUnacknowledged}
          onChange={(e) =>
            onChange({ ...filters, onlyUnacknowledged: e.target.checked })
          }
          className="accent-[var(--accent)]"
        />
        Só não reconhecidos
      </label>
    </CardShell>
  )
}
