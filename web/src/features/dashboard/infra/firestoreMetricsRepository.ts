import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import type { IMetricsRepository } from '@/features/dashboard/domain/IMetricsRepository'
import { db } from '@/infra/firebase'
import { COLLECTIONS, type NetworkEvent, type NocMetrics } from '@/shared/types/network'

function parseMetrics(data: Record<string, unknown> | undefined): NocMetrics | null {
  if (!data) return null

  return {
    clientsOnline: Number(data.clientsOnline ?? 0),
    clientsOffline: Number(data.clientsOffline ?? 0),
    clientsBadSignal: Number(data.clientsBadSignal ?? 0),
    oltsCount: Number(data.oltsCount ?? 0),
    ticketsOpen: Number(data.ticketsOpen ?? 0),
    networkAvailabilityPercent: Number(data.networkAvailabilityPercent ?? 0),
    fiberBreaks: Number(data.fiberBreaks ?? 0),
    ctosOvercapacity: Number(data.ctosOvercapacity ?? 0),
    pppoeActive: Number(data.pppoeActive ?? 0),
    activeAlarms: Number(data.activeAlarms ?? 0),
    slaPercentToday: Number(data.slaPercentToday ?? 0),
    updatedAt: String(data.updatedAt ?? new Date().toISOString()),
  }
}

export const firestoreMetricsRepository: IMetricsRepository = {
  subscribeNocMetrics(onData, onError) {
    const ref = doc(db, COLLECTIONS.metrics, 'noc')
    return onSnapshot(
      ref,
      (snap) => {
        onData(parseMetrics(snap.data() as Record<string, unknown> | undefined))
      },
      (error) => onError(error),
    )
  },

  subscribeRecentEvents(limitCount, onData, onError) {
    const eventsQuery = query(
      collection(db, COLLECTIONS.events),
      orderBy('createdAt', 'desc'),
      limit(limitCount),
    )

    return onSnapshot(
      eventsQuery,
      (snap) => {
        const events = snap.docs.map((entry) => ({
          id: entry.id,
          ...(entry.data() as Omit<NetworkEvent, 'id'>),
        }))
        onData(events)
      },
      (error) => onError(error),
    )
  },

  async upsertNocMetrics(metrics) {
    await setDoc(doc(db, COLLECTIONS.metrics, 'noc'), metrics, { merge: true })
  },
}
