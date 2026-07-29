import { useEffect, useState } from 'react'
import {
  subscribeAssetEvents,
  subscribeClient,
  subscribeCto,
} from '@/features/network/services/networkService'
import type { Client, Cto, NetworkEvent } from '@/shared/types/network'

export function useCto(id: string | undefined) {
  const [item, setItem] = useState<Cto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setItem(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const unsubscribe = subscribeCto(
      id,
      (next) => {
        setItem(next)
        setError(null)
        setIsLoading(false)
      },
      (err) => {
        setError(err)
        setIsLoading(false)
      },
    )
    return unsubscribe
  }, [id])

  return { item, isLoading, error }
}

export function useClient(id: string | undefined) {
  const [item, setItem] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setItem(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const unsubscribe = subscribeClient(
      id,
      (next) => {
        setItem(next)
        setError(null)
        setIsLoading(false)
      },
      (err) => {
        setError(err)
        setIsLoading(false)
      },
    )
    return unsubscribe
  }, [id])

  return { item, isLoading, error }
}

export function useAssetEvents(assetId: string | undefined) {
  const [events, setEvents] = useState<NetworkEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!assetId) {
      setEvents([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const unsubscribe = subscribeAssetEvents(
      assetId,
      (next) => {
        setEvents(next)
        setError(null)
        setIsLoading(false)
      },
      (err) => {
        setError(err)
        setIsLoading(false)
      },
    )
    return unsubscribe
  }, [assetId])

  return { events, isLoading, error }
}
