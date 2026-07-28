import { createContext, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/shared/utils'

type ToastTone = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

interface ToastContextValue {
  pushToast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  function pushToast(message: string, tone: ToastTone = 'info') {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev, { id, message, tone }])
    window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }, 3500)
  }

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-[2000] flex w-full max-w-sm flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur',
              item.tone === 'success' &&
                'border-[var(--status-online)]/40 bg-[var(--bg-panel)] text-[var(--status-online)]',
              item.tone === 'error' &&
                'border-[var(--status-offline)]/40 bg-[var(--bg-panel)] text-[var(--status-offline)]',
              item.tone === 'info' &&
                'border-[var(--border)] bg-[var(--bg-panel)] text-[var(--text-primary)]',
            )}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast deve ser usado dentro de ToastProvider')
  }
  return ctx
}
