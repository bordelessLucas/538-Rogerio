import { firestoreMapAssetsRepository } from '@/features/map/infra/firestoreMapAssetsRepository'
import type { IMapAssetsRepository } from '@/features/map/domain/IMapAssetsRepository'
import type { MapAssetsSnapshot } from '@/features/map/domain/mapTypes'

const repository: IMapAssetsRepository = firestoreMapAssetsRepository

export function subscribeMapAssets(
  onData: (snapshot: MapAssetsSnapshot) => void,
  onError: (error: Error) => void,
): () => void {
  return repository.subscribeAssets(onData, onError)
}

export function flattenMapAssets(snapshot: MapAssetsSnapshot) {
  return [...snapshot.pops, ...snapshot.olts, ...snapshot.ctos, ...snapshot.clients]
}
