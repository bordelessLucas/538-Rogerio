import type { IMetricsRepository } from '@/features/dashboard/domain/IMetricsRepository'
import { firestoreMetricsRepository } from '@/features/dashboard/infra/firestoreMetricsRepository'
import { seedMetrics } from '@/infra/firebase/seedData'
import type { NetworkEvent, NocMetrics } from '@/shared/types/network'

/** Fonte injetável — troca SNMP/API sem tocar na UI. */
let metricsRepository: IMetricsRepository = firestoreMetricsRepository

export function setMetricsRepository(repository: IMetricsRepository) {
  metricsRepository = repository
}

export function subscribeNocMetrics(
  onData: (metrics: NocMetrics | null) => void,
  onError: (error: Error) => void,
) {
  return metricsRepository.subscribeNocMetrics(onData, onError)
}

export function subscribeRecentEvents(
  limitCount: number,
  onData: (events: NetworkEvent[]) => void,
  onError: (error: Error) => void,
) {
  return metricsRepository.subscribeRecentEvents(limitCount, onData, onError)
}

/** Reseta `metrics/noc` com valores realistas da demo (Dia 02). */
export async function resetDashboardMetrics(): Promise<NocMetrics> {
  const metrics: NocMetrics = {
    ...seedMetrics,
    updatedAt: new Date().toISOString(),
  }
  await metricsRepository.upsertNocMetrics(metrics)
  return metrics
}
