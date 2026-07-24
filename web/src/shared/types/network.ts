export type AssetStatus = 'online' | 'alert' | 'offline' | 'disabled'
export type UserRole = 'admin' | 'noc' | 'tecnico'

export type OltVendor =
  | 'ZTE'
  | 'Huawei'
  | 'Fiberhome'
  | 'Nokia'
  | 'Datacom'
  | 'Other'

export interface AppUser {
  uid: string
  email: string
  displayName: string
  role: UserRole
  createdAt: string
}

export interface Pop {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  status: AssetStatus
  createdAt: string
}

export interface Olt {
  id: string
  name: string
  vendor: OltVendor
  ip: string
  status: AssetStatus
  lat: number
  lng: number
  popId: string
  createdAt: string
}

export interface Pon {
  id: string
  name: string
  oltId: string
  port: number
  status: AssetStatus
  createdAt: string
}

export interface Cto {
  id: string
  name: string
  code: string
  oltId: string
  ponId: string
  capacity: number
  occupiedPorts: number
  freePorts: number
  splitter: string
  distanceMeters: number
  status: AssetStatus
  lat: number
  lng: number
  occupancyPercent: number
  createdAt: string
}

export interface Client {
  id: string
  name: string
  plan: string
  onuModel: string
  powerDbm: number
  lastAccessAt: string
  ip: string
  equipment: string
  mac: string
  serial: string
  status: AssetStatus
  ctoId: string
  oltId: string
  ponId: string
  lat: number
  lng: number
  createdAt: string
}

export type EventType =
  | 'client_offline'
  | 'signal_oscillation'
  | 'power_alert'
  | 'client_online'
  | 'onu_reboot'

export type EventSeverity = 'info' | 'warning' | 'critical'

export interface NetworkEvent {
  id: string
  type: EventType
  severity: EventSeverity
  title: string
  description: string
  assetType: 'client' | 'cto' | 'olt' | 'pon'
  assetId: string
  assetName: string
  createdAt: string
  acknowledged: boolean
}

export interface Ticket {
  id: string
  title: string
  status: 'open' | 'in_progress' | 'closed'
  clientId?: string
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

export interface NocMetrics {
  clientsOnline: number
  clientsOffline: number
  clientsBadSignal: number
  oltsCount: number
  ticketsOpen: number
  networkAvailabilityPercent: number
  updatedAt: string
}

export const COLLECTIONS = {
  users: 'users',
  pops: 'pops',
  olts: 'olts',
  pons: 'pons',
  ctos: 'ctos',
  clients: 'clients',
  events: 'events',
  tickets: 'tickets',
  metrics: 'metrics',
} as const
