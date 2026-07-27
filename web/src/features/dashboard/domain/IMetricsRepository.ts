import type { NetworkEvent, NocMetrics } from '@/shared/types/network'

/**
 * Abstração da fonte de métricas NOC.
 * Hoje: Firestore (`metrics/noc` + `events`).
 * Amanhã: SNMP/API — basta trocar a implementação do repositório.
 */
export interface IMetricsRepository {
  subscribeNocMetrics(
    onData: (metrics: NocMetrics | null) => void,
    onError: (error: Error) => void,
  ): () => void

  subscribeRecentEvents(
    limitCount: number,
    onData: (events: NetworkEvent[]) => void,
    onError: (error: Error) => void,
  ): () => void

  upsertNocMetrics(metrics: NocMetrics): Promise<void>
}
