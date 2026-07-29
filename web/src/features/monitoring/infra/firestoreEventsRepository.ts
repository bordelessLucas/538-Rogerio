import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import type { IEventsRepository } from '@/features/monitoring/domain/IEventsRepository'
import { db } from '@/infra/firebase'
import { COLLECTIONS, type NetworkEvent } from '@/shared/types/network'

export const firestoreEventsRepository: IEventsRepository = {
  subscribeEvents(onData, onError) {
    return onSnapshot(
      collection(db, COLLECTIONS.events),
      (snap) => {
        const events = snap.docs
          .map((entry) => ({
            id: entry.id,
            ...(entry.data() as Omit<NetworkEvent, 'id'>),
          }))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
        onData(events)
      },
      (error) => onError(error),
    )
  },

  async acknowledgeEvent(id) {
    await updateDoc(doc(db, COLLECTIONS.events, id), { acknowledged: true })
  },

  async createEvent(event) {
    const ref = doc(collection(db, COLLECTIONS.events))
    await setDoc(ref, event)
    return ref.id
  },
}
