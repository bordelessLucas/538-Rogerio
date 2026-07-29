import { Radio } from 'lucide-react'
import { cn } from '@/shared/utils'

export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-[var(--status-online)]/40 bg-[var(--status-online)]/10 px-2.5 py-1 text-xs font-semibold tracking-wide text-[var(--status-online)] uppercase',
        className,
      )}
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--status-online)] opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-[var(--status-online)]" />
      </span>
      <Radio size={12} />
      Ao vivo
    </span>
  )
}
