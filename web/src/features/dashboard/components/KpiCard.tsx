import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CardShell, KpiSkeleton } from '@/shared/ui'
import { cn } from '@/shared/utils'

export type KpiTone = 'online' | 'offline' | 'alert' | 'info' | 'warn' | 'neutral'

const toneStyles: Record<KpiTone, { icon: string; value: string; ring: string }> = {
  online: {
    icon: 'text-[var(--status-online)]',
    value: 'text-[var(--status-online)]',
    ring: 'hover:border-[var(--status-online)]/50',
  },
  offline: {
    icon: 'text-[var(--status-offline)]',
    value: 'text-[var(--status-offline)]',
    ring: 'hover:border-[var(--status-offline)]/50',
  },
  alert: {
    icon: 'text-[var(--status-alert)]',
    value: 'text-[var(--status-alert)]',
    ring: 'hover:border-[var(--status-alert)]/50',
  },
  info: {
    icon: 'text-[var(--accent)]',
    value: 'text-[var(--accent)]',
    ring: 'hover:border-[var(--accent)]/50',
  },
  warn: {
    icon: 'text-orange-400',
    value: 'text-orange-400',
    ring: 'hover:border-orange-400/50',
  },
  neutral: {
    icon: 'text-[var(--text-muted)]',
    value: 'text-[var(--text-primary)]',
    ring: 'hover:border-[var(--border)]',
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
        'h-full transition',
        to ? cn('cursor-pointer', styles.ring) : undefined,
        error ? 'border-[var(--status-offline)]/40' : undefined,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-[var(--text-muted)]">{title}</p>
        <Icon size={18} className={styles.icon} />
      </div>
      {error ? (
        <p className="mt-3 text-sm text-[var(--status-offline)]">Falha ao carregar</p>
      ) : (
        <p className={cn('mt-3 text-3xl font-semibold tracking-tight', styles.value)}>
          {value ?? '—'}
        </p>
      )}
      {hint ? <p className="mt-2 text-xs text-[var(--text-muted)]">{hint}</p> : null}
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
