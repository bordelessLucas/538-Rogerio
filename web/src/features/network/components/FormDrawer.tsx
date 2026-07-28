import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { cn } from '@/shared/utils'

interface FormDrawerProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function FormDrawer({ open, title, onClose, children, footer }: FormDrawerProps) {
  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1500] flex justify-end">
      <button
        type="button"
        aria-label="Fechar formulário"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <aside
        className={cn(
          'relative flex h-full w-full max-w-lg flex-col border-l border-[var(--border)] bg-[var(--bg-panel)] shadow-2xl',
        )}
      >
        <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer ? (
          <footer className="border-t border-[var(--border)] px-4 py-3">{footer}</footer>
        ) : null}
      </aside>
    </div>
  )
}
