import type { EventSeverity, EventType, NetworkEvent } from '@/shared/types/network'

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  client_offline: 'Cliente Offline',
  signal_oscillation: 'Oscilação de sinal',
  power_alert: 'Alerta de potência',
  client_online: 'Cliente Online',
  onu_reboot: 'ONU reiniciada',
}

export const EVENT_SEVERITY_LABEL: Record<EventSeverity, string> = {
  info: 'Info',
  warning: 'Warning',
  critical: 'Critical',
}

export type EventPeriod = '1h' | '24h' | '7d' | 'all'

export interface MonitoringFilters {
  type: EventType | 'all'
  severity: EventSeverity | 'all'
  period: EventPeriod
  search: string
  /** Deep link do Dia 05 */
  ctoId: string | null
  clientId: string | null
  onlyUnacknowledged: boolean
}

export const DEFAULT_MONITORING_FILTERS: MonitoringFilters = {
  type: 'all',
  severity: 'all',
  period: '24h',
  search: '',
  ctoId: null,
  clientId: null,
  onlyUnacknowledged: false,
}

export interface MonitoringSummary {
  offlineNow: number
  powerAlerts: number
  oscillationsLastHour: number
  criticalUnacked: number
}

export type NewNetworkEvent = Omit<NetworkEvent, 'id'>
