import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Play, Square } from 'lucide-react'
import { EventFeedList } from '@/features/monitoring/components/EventFeedList'
import { EventFiltersPanel } from '@/features/monitoring/components/EventFiltersPanel'
import { LiveBadge } from '@/features/monitoring/components/LiveBadge'
import { MonitoringSummaryCards } from '@/features/monitoring/components/MonitoringSummaryCards'
import { useMonitoringFeed } from '@/features/monitoring/hooks/useMonitoringFeed'
import {
  acknowledgeEvent,
  simulateRandomOperationalEvent,
} from '@/features/monitoring/services/monitoringService'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useToast } from '@/shared/ui/Toast'

const AUTO_INTERVAL_MS = 8_000

export function MonitoringPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const ctoId = searchParams.get('ctoId')
  const clientId = searchParams.get('clientId')
  const { profile } = useAuth()
  const { pushToast } = useToast()

  const {
    filtered,
    summary,
    filters,
    setFilters,
    isLoading,
    error,
    liveCount,
  } = useMonitoringFeed({
    ctoId,
    clientId,
    period: '24h',
  })

  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [autoDemo, setAutoDemo] = useState(false)

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      ctoId,
      clientId,
    }))
  }, [ctoId, clientId, setFilters])

  useEffect(() => {
    if (!autoDemo) return
    let cancelled = false

    async function tick() {
      try {
        const event = await simulateRandomOperationalEvent()
        if (!cancelled) {
          pushToast(`Evento simulado: ${event.title}`, 'info')
        }
      } catch (err) {
        if (!cancelled) {
          pushToast(
            err instanceof Error ? err.message : 'Falha no simulador',
            'error',
          )
          setAutoDemo(false)
        }
      }
    }

    void tick()
    const timer = window.setInterval(() => void tick(), AUTO_INTERVAL_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [autoDemo, pushToast])

  async function handleAcknowledge(id: string) {
    setAcknowledgingId(id)
    try {
      await acknowledgeEvent(id)
      pushToast('Evento reconhecido', 'success')
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao reconhecer', 'error')
    } finally {
      setAcknowledgingId(null)
    }
  }

  async function handleSimulateOnce() {
    setIsSimulating(true)
    try {
      const event = await simulateRandomOperationalEvent()
      pushToast(`Evento criado: ${event.title}`, 'success')
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao simular', 'error')
    } finally {
      setIsSimulating(false)
    }
  }

  function clearDeepLink() {
    setSearchParams({})
    setFilters((prev) => ({ ...prev, ctoId: null, clientId: null }))
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <LiveBadge />
            <span className="text-xs text-[var(--text-muted)]">
              {liveCount} evento(s) na collection · listener Firestore
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Monitoramento</h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">
            Feed operacional AO VIVO — offline, potência e oscilação (simulados). Pronto
            para plugar SNMP/API depois.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile?.role === 'admin' ? (
            <>
              <button
                type="button"
                disabled={isSimulating}
                onClick={() => void handleSimulateOnce()}
                className="r20-btn r20-btn-ghost disabled:opacity-60"
              >
                <Play size={14} />
                {isSimulating ? 'Gerando...' : 'Simular evento'}
              </button>
              <button
                type="button"
                onClick={() => setAutoDemo((value) => !value)}
                className="r20-btn r20-btn-primary"
              >
                {autoDemo ? <Square size={14} /> : <Play size={14} />}
                {autoDemo ? 'Parar demo automática' : 'Demo automática'}
              </button>
            </>
          ) : null}
          <Link
            to="/mapa"
            className="r20-btn r20-btn-ghost"
          >
            Ver mapa
          </Link>
        </div>
      </section>

      <MonitoringSummaryCards summary={summary} />

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <EventFiltersPanel
          filters={filters}
          visibleCount={filtered.length}
          onChange={setFilters}
          onClearDeepLink={clearDeepLink}
        />

        <div className="min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium text-[var(--text-muted)]">Feed de eventos</h2>
            <p className="text-xs text-[var(--text-muted)]">
              CLI: <code className="text-[var(--accent)]">npm run simulate:events</code>
            </p>
          </div>
          <EventFeedList
            events={filtered}
            isLoading={isLoading}
            error={error}
            acknowledgingId={acknowledgingId}
            onAcknowledge={(id) => void handleAcknowledge(id)}
          />
        </div>
      </div>
    </div>
  )
}
