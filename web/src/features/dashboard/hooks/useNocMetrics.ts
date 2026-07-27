import { useEffect, useState } from 'react'
import { subscribeNocMetrics } from '@/features/dashboard/services/dashboardService'
import type { NocMetrics } from '@/shared/types/network'

interface UseNocMetricsResult {
  metrics: NocMetrics | null
  isLoading: boolean
  error: Error | null
  updatedAt: string | null
}

export function useNocMetrics(): UseNocMetricsResult {
  const [metrics, setMetrics] = useState<NocMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeNocMetrics(
      (next) => {
        setMetrics(next)
        setError(null)
        setIsLoading(false)
      },
      (err) => {
        setError(err)
        setIsLoading(false)
      },
    )

    return unsubscribe
  }, [])

  return {
    metrics,
    isLoading,
    error,
    updatedAt: metrics?.updatedAt ?? null,
  }
}
