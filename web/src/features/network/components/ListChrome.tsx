import { Link } from 'react-router-dom'
import { MapPin, Pencil, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { CardShell } from '@/shared/ui'
import { cn } from '@/shared/utils'

export function OccupancyBadge({ percent }: { percent: number }) {
  const tone =
    percent > 80 ? 'offline' : percent >= 60 ? 'alert' : 'online'
  const emoji = percent > 80 ? '🔴' : percent >= 60 ? '🟡' : '🟢'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        tone === 'online' && 'bg-[var(--status-online)]/15 text-[var(--status-online)]',
        tone === 'alert' && 'bg-[var(--status-alert)]/15 text-[var(--status-alert)]',
        tone === 'offline' && 'bg-[var(--status-offline)]/15 text-[var(--status-offline)]',
      )}
    >
      {emoji} {percent.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
    </span>
  )
}

interface ListToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  placeholder?: string
  onCreate: () => void
  createLabel: string
  filters?: ReactNode
}

export function ListToolbar({
  search,
  onSearchChange,
  placeholder = 'Buscar...',
  onCreate,
  createLabel,
  filters,
}: ListToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] sm:max-w-xs"
        />
        {filters}
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-slate-950"
      >
        {createLabel}
      </button>
    </div>
  )
}

interface EntityActionsProps {
  onEdit: () => void
  onDelete: () => void
  mapQuery?: string
  detailsTo?: string
}

export function EntityActions({ onEdit, onDelete, mapQuery, detailsTo }: EntityActionsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 text-xs hover:border-[var(--accent)]"
      >
        <Pencil size={12} /> Editar
      </button>
      {mapQuery ? (
        <Link
          to={`/mapa`}
          className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 text-xs hover:border-[var(--accent)]"
          title={mapQuery}
        >
          <MapPin size={12} /> Mapa
        </Link>
      ) : null}
      {detailsTo ? (
        <Link
          to={detailsTo}
          className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 text-xs hover:border-[var(--accent)]"
        >
          Detalhes
        </Link>
      ) : null}
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center gap-1 rounded-lg border border-[var(--status-offline)]/40 px-2 py-1 text-xs text-[var(--status-offline)]"
      >
        <Trash2 size={12} /> Excluir
      </button>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <CardShell className="text-center">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-4 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-slate-950"
      >
        {actionLabel}
      </button>
    </CardShell>
  )
}

export function PaginationBar({
  page,
  pageCount,
  onPageChange,
  total,
}: {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  total: number
}) {
  if (pageCount <= 1) {
    return (
      <p className="text-xs text-[var(--text-muted)]">{total} registro(s)</p>
    )
  }

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <p className="text-xs text-[var(--text-muted)]">{total} registro(s)</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs disabled:opacity-40"
        >
          Anterior
        </button>
        <span className="text-xs text-[var(--text-muted)]">
          {page}/{pageCount}
        </span>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs disabled:opacity-40"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}

