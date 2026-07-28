import { STATUS_HEX, TYPE_LABEL } from '@/features/map/constants'
import type { MapStatusFilter, MapTypeFilter } from '@/features/map/domain/mapTypes'
import { STATUS_LABEL, cn } from '@/shared/utils'

const TYPE_KEYS = Object.keys(TYPE_LABEL) as Array<keyof MapTypeFilter>
const STATUS_KEYS = Object.keys(STATUS_LABEL) as Array<keyof MapStatusFilter>

interface MapFiltersProps {
  typeFilter: MapTypeFilter
  statusFilter: MapStatusFilter
  visibleCount: number
  onTypeChange: (key: keyof MapTypeFilter, value: boolean) => void
  onStatusChange: (key: keyof MapStatusFilter, value: boolean) => void
}

export function MapFilters({
  typeFilter,
  statusFilter,
  visibleCount,
  onTypeChange,
  onStatusChange,
}: MapFiltersProps) {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-panel)]/95 p-3 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-[var(--text-muted)] uppercase">
          Filtros
        </h3>
        <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] text-[var(--text-muted)]">
          {visibleCount} visíveis
        </span>
      </div>

      <fieldset className="space-y-1.5">
        <legend className="mb-1 text-[11px] text-[var(--text-muted)]">Tipo</legend>
        {TYPE_KEYS.map((key) => (
          <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={typeFilter[key]}
              onChange={(event) => onTypeChange(key, event.target.checked)}
              className="accent-[var(--accent)]"
            />
            <span>{TYPE_LABEL[key]}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="space-y-1.5 border-t border-[var(--border)] pt-3">
        <legend className="mb-1 text-[11px] text-[var(--text-muted)]">Status</legend>
        {STATUS_KEYS.map((key) => (
          <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={statusFilter[key]}
              onChange={(event) => onStatusChange(key, event.target.checked)}
              className="accent-[var(--accent)]"
            />
            <span
              className={cn('inline-block size-2 rounded-full')}
              style={{ background: STATUS_HEX[key] }}
            />
            <span>{STATUS_LABEL[key]}</span>
          </label>
        ))}
      </fieldset>
    </div>
  )
}
