import type { ReactNode } from 'react'
import { cn } from '@/shared/utils'

export function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="text-[var(--text-muted)]">{label}</span>
      {children}
      {error ? <span className="text-xs text-[var(--status-offline)]">{error}</span> : null}
    </label>
  )
}

export const fieldControlClass =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none transition focus:border-[var(--accent)]'

export function FormActions({
  isSubmitting,
  onCancel,
  submitLabel,
}: {
  isSubmitting: boolean
  onCancel: () => void
  submitLabel: string
}) {
  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-muted)]"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-slate-950',
          'disabled:opacity-60',
        )}
      >
        {isSubmitting ? 'Salvando...' : submitLabel}
      </button>
    </div>
  )
}
