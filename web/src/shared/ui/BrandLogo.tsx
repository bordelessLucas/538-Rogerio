import { cn } from '@/shared/utils'

interface BrandLogoProps {
  variant?: 'mark' | 'full'
  className?: string
  markClassName?: string
}

export function BrandLogo({ variant = 'full', className, markClassName }: BrandLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img
        src="/brand/logo-mark.svg"
        alt=""
        className={cn('size-9 shrink-0 rounded-xl', markClassName)}
        width={36}
        height={36}
      />
      {variant === 'full' ? (
        <div className="min-w-0 leading-tight">
          <p className="text-[10px] font-semibold tracking-[0.22em] text-[var(--accent)] uppercase">
            R20 Telecom
          </p>
          <p className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
            R20 <span className="text-[var(--accent)]">NOC</span>
          </p>
        </div>
      ) : null}
    </div>
  )
}
