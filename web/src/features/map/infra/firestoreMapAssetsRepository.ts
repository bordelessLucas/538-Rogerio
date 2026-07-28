import { collection, onSnapshot } from 'firebase/firestore'
import type { IMapAssetsRepository } from '@/features/map/domain/IMapAssetsRepository'
import type {
  MapAssetsSnapshot,
  MapClientAsset,
  MapCtoAsset,
  MapOltAsset,
  MapPopAsset,
} from '@/features/map/domain/mapTypes'
import { db } from '@/infra/firebase'
import {
  COLLECTIONS,
  type AssetStatus,
  type Client,
  type Cto,
  type Olt,
  type Pop,
} from '@/shared/types/network'

function hasValidCoords(lat: unknown, lng: unknown): lat is number {
  return typeof lat === 'number' && typeof lng === 'number' && Number.isFinite(lat) && Number.isFinite(lng)
}

function toStatus(value: unknown): AssetStatus {
  if (value === 'online' || value === 'alert' || value === 'offline' || value === 'disabled') {
    return value
  }
  return 'disabled'
}

function emptySnapshot(): MapAssetsSnapshot {
  return { clients: [], ctos: [], olts: [], pops: [] }
}

export const firestoreMapAssetsRepository: IMapAssetsRepository = {
  subscribeAssets(onData, onError) {
    const state: MapAssetsSnapshot = emptySnapshot()
    let errorReported = false

    const emit = () => onData({ ...state })

    const handleError = (error: Error) => {
      if (errorReported) return
      errorReported = true
      onError(error)
    }

    const unsubClients = onSnapshot(
      collection(db, COLLECTIONS.clients),
      (snap) => {
        state.clients = snap.docs
          .map((entry) => {
            const data = entry.data() as Omit<Client, 'id'>
            if (!hasValidCoords(data.lat, data.lng)) return null
            const asset: MapClientAsset = {
              id: entry.id,
              type: 'client',
              name: data.name,
              status: toStatus(data.status),
              lat: data.lat,
              lng: data.lng,
              plan: data.plan,
              powerDbm: data.powerDbm,
            }
            return asset
          })
          .filter((item): item is MapClientAsset => item !== null)
        emit()
      },
      handleError,
    )

    const unsubCtos = onSnapshot(
      collection(db, COLLECTIONS.ctos),
      (snap) => {
        state.ctos = snap.docs
          .map((entry) => {
            const data = entry.data() as Omit<Cto, 'id'>
            if (!hasValidCoords(data.lat, data.lng)) return null
            const asset: MapCtoAsset = {
              id: entry.id,
              type: 'cto',
              name: data.name,
              status: toStatus(data.status),
              lat: data.lat,
              lng: data.lng,
              freePorts: data.freePorts,
              occupiedPorts: data.occupiedPorts,
              capacity: data.capacity,
            }
            return asset
          })
          .filter((item): item is MapCtoAsset => item !== null)
        emit()
      },
      handleError,
    )

    const unsubOlts = onSnapshot(
      collection(db, COLLECTIONS.olts),
      (snap) => {
        state.olts = snap.docs
          .map((entry) => {
            const data = entry.data() as Omit<Olt, 'id'>
            if (!hasValidCoords(data.lat, data.lng)) return null
            const asset: MapOltAsset = {
              id: entry.id,
              type: 'olt',
              name: data.name,
              status: toStatus(data.status),
              lat: data.lat,
              lng: data.lng,
              vendor: data.vendor,
            }
            return asset
          })
          .filter((item): item is MapOltAsset => item !== null)
        emit()
      },
      handleError,
    )

    const unsubPops = onSnapshot(
      collection(db, COLLECTIONS.pops),
      (snap) => {
        state.pops = snap.docs
          .map((entry) => {
            const data = entry.data() as Omit<Pop, 'id'>
            if (!hasValidCoords(data.lat, data.lng)) return null
            const asset: MapPopAsset = {
              id: entry.id,
              type: 'pop',
              name: data.name,
              status: toStatus(data.status),
              lat: data.lat,
              lng: data.lng,
              address: data.address,
            }
            return asset
          })
          .filter((item): item is MapPopAsset => item !== null)
        emit()
      },
      handleError,
    )

    return () => {
      unsubClients()
      unsubCtos()
      unsubOlts()
      unsubPops()
    }
  },
}
