/**
 * Contratos de integração futura (Dia 06).
 * Não há implementação SNMP/RADIUS real neste protótipo — só a “tomada”.
 *
 * Fluxo alvo:
 * Collector/Adapter → evento normalizado (NetworkEvent) → Firestore `events`
 * → Dashboard / Monitoramento / Mapa consomem o mesmo domínio.
 */

import type { NetworkEvent } from '@/shared/types/network'

/** Telemetria bruta SNMP (OIDs) antes da normalização. */
export interface SnmpSample {
  targetIp: string
  oid: string
  value: string | number
  collectedAt: string
}

export interface ISnmpCollector {
  /** Poll periódico de um alvo (OLT/ONU). */
  poll(targetIp: string, oids: string[]): Promise<SnmpSample[]>
}

export type OltVendorCode = 'ZTE' | 'Huawei' | 'Fiberhome' | 'Nokia' | 'Datacom' | 'Other'

/** Adapter por fabricante — traduz SNMP/API proprietária em eventos de domínio. */
export interface IOltVendorAdapter {
  vendor: OltVendorCode
  fetchOnuStatuses(oltId: string): Promise<Array<Partial<NetworkEvent>>>
}

/** Sessões PPPoE / autenticidade via RADIUS AAA. */
export interface IRadiusAdapter {
  listActiveSessions(): Promise<Array<{ username: string; ip: string; mac?: string }>>
  isSessionOnline(username: string): Promise<boolean>
}

export type NotificationPayload = {
  title: string
  body: string
  severity: NetworkEvent['severity']
  eventId?: string
}

export interface INotificationChannel {
  channel: 'telegram' | 'whatsapp' | 'email'
  send(payload: NotificationPayload): Promise<void>
}
