import { useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_MONITORING_FILTERS,
  type MonitoringFilters,
} from '@/features/monitoring/domain/types'
import { subscribeMonitoringEvents } from '@/features/monitoring/services/monitoringService'
import {
  buildMonitoringSummary,
  filterMonitoringEvents,
} from '@/features/monitoring/utils/monitoringFilters'
import { useClients } from '@/features/network/hooks/useNetworkCollections'
import type { NetworkEvent } from '@/shared/types/network'

export function useMonitoringFeed(initial?: Partial<MonitoringFilters>) {
  const [events, setEvents] = useState<NetworkEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<MonitoringFilters>({
    ...DEFAULT_MONITORING_FILTERS,
    ...initial,
  })
  const { items: clients } = useClients()

  useEffect(() => {
    const unsubscribe = subscribeMonitoringEvents(
      (next) => {
        setEvents(next)
        setError(null)
        setIsLoading(false)
      },
      (err) => {
        setError(err)
        setIsLoading(false)
      },
    )
    return unsubscribe
  }, [])

  const filtered = useMemo(
    () => filterMonitoringEvents(events, filters, clients),
    [events, filters, clients],
  )

  const summary = useMemo(
    () => buildMonitoringSummary(events, clients),
    [events, clients],
  )

  return {
    events,
    filtered,
    summary,
    filters,
    setFilters,
    isLoading,
    error,
    liveCount: events.length,
  }
}
