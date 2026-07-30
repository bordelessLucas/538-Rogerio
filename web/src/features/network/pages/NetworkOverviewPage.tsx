import { Link } from 'react-router-dom'
import { CardShell, StatusBadge } from '@/shared/ui'
import {
  useClients,
  useCtos,
  useOlts,
  usePons,
} from '@/features/network/hooks/useNetworkCollections'

export function NetworkOverviewPage() {
  const { items: olts, isLoading: loadingOlts } = useOlts()
  const { items: pons, isLoading: loadingPons } = usePons()
  const { items: ctos, isLoading: loadingCtos } = useCtos()
  const { items: clients, isLoading: loadingClients } = useClients()

  const cards = [
    { label: 'OLTs', count: olts.length, to: '/rede/olts', loading: loadingOlts },
    { label: 'PONs', count: pons.length, to: '/rede/pons', loading: loadingPons },
    { label: 'CTOs', count: ctos.length, to: '/rede/ctos', loading: loadingCtos },
    {
      label: 'Clientes',
      count: clients.length,
      to: '/rede/clientes',
      loading: loadingClients,
    },
  ]

  const overCapacity = ctos.filter((cto) => cto.occupancyPercent > 80).length
  const offlineClients = clients.filter((client) => client.status === 'offline').length
  const isEmpty =
    !loadingOlts &&
    !loadingPons &&
    !loadingCtos &&
    !loadingClients &&
    olts.length === 0 &&
    pons.length === 0 &&
    ctos.length === 0 &&
    clients.length === 0

  return (
    <div className="space-y-4">
      {isEmpty ? (
        <CardShell className="text-center">
          <h3 className="font-medium">Rede ainda vazia</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Aplique o seed no Dashboard (modo apresentação) ou cadastre a primeira OLT.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              to="/"
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--accent)]"
            >
              Dashboard / seed
            </Link>
            <Link
              to="/rede/olts"
              className="rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-slate-950"
            >
              Cadastrar OLT
            </Link>
          </div>
        </CardShell>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.to} to={card.to}>
            <CardShell className="transition hover:border-[var(--accent)]">
              <p className="text-sm text-[var(--text-muted)]">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold">
                {card.loading ? '—' : card.count}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Abrir listagem →</p>
            </CardShell>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <CardShell>
          <p className="text-sm text-[var(--text-muted)]">CTOs com lotação alta</p>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-xl font-semibold">{overCapacity}</p>
            <StatusBadge
              label={overCapacity > 0 ? 'Atenção' : 'OK'}
              tone={overCapacity > 0 ? 'alert' : 'online'}
            />
          </div>
        </CardShell>
        <CardShell>
          <p className="text-sm text-[var(--text-muted)]">Clientes offline</p>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-xl font-semibold">{offlineClients}</p>
            <StatusBadge
              label={offlineClients > 0 ? 'Offline' : 'Estável'}
              tone={offlineClients > 0 ? 'offline' : 'online'}
            />
          </div>
        </CardShell>
      </div>
    </div>
  )
}
