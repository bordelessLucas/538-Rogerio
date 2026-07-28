import { firestoreNetworkRepository } from '@/features/network/infra/firestoreNetworkRepository'
import type { INetworkRepository } from '@/features/network/domain/INetworkRepository'
import type {
  ClientFormValues,
  CtoFormValues,
  OltFormValues,
  PonFormValues,
} from '@/features/network/domain/schemas'

const repository: INetworkRepository = firestoreNetworkRepository

export const subscribePops = repository.subscribePops.bind(repository)
export const subscribeOlts = repository.subscribeOlts.bind(repository)
export const subscribePons = repository.subscribePons.bind(repository)
export const subscribeCtos = repository.subscribeCtos.bind(repository)
export const subscribeClients = repository.subscribeClients.bind(repository)

export async function createOlt(values: OltFormValues) {
  return repository.createOlt(values)
}
export async function updateOlt(id: string, values: OltFormValues) {
  return repository.updateOlt(id, values)
}
export async function deleteOlt(id: string) {
  return repository.deleteOlt(id)
}

export async function createPon(values: PonFormValues) {
  return repository.createPon(values)
}
export async function updatePon(id: string, values: PonFormValues) {
  return repository.updatePon(id, values)
}
export async function deletePon(id: string) {
  return repository.deletePon(id)
}

export async function createCto(values: CtoFormValues) {
  return repository.createCto(values)
}
export async function updateCto(id: string, values: CtoFormValues) {
  return repository.updateCto(id, values)
}
export async function deleteCto(id: string) {
  return repository.deleteCto(id)
}

export async function createClient(values: ClientFormValues) {
  return repository.createClient(values)
}
export async function updateClient(id: string, values: ClientFormValues) {
  return repository.updateClient(id, values)
}
export async function deleteClient(id: string) {
  return repository.deleteClient(id)
}
