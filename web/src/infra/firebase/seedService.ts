import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/infra/firebase/client'
import {
  seedClients,
  seedCtos,
  seedEvents,
  seedMetrics,
  seedOlts,
  seedPons,
  seedPops,
  seedTickets,
} from '@/infra/firebase/seedData'
import { COLLECTIONS } from '@/shared/types/network'

const NETWORK_COLLECTIONS = [
  COLLECTIONS.pops,
  COLLECTIONS.olts,
  COLLECTIONS.pons,
  COLLECTIONS.ctos,
  COLLECTIONS.clients,
  COLLECTIONS.events,
  COLLECTIONS.tickets,
] as const

export async function isSeedApplied(): Promise<boolean> {
  const snap = await getDocs(query(collection(db, COLLECTIONS.olts), limit(1)))
  return !snap.empty
}

async function clearCollection(name: string) {
  const snap = await getDocs(collection(db, name))
  const chunks: Array<typeof snap.docs> = []
  for (let i = 0; i < snap.docs.length; i += 400) {
    chunks.push(snap.docs.slice(i, i + 400))
  }
  for (const chunk of chunks) {
    const batch = writeBatch(db)
    chunk.forEach((entry) => batch.delete(entry.ref))
    await batch.commit()
  }
}

async function clearNetworkSeed() {
  for (const name of NETWORK_COLLECTIONS) {
    await clearCollection(name)
  }
}

export async function applyNetworkSeed(options?: {
  force?: boolean
}): Promise<{ message: string }> {
  const already = await isSeedApplied()
  if (already && !options?.force) {
    return {
      message:
        'Seed já aplicado. Use “Aplicar seed Firebase” como admin com force no dashboard para regenerar.',
    }
  }

  if (already && options?.force) {
    await clearNetworkSeed()
  }

  const popIds: string[] = []
  for (const pop of seedPops) {
    const ref = doc(collection(db, COLLECTIONS.pops))
    await setDoc(ref, pop)
    popIds.push(ref.id)
  }

  const oltIds: string[] = []
  for (const olt of seedOlts) {
    const { popIndex, ...data } = olt
    const ref = doc(collection(db, COLLECTIONS.olts))
    await setDoc(ref, { ...data, popId: popIds[popIndex] })
    oltIds.push(ref.id)
  }

  const ponIds: string[] = []
  for (const pon of seedPons) {
    const { oltIndex, ...data } = pon
    const ref = doc(collection(db, COLLECTIONS.pons))
    await setDoc(ref, { ...data, oltId: oltIds[oltIndex] })
    ponIds.push(ref.id)
  }

  const ctoIds: string[] = []
  for (const cto of seedCtos) {
    const { oltIndex, ponIndex, ...data } = cto
    const ref = doc(collection(db, COLLECTIONS.ctos))
    await setDoc(ref, {
      ...data,
      oltId: oltIds[oltIndex],
      ponId: ponIds[ponIndex],
    })
    ctoIds.push(ref.id)
  }

  const clientIds: string[] = []
  for (const client of seedClients) {
    const { ctoIndex, ...data } = client
    const cto = seedCtos[ctoIndex]
    const ref = doc(collection(db, COLLECTIONS.clients))
    await setDoc(ref, {
      ...data,
      ctoId: ctoIds[ctoIndex],
      oltId: oltIds[cto.oltIndex],
      ponId: ponIds[cto.ponIndex],
    })
    clientIds.push(ref.id)
  }

  const batch = writeBatch(db)

  seedEvents.forEach((event, index) => {
    const ref = doc(collection(db, COLLECTIONS.events))
    const assetId =
      event.assetType === 'client'
        ? clientIds[Math.min(index, clientIds.length - 1)]
        : ctoIds[Math.min(index, ctoIds.length - 1)]
    batch.set(ref, { ...event, assetId })
  })

  seedTickets.forEach((ticket, index) => {
    const ref = doc(collection(db, COLLECTIONS.tickets))
    batch.set(ref, {
      ...ticket,
      clientId: clientIds[Math.min(index, clientIds.length - 1)],
    })
  })

  batch.set(doc(db, COLLECTIONS.metrics, 'noc'), {
    ...seedMetrics,
    updatedAt: new Date().toISOString(),
  })
  await batch.commit()

  return {
    message: `Seed aplicado: ${popIds.length} POPs, ${oltIds.length} OLTs, ${ponIds.length} PONs, ${ctoIds.length} CTOs, ${clientIds.length} clientes.`,
  }
}
