import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export function DetailBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
            {index > 0 ? (
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            ) : null}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="text-[var(--text-muted)] transition hover:text-[var(--accent)]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  isLast ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-muted)]',
                )}
              >
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
