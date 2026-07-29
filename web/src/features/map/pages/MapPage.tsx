import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapFilters } from '@/features/map/components/MapFilters'
import { MapLegend } from '@/features/map/components/MapLegend'
import { MapToolbar } from '@/features/map/components/MapToolbar'
import { NetworkMap } from '@/features/map/components/NetworkMap'
import type { MapAsset, MapStatusFilter, MapTypeFilter } from '@/features/map/domain/mapTypes'
import { useMapAssets } from '@/features/map/hooks/useMapAssets'
import { parseMapDeepLink } from '@/features/map/utils/mapDeepLink'

const DEFAULT_TYPE_FILTER: MapTypeFilter = {
  client: true,
  cto: true,
  olt: true,
  pop: true,
}

const DEFAULT_STATUS_FILTER: MapStatusFilter = {
  online: true,
  alert: true,
  offline: true,
  disabled: true,
}

function filterAssets(
  assets: MapAsset[],
  typeFilter: MapTypeFilter,
  statusFilter: MapStatusFilter,
): MapAsset[] {
  return assets.filter(
    (asset) => typeFilter[asset.type] && statusFilter[asset.status],
  )
}

function focusAsset(asset: MapAsset): {
  typeFilter: Partial<MapTypeFilter>
  statusFilter: Partial<MapStatusFilter>
} {
  return {
    typeFilter: { [asset.type]: true },
    statusFilter: { [asset.status]: true },
  }
}

export function MapPage() {
  const [searchParams] = useSearchParams()
  const deepLink = parseMapDeepLink(searchParams)
  const deepLinkKey = deepLink ? `${deepLink.type}:${deepLink.id}` : null
  const focusedDeepLinkRef = useRef<string | null>(null)

  const { assets, isLoading, error } = useMapAssets()
  const [typeFilter, setTypeFilter] = useState<MapTypeFilter>(DEFAULT_TYPE_FILTER)
  const [statusFilter, setStatusFilter] = useState<MapStatusFilter>(DEFAULT_STATUS_FILTER)
  const [fitToken, setFitToken] = useState(0)
  const [locateToken, setLocateToken] = useState(0)
  const [flyTo, setFlyTo] = useState<MapAsset | null>(null)
  const [locateError, setLocateError] = useState<string | null>(null)
  const [deepLinkError, setDeepLinkError] = useState<string | null>(null)
  const [hasInitialFit, setHasInitialFit] = useState(false)

  const visibleAssets = filterAssets(assets, typeFilter, statusFilter)

  useEffect(() => {
    if (isLoading || !deepLinkKey || !deepLink) return
    if (focusedDeepLinkRef.current === deepLinkKey) return

    const target = assets.find(
      (asset) => asset.type === deepLink.type && asset.id === deepLink.id,
    )

    if (!target) {
      if (assets.length > 0) {
        focusedDeepLinkRef.current = deepLinkKey
        setDeepLinkError('Ativo não encontrado no mapa (sem coordenadas ou ID inválido).')
        setHasInitialFit(true)
      }
      return
    }

    const patch = focusAsset(target)
    setTypeFilter((prev) => ({ ...prev, ...patch.typeFilter }))
    setStatusFilter((prev) => ({ ...prev, ...patch.statusFilter }))
    setFlyTo({ ...target })
    setDeepLinkError(null)
    setHasInitialFit(true)
    focusedDeepLinkRef.current = deepLinkKey
  }, [assets, deepLink, deepLinkKey, isLoading])

  useEffect(() => {
    if (deepLinkKey) return
    if (hasInitialFit || isLoading || visibleAssets.length === 0) return
    setFitToken((token) => token + 1)
    setHasInitialFit(true)
  }, [deepLinkKey, hasInitialFit, isLoading, visibleAssets.length])

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden">
      <NetworkMap
        assets={visibleAssets}
        fitToken={fitToken}
        flyTo={flyTo}
        locateToken={locateToken}
        onLocateError={setLocateError}
      />

      <div className="pointer-events-none absolute inset-0 z-[1000] p-3 md:p-4">
        <div className="pointer-events-auto relative max-w-3xl">
          <MapToolbar
            assets={assets}
            locateError={locateError}
            onLocateMe={() => {
              setLocateError(null)
              setLocateToken((token) => token + 1)
            }}
            onFitAll={() => setFitToken((token) => token + 1)}
            onFlyTo={(asset) => {
              const patch = focusAsset(asset)
              setTypeFilter((prev) => ({ ...prev, ...patch.typeFilter }))
              setStatusFilter((prev) => ({ ...prev, ...patch.statusFilter }))
              setFlyTo({ ...asset })
            }}
          />
        </div>

        <div className="pointer-events-none absolute top-16 right-3 bottom-3 left-3 flex items-start justify-between gap-3 md:top-20 md:right-4 md:bottom-4 md:left-4">
          <div className="pointer-events-auto max-h-full w-56 overflow-y-auto sm:w-60">
            <MapFilters
              typeFilter={typeFilter}
              statusFilter={statusFilter}
              visibleCount={visibleAssets.length}
              onTypeChange={(key, value) =>
                setTypeFilter((prev) => ({ ...prev, [key]: value }))
              }
              onStatusChange={(key, value) =>
                setStatusFilter((prev) => ({ ...prev, [key]: value }))
              }
            />
          </div>

          <div className="pointer-events-auto hidden max-h-full w-56 overflow-y-auto sm:block">
            <MapLegend />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="absolute inset-0 z-[1100] flex items-center justify-center bg-[var(--bg-base)]/70 text-sm text-[var(--text-muted)]">
          Carregando ativos do mapa...
        </div>
      ) : null}

      {error ? (
        <div className="absolute inset-x-0 bottom-4 z-[1100] mx-auto max-w-md rounded-xl border border-[var(--status-offline)]/40 bg-[var(--bg-panel)] px-4 py-3 text-center text-sm text-[var(--status-offline)]">
          Falha ao carregar ativos: {error.message}
        </div>
      ) : null}

      {deepLinkError ? (
        <div className="absolute inset-x-0 bottom-4 z-[1100] mx-auto max-w-md rounded-xl border border-[var(--status-alert)]/40 bg-[var(--bg-panel)] px-4 py-3 text-center text-sm text-[var(--status-alert)]">
          {deepLinkError}
        </div>
      ) : null}

      {!isLoading && !error && assets.length === 0 ? (
        <div className="absolute inset-x-0 bottom-4 z-[1100] mx-auto max-w-md rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] px-4 py-3 text-center text-sm text-[var(--text-muted)]">
          Nenhum ativo com coordenadas. Aplique o seed no Dashboard.
        </div>
      ) : null}
    </div>
  )
}
