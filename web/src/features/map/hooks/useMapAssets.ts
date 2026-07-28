import { useEffect, useState } from 'react'
import type { MapAsset, MapAssetsSnapshot } from '@/features/map/domain/mapTypes'
import { flattenMapAssets, subscribeMapAssets } from '@/features/map/services/mapService'

interface UseMapAssetsResult {
  snapshot: MapAssetsSnapshot
  assets: MapAsset[]
  isLoading: boolean
  error: Error | null
}

const EMPTY: MapAssetsSnapshot = { clients: [], ctos: [], olts: [], pops: [] }

export function useMapAssets(): UseMapAssetsResult {
  const [snapshot, setSnapshot] = useState<MapAssetsSnapshot>(EMPTY)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeMapAssets(
      (next) => {
        setSnapshot(next)
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

  return {
    snapshot,
    assets: flattenMapAssets(snapshot),
    isLoading,
    error,
  }
}
