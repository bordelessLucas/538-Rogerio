import type { ReactNode } from 'react'
import { cn } from '@/shared/utils'

interface DetailSectionProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function DetailSection({
  title,
  description,
  action,
  children,
  className,
}: DetailSectionProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] p-4',
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-medium">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
