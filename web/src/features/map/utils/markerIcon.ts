import L from 'leaflet'
import { STATUS_HEX, TYPE_LABEL } from '@/features/map/constants'
import type { MapAsset, MapAssetType } from '@/features/map/domain/mapTypes'
import type { AssetStatus } from '@/shared/types/network'

const SHAPE: Record<MapAssetType, string> = {
  client: 'border-radius:4px;',
  cto: 'border-radius:50%;',
  olt: 'border-radius:2px; transform:rotate(45deg);',
  pop: 'border-radius:3px; width:16px; height:16px;',
}

export function createAssetIcon(type: MapAssetType, status: AssetStatus): L.DivIcon {
  const color = STATUS_HEX[status]
  const size = type === 'pop' ? 16 : type === 'olt' ? 14 : 12

  return L.divIcon({
    className: 'r20-map-marker',
    html: `<div style="
      width:${size}px;
      height:${size}px;
      background:${color};
      border:2px solid #0b1220;
      box-shadow:0 0 0 1px ${color}66, 0 2px 6px rgba(0,0,0,.45);
      ${SHAPE[type]}
    " title="${TYPE_LABEL[type]}"></div>`,
    iconSize: [size + 4, size + 4],
    iconAnchor: [Math.floor((size + 4) / 2), Math.floor((size + 4) / 2)],
    popupAnchor: [0, -Math.floor((size + 4) / 2)],
  })
}

export function assetDetailPath(asset: MapAsset): string {
  switch (asset.type) {
    case 'client':
      return `/rede/clientes`
    case 'cto':
      return `/rede/ctos`
    case 'olt':
      return `/rede/olts`
    case 'pop':
      return `/rede`
  }
}
