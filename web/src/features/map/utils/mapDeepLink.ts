import type { MapAssetType } from '@/features/map/domain/mapTypes'

const VALID_TYPES: MapAssetType[] = ['client', 'cto', 'olt', 'pop']

export function buildMapDeepLink(type: MapAssetType, id: string): string {
  const params = new URLSearchParams({ type, id })
  return `/mapa?${params.toString()}`
}

export function parseMapDeepLink(
  searchParams: URLSearchParams,
): { type: MapAssetType; id: string } | null {
  const type = searchParams.get('type')
  const id = searchParams.get('id')?.trim()
  if (!type || !id) return null
  if (!VALID_TYPES.includes(type as MapAssetType)) return null
  return { type: type as MapAssetType, id }
}
