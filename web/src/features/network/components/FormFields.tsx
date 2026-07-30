import type { ReactNode } from 'react'

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
      <span className="text-xs font-medium tracking-wide text-[var(--text-muted)] uppercase">
        {label}
      </span>
      {children}
      {error ? <span className="text-xs text-[var(--status-offline)]">{error}</span> : null}
    </label>
  )
}

export const fieldControlClass =
  'r20-input text-sm'

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
      <button type="button" onClick={onCancel} className="r20-btn r20-btn-ghost">
        Cancelar
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="r20-btn r20-btn-primary disabled:opacity-60"
      >
        {isSubmitting ? 'Salvando...' : submitLabel}
      </button>
    </div>
  )
}
