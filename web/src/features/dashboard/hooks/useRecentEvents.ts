import { useEffect, useState } from 'react'
import { subscribeRecentEvents } from '@/features/dashboard/services/dashboardService'
import type { NetworkEvent } from '@/shared/types/network'

interface UseRecentEventsResult {
  events: NetworkEvent[]
  isLoading: boolean
  error: Error | null
}

export function useRecentEvents(limitCount = 5): UseRecentEventsResult {
  const [events, setEvents] = useState<NetworkEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeRecentEvents(
      limitCount,
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
  }, [limitCount])

  return { events, isLoading, error }
}
