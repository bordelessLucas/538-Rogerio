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

  return (
    <div className="space-y-4">
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
