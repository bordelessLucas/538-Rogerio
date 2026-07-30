import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CardShell, KpiSkeleton } from '@/shared/ui'
import { cn } from '@/shared/utils'

export type KpiTone = 'online' | 'offline' | 'alert' | 'info' | 'warn' | 'neutral'

const toneStyles: Record<
  KpiTone,
  { icon: string; value: string; ring: string; bar: string }
> = {
  online: {
    icon: 'text-[var(--status-online)]',
    value: 'text-[var(--status-online)]',
    ring: 'hover:border-[var(--status-online)]/45',
    bar: 'from-[var(--status-online)]/50',
  },
  offline: {
    icon: 'text-[var(--status-offline)]',
    value: 'text-[var(--status-offline)]',
    ring: 'hover:border-[var(--status-offline)]/45',
    bar: 'from-[var(--status-offline)]/50',
  },
  alert: {
    icon: 'text-[var(--status-alert)]',
    value: 'text-[var(--status-alert)]',
    ring: 'hover:border-[var(--status-alert)]/45',
    bar: 'from-[var(--status-alert)]/50',
  },
  info: {
    icon: 'text-[var(--accent)]',
    value: 'text-[var(--accent)]',
    ring: 'hover:border-[var(--accent)]/45',
    bar: 'from-[var(--accent)]/50',
  },
  warn: {
    icon: 'text-[var(--status-warn)]',
    value: 'text-[var(--status-warn)]',
    ring: 'hover:border-[var(--status-warn)]/45',
    bar: 'from-[var(--status-warn)]/50',
  },
  neutral: {
    icon: 'text-[var(--text-muted)]',
    value: 'text-[var(--text-primary)]',
    ring: 'hover:border-[var(--border-strong)]',
    bar: 'from-white/20',
  },
}

interface KpiCardProps {
  title: string
  value: string | number | null
  icon: LucideIcon
  tone?: KpiTone
  hint?: string
  to?: string
  isLoading?: boolean
  error?: boolean
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  tone = 'neutral',
  hint,
  to,
  isLoading,
  error,
}: KpiCardProps) {
  if (isLoading) {
    return <KpiSkeleton title={title} />
  }

  const styles = toneStyles[tone]
  const content = (
    <CardShell
      className={cn(
        'relative h-full overflow-hidden transition duration-150',
        to ? cn('cursor-pointer', styles.ring) : undefined,
        error ? 'border-[var(--status-offline)]/40' : undefined,
      )}
    >
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent',
          styles.bar,
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--text-muted)] uppercase">
          {title}
        </p>
        <span
          className={cn(
            'inline-flex size-8 items-center justify-center rounded-lg bg-white/4 ring-1 ring-white/6',
            styles.icon,
          )}
        >
          <Icon size={16} />
        </span>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-[var(--status-offline)]">Falha ao carregar</p>
      ) : (
        <p
          className={cn(
            'font-mono-metric mt-4 text-3xl font-semibold tracking-tight md:text-[2rem]',
            styles.value,
          )}
        >
          {value ?? '—'}
        </p>
      )}
      {hint ? (
        <p className="mt-2 text-xs text-[var(--text-muted)]">{hint}</p>
      ) : null}
    </CardShell>
  )

  if (to) {
    return (
      <Link to={to} className="block h-full">
        {content}
      </Link>
    )
  }

  return content
}
