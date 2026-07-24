import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Database, Map, Network, Radio } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { applyNetworkSeed } from '@/infra/firebase/seedService'
import { CardShell, KpiSkeleton } from '@/shared/ui'

const kpiTitles = [
  'Clientes Online',
  'Clientes Offline',
  'Clientes com Sinal Ruim',
  'OLTs cadastradas',
  'Chamados',
  'Disponibilidade da Rede',
]

export function DashboardPage() {
  const { profile } = useAuth()
  const [seedMessage, setSeedMessage] = useState<string | null>(null)
  const [isSeeding, setIsSeeding] = useState(false)

  async function handleSeed() {
    setIsSeeding(true)
    setSeedMessage(null)
    try {
      const result = await applyNetworkSeed()
      setSeedMessage(result.message)
    } catch (error) {
      setSeedMessage(error instanceof Error ? error.message : 'Falha ao aplicar seed')
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
            Shell do painel pronto. Os indicadores serão preenchidos no Dia 02 com dados do
            Firestore em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile?.role === 'admin' ? (
            <button
              type="button"
              onClick={() => void handleSeed()}
              disabled={isSeeding}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-60"
            >
              <Database size={16} />
              {isSeeding ? 'Aplicando seed...' : 'Aplicar seed Firebase'}
            </button>
          ) : null}
          <Link
            to="/mapa"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Map size={16} />
            Ver mapa
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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-[var(--text-muted)]">Indicadores principais</h2>
          <span className="text-xs text-[var(--text-muted)]">Aguardando seed / Dia 02</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {kpiTitles.map((title) => (
            <KpiSkeleton key={title} title={title} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <CardShell className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <Radio size={16} className="text-[var(--accent)]" />
            <h3 className="font-medium">Últimos eventos</h3>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Preview do monitoramento. Eventos simulados entram no Dia 06; estrutura de collections
            já está preparada (`events`).
          </p>
          <div className="mt-4 space-y-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2"
              >
                <div className="h-3 w-48 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
              </div>
            ))}
          </div>
        </CardShell>

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
          </ul>
        </CardShell>
      </section>
    </div>
  )
}
