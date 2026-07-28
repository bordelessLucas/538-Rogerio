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
