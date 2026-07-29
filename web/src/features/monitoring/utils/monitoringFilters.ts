import type {
  EventPeriod,
  MonitoringFilters,
  MonitoringSummary,
} from '@/features/monitoring/domain/types'
import type { Client, NetworkEvent } from '@/shared/types/network'

function periodMs(period: EventPeriod): number | null {
  if (period === '1h') return 60 * 60 * 1000
  if (period === '24h') return 24 * 60 * 60 * 1000
  if (period === '7d') return 7 * 24 * 60 * 60 * 1000
  return null
}

export function filterMonitoringEvents(
  events: NetworkEvent[],
  filters: MonitoringFilters,
  clients: Client[],
): NetworkEvent[] {
  const now = Date.now()
  const windowMs = periodMs(filters.period)
  const clientIdsOnCto =
    filters.ctoId === null
      ? null
      : new Set(
          clients.filter((client) => client.ctoId === filters.ctoId).map((c) => c.id),
        )

  return events.filter((event) => {
    if (windowMs !== null) {
      const age = now - new Date(event.createdAt).getTime()
      if (Number.isNaN(age) || age > windowMs) return false
    }

    if (filters.type !== 'all' && event.type !== filters.type) return false
    if (filters.severity !== 'all' && event.severity !== filters.severity) return false
    if (filters.onlyUnacknowledged && event.acknowledged) return false

    if (filters.clientId) {
      if (!(event.assetType === 'client' && event.assetId === filters.clientId)) {
        return false
      }
    }

    if (filters.ctoId && clientIdsOnCto) {
      const matchesCto =
        (event.assetType === 'cto' && event.assetId === filters.ctoId) ||
        (event.assetType === 'client' && clientIdsOnCto.has(event.assetId))
      if (!matchesCto) return false
    }

    const search = filters.search.trim().toLowerCase()
    if (search) {
      const haystack = `${event.assetName} ${event.title} ${event.description}`.toLowerCase()
      if (!haystack.includes(search)) return false
    }

    return true
  })
}

export function buildMonitoringSummary(
  events: NetworkEvent[],
  clients: Client[],
): MonitoringSummary {
  const hourAgo = Date.now() - 60 * 60 * 1000

  return {
    offlineNow: clients.filter((client) => client.status === 'offline').length,
    powerAlerts: events.filter((event) => event.type === 'power_alert' && !event.acknowledged)
      .length,
    oscillationsLastHour: events.filter(
      (event) =>
        event.type === 'signal_oscillation' &&
        new Date(event.createdAt).getTime() >= hourAgo,
    ).length,
    criticalUnacked: events.filter(
      (event) => event.severity === 'critical' && !event.acknowledged,
    ).length,
  }
}

export function eventAssetPath(event: NetworkEvent): string | null {
  if (event.assetType === 'client') return `/rede/clientes/${event.assetId}`
  if (event.assetType === 'cto') return `/rede/ctos/${event.assetId}`
  if (event.assetType === 'olt') return `/rede/olts`
  if (event.assetType === 'pon') return `/rede/pons`
  return null
}
