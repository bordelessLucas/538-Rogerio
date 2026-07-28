import type { Client, Cto, Olt, Pon, Pop } from '@/shared/types/network'
import type {
  ClientFormValues,
  CtoFormValues,
  OltFormValues,
  PonFormValues,
} from '@/features/network/domain/schemas'

export interface INetworkRepository {
  subscribePops(
    onData: (items: Pop[]) => void,
    onError: (error: Error) => void,
  ): () => void

  subscribeOlts(
    onData: (items: Olt[]) => void,
    onError: (error: Error) => void,
  ): () => void

  subscribePons(
    onData: (items: Pon[]) => void,
    onError: (error: Error) => void,
  ): () => void

  subscribeCtos(
    onData: (items: Cto[]) => void,
    onError: (error: Error) => void,
  ): () => void

  subscribeClients(
    onData: (items: Client[]) => void,
    onError: (error: Error) => void,
  ): () => void

  createOlt(values: OltFormValues): Promise<string>
  updateOlt(id: string, values: OltFormValues): Promise<void>
  deleteOlt(id: string): Promise<void>

  createPon(values: PonFormValues): Promise<string>
  updatePon(id: string, values: PonFormValues): Promise<void>
  deletePon(id: string): Promise<void>

  createCto(values: CtoFormValues): Promise<string>
  updateCto(id: string, values: CtoFormValues): Promise<void>
  deleteCto(id: string): Promise<void>

  createClient(values: ClientFormValues): Promise<string>
  updateClient(id: string, values: ClientFormValues): Promise<void>
  deleteClient(id: string): Promise<void>
}
