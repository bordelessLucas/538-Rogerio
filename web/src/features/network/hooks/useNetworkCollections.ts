import { useEffect, useState } from 'react'
import {
  subscribeClients,
  subscribeCtos,
  subscribeOlts,
  subscribePons,
  subscribePops,
} from '@/features/network/services/networkService'
import type { Client, Cto, Olt, Pon, Pop } from '@/shared/types/network'

function useFirestoreList<T>(
  subscribe: (
    onData: (items: T[]) => void,
    onError: (error: Error) => void,
  ) => () => void,
) {
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = subscribe(
      (next) => {
        setItems(next)
        setError(null)
        setIsLoading(false)
      },
      (err) => {
        setError(err)
        setIsLoading(false)
      },
    )
    return unsubscribe
  }, [subscribe])

  return { items, isLoading, error }
}

export function usePops() {
  return useFirestoreList<Pop>(subscribePops)
}

export function useOlts() {
  return useFirestoreList<Olt>(subscribeOlts)
}

export function usePons() {
  return useFirestoreList<Pon>(subscribePons)
}

export function useCtos() {
  return useFirestoreList<Cto>(subscribeCtos)
}

export function useClients() {
  return useFirestoreList<Client>(subscribeClients)
}
