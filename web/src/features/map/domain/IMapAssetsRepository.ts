import type { MapAssetsSnapshot } from '@/features/map/domain/mapTypes'

/**
 * Abstração da fonte de ativos georreferenciados.
 * Hoje: Firestore collections (clients, ctos, olts, pops).
 * Amanhã: API/GeoJSON — basta trocar a implementação.
 */
export interface IMapAssetsRepository {
  subscribeAssets(
    onData: (snapshot: MapAssetsSnapshot) => void,
    onError: (error: Error) => void,
  ): () => void
}
