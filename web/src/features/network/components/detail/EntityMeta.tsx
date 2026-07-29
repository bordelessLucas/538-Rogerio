import { Link } from 'react-router-dom'
import { cn } from '@/shared/utils'

export interface EntityMetaLink {
  label: string
  value: string
  to?: string
}

interface EntityMetaProps {
  items: EntityMetaLink[]
  className?: string
}

/** Breadcrumb hierárquico OLT → PON → CTO (com links quando houver rota). */
export function EntityMeta({ items, className }: EntityMetaProps) {
  return (
    <ol
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--text-muted)]',
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
          {index > 0 ? <span className="text-[var(--border)]">→</span> : null}
          <span className="text-xs uppercase tracking-wide">{item.label}</span>
          {item.to ? (
            <Link to={item.to} className="font-medium text-[var(--accent)] hover:underline">
              {item.value}
            </Link>
          ) : (
            <span className="font-medium text-[var(--text-primary)]">{item.value}</span>
          )}
        </li>
      ))}
    </ol>
  )
}
