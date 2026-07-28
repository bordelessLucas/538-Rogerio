import L from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import { AssetMarker } from '@/features/map/components/AssetMarker'
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
} from '@/features/map/constants'
import type { MapAsset } from '@/features/map/domain/mapTypes'

interface MapControllerProps {
  fitToken: number
  flyTo: MapAsset | null
  locateToken: number
  assets: MapAsset[]
  onLocateError: (message: string | null) => void
}

function MapController({
  fitToken,
  flyTo,
  locateToken,
  assets,
  onLocateError,
}: MapControllerProps) {
  const map = useMap()

  useEffect(() => {
    if (fitToken === 0 || assets.length === 0) return
    const bounds = L.latLngBounds(assets.map((asset) => [asset.lat, asset.lng] as [number, number]))
    map.fitBounds(bounds.pad(0.18), { animate: true })
    // Só reenquadra quando o usuário pede (fitToken), não a cada update de assets
  }, [fitToken, map]) // eslint-disable-line react-hooks/exhaustive-deps -- assets no momento do fit

  useEffect(() => {
    if (!flyTo) return
    map.flyTo([flyTo.lat, flyTo.lng], 16, { duration: 0.8 })
  }, [flyTo, map])

  useEffect(() => {
    if (locateToken === 0) return
    if (!navigator.geolocation) {
      onLocateError('Geolocalização não disponível neste navegador')
      return
    }

    onLocateError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.flyTo([position.coords.latitude, position.coords.longitude], 15, {
          duration: 0.8,
        })
      },
      () => onLocateError('Não foi possível obter sua localização'),
      { enableHighAccuracy: true, timeout: 10_000 },
    )
  }, [locateToken, map, onLocateError])

  return null
}

interface NetworkMapProps {
  assets: MapAsset[]
  fitToken: number
  flyTo: MapAsset | null
  locateToken: number
  onLocateError: (message: string | null) => void
}

export function NetworkMap({
  assets,
  fitToken,
  flyTo,
  locateToken,
  onLocateError,
}: NetworkMapProps) {
  return (
    <MapContainer
      center={MAP_DEFAULT_CENTER}
      zoom={MAP_DEFAULT_ZOOM}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TILE_URL} />
      <ZoomControl position="bottomright" />
      <MapController
        fitToken={fitToken}
        flyTo={flyTo}
        locateToken={locateToken}
        assets={assets}
        onLocateError={onLocateError}
      />
      {assets.map((asset) => (
        <AssetMarker key={`${asset.type}-${asset.id}`} asset={asset} />
      ))}
    </MapContainer>
  )
}
