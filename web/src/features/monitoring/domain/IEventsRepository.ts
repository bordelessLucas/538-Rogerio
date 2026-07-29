import type { NetworkEvent } from '@/shared/types/network'
import type { NewNetworkEvent } from '@/features/monitoring/domain/types'

export interface IEventsRepository {
  subscribeEvents(
    onData: (events: NetworkEvent[]) => void,
    onError: (error: Error) => void,
  ): () => void

  acknowledgeEvent(id: string): Promise<void>

  createEvent(event: NewNetworkEvent): Promise<string>
}
