import { LocateFixed, Maximize2, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { MapAsset } from '@/features/map/domain/mapTypes'
import { cn } from '@/shared/utils'

/** Fundo sólido: tiles OSM claros matam contraste em glass/transparente. */
const mapChrome =
  'border border-[var(--border-strong)] bg-[var(--bg-panel)] text-[var(--text-primary)] shadow-[0_8px_28px_rgba(0,0,0,0.55)]'

interface MapToolbarProps {
  assets: MapAsset[]
  onLocateMe: () => void
  onFitAll: () => void
  onFlyTo: (asset: MapAsset) => void
  locateError: string | null
}

export function MapToolbar({
  assets,
  onLocateMe,
  onFitAll,
  onFlyTo,
  locateError,
}: MapToolbarProps) {
  const [query, setQuery] = useState('')
  const [searchError, setSearchError] = useState<string | null>(null)

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    const normalized = query.trim().toLowerCase()
    if (!normalized) return

    const match = assets.find((asset) => asset.name.toLowerCase().includes(normalized))
    if (!match) {
      setSearchError('Nenhum ativo encontrado')
      return
    }

    setSearchError(null)
    onFlyTo(match)
  }

  return (
    <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center">
      <form
        onSubmit={handleSearch}
        className={cn(
          'flex min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-md)] px-3 py-2.5',
          mapChrome,
        )}
      >
        <Search size={16} className="shrink-0 text-[var(--accent)]" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setSearchError(null)
          }}
          placeholder="Buscar CTO ou Cliente..."
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
        />
        <button type="submit" className="r20-btn r20-btn-primary px-2.5 py-1 text-xs">
          Ir
        </button>
      </form>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onLocateMe}
          title="Minha localização"
          className={cn(
            'inline-flex items-center gap-2 rounded-[var(--radius-md)] px-3.5 py-2.5 text-sm font-semibold transition',
            mapChrome,
            'hover:border-[var(--accent)] hover:text-[var(--accent)]',
          )}
        >
          <LocateFixed size={16} className="shrink-0 text-[var(--accent)]" />
          <span className="hidden sm:inline">Minha localização</span>
        </button>
        <button
          type="button"
          onClick={onFitAll}
          title="Enquadrar todos"
          className={cn(
            'inline-flex items-center gap-2 rounded-[var(--radius-md)] px-3.5 py-2.5 text-sm font-semibold transition',
            mapChrome,
            'hover:border-[var(--accent)] hover:text-[var(--accent)]',
          )}
        >
          <Maximize2 size={16} className="shrink-0 text-[var(--accent)]" />
          <span className="hidden sm:inline">Enquadrar</span>
        </button>
      </div>

      {searchError || locateError ? (
        <p className="rounded-md border border-[var(--status-offline)]/40 bg-[var(--bg-panel)] px-2 py-1 text-xs text-[var(--status-offline)] sm:absolute sm:top-full sm:mt-1">
          {searchError ?? locateError}
        </p>
      ) : null}
    </div>
  )
}
