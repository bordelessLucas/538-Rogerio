import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import type { INetworkRepository } from '@/features/network/domain/INetworkRepository'
import { deriveCtoPorts } from '@/features/network/domain/schemas'
import type { ClientFormValues } from '@/features/network/domain/schemas'
import { db } from '@/infra/firebase'
import {
  COLLECTIONS,
  type Client,
  type Cto,
  type NetworkEvent,
  type Olt,
  type Pon,
  type Pop,
} from '@/shared/types/network'

function mapDocs<T extends { id: string }>(
  docs: Array<{ id: string; data: () => Record<string, unknown> }>,
): T[] {
  return docs.map((entry) => ({ id: entry.id, ...entry.data() }) as T)
}

async function countByField(collectionName: string, field: string, value: string) {
  const snap = await getDocs(query(collection(db, collectionName), where(field, '==', value)))
  return snap.size
}

async function withCtoInheritance(values: ClientFormValues) {
  const ctoSnap = await getDoc(doc(db, COLLECTIONS.ctos, values.ctoId))
  if (!ctoSnap.exists()) {
    throw new Error('CTO selecionada não encontrada')
  }
  const cto = ctoSnap.data() as Omit<Cto, 'id'>
  return {
    ...values,
    oltId: cto.oltId,
    ponId: cto.ponId,
  }
}

/** Garante que a PON pertence à OLT — regra de domínio, não só UI. */
async function assertPonBelongsToOlt(oltId: string, ponId: string) {
  const ponSnap = await getDoc(doc(db, COLLECTIONS.pons, ponId))
  if (!ponSnap.exists()) {
    throw new Error('PON selecionada não encontrada')
  }
  const pon = ponSnap.data() as Omit<Pon, 'id'>
  if (pon.oltId !== oltId) {
    throw new Error('A PON selecionada não pertence à OLT informada')
  }
}

export const firestoreNetworkRepository: INetworkRepository = {
  subscribePops(onData, onError) {
    return onSnapshot(
      collection(db, COLLECTIONS.pops),
      (snap) => onData(mapDocs<Pop>(snap.docs)),
      (error) => onError(error),
    )
  },

  subscribeOlts(onData, onError) {
    return onSnapshot(
      collection(db, COLLECTIONS.olts),
      (snap) => onData(mapDocs<Olt>(snap.docs)),
      (error) => onError(error),
    )
  },

  subscribePons(onData, onError) {
    return onSnapshot(
      collection(db, COLLECTIONS.pons),
      (snap) => onData(mapDocs<Pon>(snap.docs)),
      (error) => onError(error),
    )
  },

  subscribeCtos(onData, onError) {
    return onSnapshot(
      collection(db, COLLECTIONS.ctos),
      (snap) => onData(mapDocs<Cto>(snap.docs)),
      (error) => onError(error),
    )
  },

  subscribeClients(onData, onError) {
    return onSnapshot(
      collection(db, COLLECTIONS.clients),
      (snap) => onData(mapDocs<Client>(snap.docs)),
      (error) => onError(error),
    )
  },

  subscribeCto(id, onData, onError) {
    return onSnapshot(
      doc(db, COLLECTIONS.ctos, id),
      (snap) => {
        if (!snap.exists()) {
          onData(null)
          return
        }
        onData({ id: snap.id, ...(snap.data() as Omit<Cto, 'id'>) })
      },
      (error) => onError(error),
    )
  },

  subscribeClient(id, onData, onError) {
    return onSnapshot(
      doc(db, COLLECTIONS.clients, id),
      (snap) => {
        if (!snap.exists()) {
          onData(null)
          return
        }
        onData({ id: snap.id, ...(snap.data() as Omit<Client, 'id'>) })
      },
      (error) => onError(error),
    )
  },

  subscribeAssetEvents(assetId, onData, onError) {
    const eventsQuery = query(
      collection(db, COLLECTIONS.events),
      where('assetId', '==', assetId),
    )
    return onSnapshot(
      eventsQuery,
      (snap) => {
        const events = mapDocs<NetworkEvent>(snap.docs).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        onData(events.slice(0, 8))
      },
      (error) => onError(error),
    )
  },

  async createOlt(values) {
    const ref = doc(collection(db, COLLECTIONS.olts))
    await setDoc(ref, { ...values, createdAt: new Date().toISOString() })
    return ref.id
  },

  async updateOlt(id, values) {
    await updateDoc(doc(db, COLLECTIONS.olts, id), values)
  },

  async deleteOlt(id) {
    const [pons, ctos] = await Promise.all([
      countByField(COLLECTIONS.pons, 'oltId', id),
      countByField(COLLECTIONS.ctos, 'oltId', id),
    ])
    if (pons > 0 || ctos > 0) {
      throw new Error(
        `Não é possível excluir: há ${pons} PON(s) e ${ctos} CTO(s) vinculadas a esta OLT.`,
      )
    }
    await deleteDoc(doc(db, COLLECTIONS.olts, id))
  },

  async createPon(values) {
    const ref = doc(collection(db, COLLECTIONS.pons))
    await setDoc(ref, { ...values, createdAt: new Date().toISOString() })
    return ref.id
  },

  async updatePon(id, values) {
    await updateDoc(doc(db, COLLECTIONS.pons, id), values)
  },

  async deletePon(id) {
    const ctos = await countByField(COLLECTIONS.ctos, 'ponId', id)
    if (ctos > 0) {
      throw new Error(`Não é possível excluir: há ${ctos} CTO(s) vinculadas a esta PON.`)
    }
    await deleteDoc(doc(db, COLLECTIONS.pons, id))
  },

  async createCto(values) {
    await assertPonBelongsToOlt(values.oltId, values.ponId)
    const ports = deriveCtoPorts(values.capacity, values.occupiedPorts)
    const ref = doc(collection(db, COLLECTIONS.ctos))
    await setDoc(ref, {
      ...values,
      ...ports,
      createdAt: new Date().toISOString(),
    })
    return ref.id
  },

  async updateCto(id, values) {
    await assertPonBelongsToOlt(values.oltId, values.ponId)
    const ports = deriveCtoPorts(values.capacity, values.occupiedPorts)
    await updateDoc(doc(db, COLLECTIONS.ctos, id), { ...values, ...ports })
  },

  async deleteCto(id) {
    const clients = await countByField(COLLECTIONS.clients, 'ctoId', id)
    if (clients > 0) {
      throw new Error(`Não é possível excluir: há ${clients} cliente(s) nesta CTO.`)
    }
    await deleteDoc(doc(db, COLLECTIONS.ctos, id))
  },

  async createClient(values) {
    const payload = await withCtoInheritance(values)
    const ref = doc(collection(db, COLLECTIONS.clients))
    await setDoc(ref, { ...payload, createdAt: new Date().toISOString() })
    return ref.id
  },

  async updateClient(id, values) {
    const payload = await withCtoInheritance(values)
    await updateDoc(doc(db, COLLECTIONS.clients, id), payload)
  },

  async deleteClient(id) {
    await deleteDoc(doc(db, COLLECTIONS.clients, id))
  },
}
