import { Radio } from 'lucide-react'
import { cn } from '@/shared/utils'

export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-[var(--status-online)]/35 bg-[var(--status-online)]/10 px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-[var(--status-online)] uppercase',
        className,
      )}
    >
      <span className="r20-live-dot size-1.5 rounded-full bg-[var(--status-online)]" />
      <Radio size={12} />
      Ao vivo
    </span>
  )
}
