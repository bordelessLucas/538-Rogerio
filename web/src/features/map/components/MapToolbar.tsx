import { LocateFixed, Maximize2, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { MapAsset } from '@/features/map/domain/mapTypes'

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
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <form
        onSubmit={handleSearch}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-panel)]/95 px-3 py-2 shadow-lg backdrop-blur"
      >
        <Search size={16} className="shrink-0 text-[var(--text-muted)]" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setSearchError(null)
          }}
          placeholder="Buscar CTO ou Cliente..."
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--accent)] px-2.5 py-1 text-xs font-medium text-slate-950"
        >
          Ir
        </button>
      </form>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onLocateMe}
          title="Minha localização"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-panel)]/95 px-3 py-2 text-sm shadow-lg backdrop-blur transition hover:border-[var(--accent)]"
        >
          <LocateFixed size={16} />
          <span className="hidden sm:inline">Minha localização</span>
        </button>
        <button
          type="button"
          onClick={onFitAll}
          title="Enquadrar todos"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-panel)]/95 px-3 py-2 text-sm shadow-lg backdrop-blur transition hover:border-[var(--accent)]"
        >
          <Maximize2 size={16} />
          <span className="hidden sm:inline">Enquadrar</span>
        </button>
      </div>

      {searchError || locateError ? (
        <p className="text-xs text-[var(--status-offline)] sm:absolute sm:top-full sm:mt-1">
          {searchError ?? locateError}
        </p>
      ) : null}
    </div>
  )
}
