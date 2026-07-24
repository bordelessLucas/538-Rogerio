import type { ReactNode } from 'react'
import { cn } from '@/shared/utils'

interface StatusBadgeProps {
  label: string
  tone?: 'online' | 'alert' | 'offline' | 'disabled' | 'neutral'
}

const toneClass: Record<NonNullable<StatusBadgeProps['tone']>, string> = {
  online: 'bg-[var(--status-online)]/15 text-[var(--status-online)]',
  alert: 'bg-[var(--status-alert)]/15 text-[var(--status-alert)]',
  offline: 'bg-[var(--status-offline)]/15 text-[var(--status-offline)]',
  disabled: 'bg-[var(--status-disabled)]/15 text-[var(--status-disabled)]',
  neutral: 'bg-white/10 text-[var(--text-muted)]',
}

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', toneClass[tone])}>
      {label}
    </span>
  )
}

export function CardShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] p-4 shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function KpiSkeleton({ title }: { title: string }) {
  return (
    <CardShell>
      <p className="text-sm text-[var(--text-muted)]">{title}</p>
      <div className="mt-3 h-8 w-24 animate-pulse rounded bg-white/10" />
      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-white/5" />
    </CardShell>
  )
}
