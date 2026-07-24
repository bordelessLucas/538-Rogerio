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

export async function isSeedApplied(): Promise<boolean> {
  const snap = await getDocs(query(collection(db, COLLECTIONS.olts), limit(1)))
  return !snap.empty
}

export async function applyNetworkSeed(): Promise<{ message: string }> {
  const already = await isSeedApplied()
  if (already) {
    return { message: 'Seed já aplicado (OLTs encontradas).' }
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

  batch.set(doc(db, COLLECTIONS.metrics, 'noc'), seedMetrics)
  await batch.commit()

  return {
    message: `Seed aplicado: ${popIds.length} POPs, ${oltIds.length} OLTs, ${ponIds.length} PONs, ${ctoIds.length} CTOs, ${clientIds.length} clientes.`,
  }
}
