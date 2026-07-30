import type { ReactNode } from 'react'
import { cn } from '@/shared/utils'

export { BrandLogo } from '@/shared/ui/BrandLogo'

interface StatusBadgeProps {
  label: string
  tone?: 'online' | 'alert' | 'offline' | 'disabled' | 'neutral' | 'warn'
}

const toneClass: Record<NonNullable<StatusBadgeProps['tone']>, string> = {
  online: 'bg-[var(--status-online)]/15 text-[var(--status-online)] ring-[var(--status-online)]/25',
  alert: 'bg-[var(--status-alert)]/15 text-[var(--status-alert)] ring-[var(--status-alert)]/25',
  offline: 'bg-[var(--status-offline)]/15 text-[var(--status-offline)] ring-[var(--status-offline)]/25',
  disabled: 'bg-[var(--status-disabled)]/15 text-[var(--status-disabled)] ring-[var(--status-disabled)]/20',
  neutral: 'bg-white/8 text-[var(--text-muted)] ring-white/10',
  warn: 'bg-[var(--status-warn)]/15 text-[var(--status-warn)] ring-[var(--status-warn)]/25',
}

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ring-1 ring-inset',
        toneClass[tone],
      )}
    >
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
        'rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-panel)] p-4 shadow-[var(--shadow-panel)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--text-muted)] uppercase">
      {children}
    </h2>
  )
}

export function KpiSkeleton({ title }: { title: string }) {
  return (
    <CardShell className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
      <p className="text-xs font-medium tracking-wide text-[var(--text-muted)] uppercase">
        {title}
      </p>
      <div className="mt-4 h-8 w-24 animate-pulse rounded bg-white/10" />
      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-white/5" />
    </CardShell>
  )
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <CardShell className="hidden md:block">
        <div className="space-y-3">
          {Array.from({ length: rows }, (_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-20 animate-pulse rounded bg-white/5" />
              <div className="ml-auto h-4 w-24 animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </div>
      </CardShell>
      <div className="grid gap-3 md:hidden">
        {Array.from({ length: Math.min(rows, 4) }, (_, index) => (
          <CardShell key={index}>
            <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
            <div className="mt-3 h-3 w-28 animate-pulse rounded bg-white/5" />
            <div className="mt-2 h-3 w-20 animate-pulse rounded bg-white/5" />
          </CardShell>
        ))}
      </div>
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-3 w-48 animate-pulse rounded bg-white/5" />
      <CardShell>
        <div className="h-7 w-56 animate-pulse rounded bg-white/10" />
        <div className="mt-3 h-3 w-72 max-w-full animate-pulse rounded bg-white/5" />
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="h-9 w-28 animate-pulse rounded-lg bg-white/5" />
          <div className="h-9 w-28 animate-pulse rounded-lg bg-white/5" />
          <div className="h-9 w-36 animate-pulse rounded-lg bg-white/5" />
        </div>
      </CardShell>
      <div className="grid gap-4 lg:grid-cols-3">
        <CardShell>
          <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-10 w-20 animate-pulse rounded bg-white/5" />
        </CardShell>
        <CardShell className="lg:col-span-2">
          <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-white/5" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-white/5" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
          </div>
        </CardShell>
      </div>
    </div>
  )
}
