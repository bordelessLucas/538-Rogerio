import { doc, getDocs, collection, updateDoc } from 'firebase/firestore'
import { firestoreEventsRepository } from '@/features/monitoring/infra/firestoreEventsRepository'
import type { IEventsRepository } from '@/features/monitoring/domain/IEventsRepository'
import type { NewNetworkEvent } from '@/features/monitoring/domain/types'
import { db } from '@/infra/firebase'
import {
  COLLECTIONS,
  type AssetStatus,
  type Client,
  type Cto,
  type EventType,
  type NetworkEvent,
} from '@/shared/types/network'

let eventsRepository: IEventsRepository = firestoreEventsRepository

export function setEventsRepository(repository: IEventsRepository) {
  eventsRepository = repository
}

export function subscribeMonitoringEvents(
  onData: (events: NetworkEvent[]) => void,
  onError: (error: Error) => void,
) {
  return eventsRepository.subscribeEvents(onData, onError)
}

export async function acknowledgeEvent(id: string) {
  await eventsRepository.acknowledgeEvent(id)
}

export async function createMonitoringEvent(event: NewNetworkEvent) {
  return eventsRepository.createEvent(event)
}

async function applyAssetSideEffects(event: NewNetworkEvent) {
  if (event.assetType === 'client') {
    let status: AssetStatus | null = null
    if (event.type === 'client_offline') status = 'offline'
    if (event.type === 'client_online') status = 'online'
    if (event.type === 'power_alert') status = 'alert'
    if (status) {
      await updateDoc(doc(db, COLLECTIONS.clients, event.assetId), { status })
    }
  }

  if (event.assetType === 'cto' && event.type === 'signal_oscillation') {
    await updateDoc(doc(db, COLLECTIONS.ctos, event.assetId), { status: 'alert' })
  }
}

export async function publishMonitoringEvent(event: NewNetworkEvent) {
  const id = await createMonitoringEvent(event)
  await applyAssetSideEffects(event)
  return id
}

type SimulatableType = Extract<
  EventType,
  'client_offline' | 'signal_oscillation' | 'power_alert' | 'client_online'
>

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export async function simulateRandomOperationalEvent(): Promise<NetworkEvent> {
  const [clientsSnap, ctosSnap] = await Promise.all([
    getDocs(collection(db, COLLECTIONS.clients)),
    getDocs(collection(db, COLLECTIONS.ctos)),
  ])

  const clients = clientsSnap.docs.map((entry) => ({
    id: entry.id,
    ...(entry.data() as Omit<Client, 'id'>),
  }))
  const ctos = ctosSnap.docs.map((entry) => ({
    id: entry.id,
    ...(entry.data() as Omit<Cto, 'id'>),
  }))

  if (clients.length === 0) {
    throw new Error('Nenhum cliente no Firestore. Aplique o seed no Dashboard.')
  }

  const type = pick<SimulatableType>([
    'client_offline',
    'signal_oscillation',
    'power_alert',
    'client_online',
  ])

  let payload: NewNetworkEvent

  if (type === 'signal_oscillation' && ctos.length > 0) {
    const cto = pick(ctos)
    payload = {
      type,
      severity: 'warning',
      title: 'Oscilação de sinal',
      description: `Variação óptica detectada na ${cto.name}`,
      assetType: 'cto',
      assetId: cto.id,
      assetName: cto.name,
      createdAt: new Date().toISOString(),
      acknowledged: false,
    }
  } else if (type === 'client_offline') {
    const client = pick(clients)
    payload = {
      type,
      severity: 'critical',
      title: 'Cliente Offline',
      description: `${client.name} sem sessão PPPoE`,
      assetType: 'client',
      assetId: client.id,
      assetName: client.name,
      createdAt: new Date().toISOString(),
      acknowledged: false,
    }
  } else if (type === 'power_alert') {
    const client = pick(clients)
    payload = {
      type,
      severity: 'warning',
      title: 'Alerta de potência',
      description: `${client.name} com sinal abaixo de -26 dBm`,
      assetType: 'client',
      assetId: client.id,
      assetName: client.name,
      createdAt: new Date().toISOString(),
      acknowledged: false,
    }
  } else {
    const client = pick(clients)
    payload = {
      type: 'client_online',
      severity: 'info',
      title: 'Cliente Online',
      description: `${client.name} restabeleceu sessão`,
      assetType: 'client',
      assetId: client.id,
      assetName: client.name,
      createdAt: new Date().toISOString(),
      acknowledged: false,
    }
  }

  const id = await publishMonitoringEvent(payload)
  return { id, ...payload }
}
