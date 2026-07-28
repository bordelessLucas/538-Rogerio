import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Cable,
  Database,
  Map,
  Network,
  Server,
  ShieldCheck,
  Signal,
  Ticket,
  Users,
  WifiOff,
} from 'lucide-react'
import { EventsPreview } from '@/features/dashboard/components/EventsPreview'
import { KpiCard } from '@/features/dashboard/components/KpiCard'
import { useNocMetrics } from '@/features/dashboard/hooks/useNocMetrics'
import { useRecentEvents } from '@/features/dashboard/hooks/useRecentEvents'
import { resetDashboardMetrics } from '@/features/dashboard/services/dashboardService'
import { useAuth } from '@/features/auth/context/AuthContext'
import { applyNetworkSeed } from '@/infra/firebase/seedService'
import { CardShell } from '@/shared/ui'
import { formatUpdatedAgo } from '@/shared/utils'

function formatPercent(value: number) {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
}

function formatInteger(value: number) {
  return value.toLocaleString('pt-BR')
}

export function DashboardPage() {
  const { profile } = useAuth()
  const { metrics, isLoading, error, updatedAt } = useNocMetrics()
  const { events, isLoading: eventsLoading, error: eventsError } = useRecentEvents(5)

  const [seedMessage, setSeedMessage] = useState<string | null>(null)
  const [isSeeding, setIsSeeding] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const hasError = Boolean(error)
  const availabilityTone =
    (metrics?.networkAvailabilityPercent ?? 0) >= 99 ? 'online' : 'alert'

  async function handleSeed() {
    setIsSeeding(true)
    setSeedMessage(null)
    try {
      const networkResult = await applyNetworkSeed({ force: true })
      await resetDashboardMetrics()
      setSeedMessage(`${networkResult.message} Métricas NOC atualizadas.`)
    } catch (err) {
      setSeedMessage(err instanceof Error ? err.message : 'Falha ao aplicar seed')
    } finally {
      setIsSeeding(false)
    }
  }

  async function handleResetMetrics() {
    setIsSeeding(true)
    setSeedMessage(null)
    try {
      const next = await resetDashboardMetrics()
      setSeedMessage(
        `Métricas resetadas: ${formatInteger(next.clientsOnline)} online · ${formatPercent(next.networkAvailabilityPercent)} disponibilidade.`,
      )
    } catch (err) {
      setSeedMessage(err instanceof Error ? err.message : 'Falha ao resetar métricas')
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--accent)] uppercase">
            Dashboard NOC
          </p>
          <h1 className="mt-1 text-2xl font-semibold md:text-3xl">Visão operacional da rede</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Saúde da rede FTTH em tempo real — indicadores simulados via Firestore.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile?.role === 'admin' ? (
            <>
              <button
                type="button"
                onClick={() => void handleSeed()}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-60"
              >
                <Database size={16} />
                {isSeeding ? 'Aplicando...' : 'Reaplicar seed Firebase'}
              </button>
              <button
                type="button"
                onClick={() => void handleResetMetrics()}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-60"
              >
                Reset métricas
              </button>
            </>
          ) : null}
          <Link
            to="/mapa"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Map size={16} />
            Ver no mapa
          </Link>
          <Link
            to="/rede"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-slate-950 transition hover:brightness-110"
          >
            <Network size={16} />
            Cadastros
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {seedMessage ? (
        <p className="rounded-lg border border-[var(--border)] bg-[var(--bg-panel)] px-3 py-2 text-sm text-[var(--text-muted)]">
          {seedMessage}
        </p>
      ) : null}

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-[var(--text-muted)]">Indicadores principais</h2>
          <span className="text-xs text-[var(--text-muted)]">
            {updatedAt ? formatUpdatedAgo(updatedAt, now) : isLoading ? 'Carregando...' : 'Sem dados'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          <KpiCard
            title="Clientes Online"
            value={metrics ? formatInteger(metrics.clientsOnline) : null}
            icon={Users}
            tone="online"
            isLoading={isLoading}
            error={hasError}
            hint="Sessões ativas"
          />
          <KpiCard
            title="Clientes Offline"
            value={metrics ? formatInteger(metrics.clientsOffline) : null}
            icon={WifiOff}
            tone="offline"
            to="/monitoramento"
            isLoading={isLoading}
            error={hasError}
            hint="Ver monitoramento →"
          />
          <KpiCard
            title="Clientes com Sinal Ruim"
            value={metrics ? formatInteger(metrics.clientsBadSignal) : null}
            icon={Signal}
            tone="alert"
            to="/monitoramento"
            isLoading={isLoading}
            error={hasError}
            hint="Potência crítica"
          />
          <KpiCard
            title="OLTs cadastradas"
            value={metrics ? formatInteger(metrics.oltsCount) : null}
            icon={Server}
            tone="info"
            to="/rede/olts"
            isLoading={isLoading}
            error={hasError}
            hint="Cadastro de rede →"
          />
          <KpiCard
            title="Chamados"
            value={metrics ? formatInteger(metrics.ticketsOpen) : null}
            icon={Ticket}
            tone="warn"
            to="/chamados"
            isLoading={isLoading}
            error={hasError}
            hint="Abertos / em andamento"
          />
          <KpiCard
            title="Disponibilidade da Rede"
            value={metrics ? formatPercent(metrics.networkAvailabilityPercent) : null}
            icon={Activity}
            tone={availabilityTone}
            isLoading={isLoading}
            error={hasError}
            hint={availabilityTone === 'online' ? 'Meta ≥ 99%' : 'Abaixo da meta'}
          />
        </div>
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-sm font-medium text-[var(--text-muted)]">Operação</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          <KpiCard
            title="Rompimentos"
            value={metrics ? formatInteger(metrics.fiberBreaks) : null}
            icon={Cable}
            tone={metrics && metrics.fiberBreaks > 0 ? 'offline' : 'online'}
            isLoading={isLoading}
            error={hasError}
          />
          <KpiCard
            title="CTOs com lotação"
            value={metrics ? formatInteger(metrics.ctosOvercapacity) : null}
            icon={AlertTriangle}
            tone="alert"
            to="/rede/ctos"
            isLoading={isLoading}
            error={hasError}
            hint="Ocupação > 80%"
          />
          <KpiCard
            title="PPPoE ativos"
            value={metrics ? formatInteger(metrics.pppoeActive) : null}
            icon={Users}
            tone="info"
            isLoading={isLoading}
            error={hasError}
          />
          <KpiCard
            title="Alarmes ativos"
            value={metrics ? formatInteger(metrics.activeAlarms) : null}
            icon={AlertTriangle}
            tone="warn"
            to="/monitoramento"
            isLoading={isLoading}
            error={hasError}
          />
          <KpiCard
            title="SLA do dia"
            value={metrics ? formatPercent(metrics.slaPercentToday) : null}
            icon={ShieldCheck}
            tone={(metrics?.slaPercentToday ?? 0) >= 99 ? 'online' : 'alert'}
            isLoading={isLoading}
            error={hasError}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <EventsPreview events={events} isLoading={eventsLoading} error={eventsError} />

        <CardShell>
          <h3 className="font-medium">Atalhos rápidos</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
            <li>
              <Link className="hover:text-[var(--accent)]" to="/rede/olts">
                → OLTs
              </Link>
            </li>
            <li>
              <Link className="hover:text-[var(--accent)]" to="/rede/ctos">
                → CTOs
              </Link>
            </li>
            <li>
              <Link className="hover:text-[var(--accent)]" to="/rede/clientes">
                → Clientes
              </Link>
            </li>
            <li>
              <Link className="hover:text-[var(--accent)]" to="/monitoramento">
                → Monitoramento
              </Link>
            </li>
            <li>
              <Link className="hover:text-[var(--accent)]" to="/chamados">
                → Chamados
              </Link>
            </li>
          </ul>
        </CardShell>
      </section>
    </div>
  )
}
