import type { AssetStatus, OltVendor } from '@/shared/types/network'

export type MapAssetType = 'client' | 'cto' | 'olt' | 'pop'

export interface MapAssetBase {
  id: string
  type: MapAssetType
  name: string
  status: AssetStatus
  lat: number
  lng: number
}

export type MapClientAsset = MapAssetBase & {
  type: 'client'
  plan: string
  powerDbm: number
}

export type MapCtoAsset = MapAssetBase & {
  type: 'cto'
  freePorts: number
  occupiedPorts: number
  capacity: number
}

export type MapOltAsset = MapAssetBase & {
  type: 'olt'
  vendor: OltVendor
}

export type MapPopAsset = MapAssetBase & {
  type: 'pop'
  address: string
}

export type MapAsset = MapClientAsset | MapCtoAsset | MapOltAsset | MapPopAsset

export interface MapAssetsSnapshot {
  clients: MapClientAsset[]
  ctos: MapCtoAsset[]
  olts: MapOltAsset[]
  pops: MapPopAsset[]
}

export interface MapTypeFilter {
  client: boolean
  cto: boolean
  olt: boolean
  pop: boolean
}

export interface MapStatusFilter {
  online: boolean
  alert: boolean
  offline: boolean
  disabled: boolean
}

/** Camadas futuras — UI desabilitada no protótipo */
export const FUTURE_MAP_LAYERS = [
  'Postes',
  'Splitters',
  'Cabo',
  'Backbone',
  'Fibras',
  'DIO',
  'Caixas subterrâneas',
  'Empresas',
] as const
