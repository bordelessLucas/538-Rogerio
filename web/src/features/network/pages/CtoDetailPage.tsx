import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Activity, ArrowLeft, MapPin, Pencil } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  DetailBreadcrumb,
  DetailSection,
  EntityMeta,
  OccupancyBar,
} from '@/features/network/components/detail'
import { FormDrawer } from '@/features/network/components/FormDrawer'
import { OccupancyBadge } from '@/features/network/components/ListChrome'
import { CtoForm } from '@/features/network/components/CtoForm'
import type { CtoFormValues } from '@/features/network/domain/schemas'
import {
  useClients,
  useCtos,
  useOlts,
  usePons,
} from '@/features/network/hooks/useNetworkCollections'
import { useAssetEvents, useCto } from '@/features/network/hooks/useNetworkEntity'
import { updateCto } from '@/features/network/services/networkService'
import { buildMapDeepLink } from '@/features/map/utils/mapDeepLink'
import { CardShell, DetailSkeleton, StatusBadge } from '@/shared/ui'
import { useToast } from '@/shared/ui/Toast'
import { STATUS_LABEL } from '@/shared/utils'
import type { Client, Cto } from '@/shared/types/network'

function averagePower(clients: Client[]) {
  if (clients.length === 0) return null
  const sum = clients.reduce((acc, client) => acc + client.powerDbm, 0)
  return Math.round((sum / clients.length) * 10) / 10
}

function recommendCtoOnSamePon(current: Cto, all: Cto[]) {
  const candidates = all
    .filter((cto) => cto.ponId === current.ponId && cto.id !== current.id)
    .sort((a, b) => a.occupancyPercent - b.occupancyPercent)
  return candidates[0] ?? null
}

export function CtoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { pushToast } = useToast()
  const { item: cto, isLoading, error } = useCto(id)
  const { items: olts } = useOlts()
  const { items: pons } = usePons()
  const { items: clients, isLoading: clientsLoading } = useClients()
  const { items: allCtos } = useCtos()
  const { events, isLoading: eventsLoading } = useAssetEvents(id)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const olt = useMemo(
    () => olts.find((item) => item.id === cto?.oltId) ?? null,
    [olts, cto?.oltId],
  )
  const pon = useMemo(
    () => pons.find((item) => item.id === cto?.ponId) ?? null,
    [pons, cto?.ponId],
  )
  const ctoClients = useMemo(
    () => clients.filter((client) => client.ctoId === cto?.id),
    [clients, cto?.id],
  )
  const avgPower = averagePower(ctoClients)
  const recommended = cto ? recommendCtoOnSamePon(cto, allCtos) : null

  async function handleSubmit(values: CtoFormValues) {
    if (!cto) return
    setIsSubmitting(true)
    try {
      await updateCto(cto.id, values)
      pushToast('CTO atualizada', 'success')
      setDrawerOpen(false)
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao salvar CTO', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (error) {
    return (
      <CardShell>
        <p className="text-sm text-[var(--status-offline)]">{error.message}</p>
      </CardShell>
    )
  }

  if (!cto) {
    return (
      <div className="space-y-4">
        <DetailBreadcrumb
          items={[
            { label: 'Rede', to: '/rede' },
            { label: 'CTOs', to: '/rede/ctos' },
            { label: 'Não encontrada' },
          ]}
        />
        <CardShell>
          <p className="text-sm text-[var(--text-muted)]">CTO não encontrada.</p>
          <Link to="/rede/ctos" className="mt-3 inline-block text-sm text-[var(--accent)]">
            Voltar para listagem
          </Link>
        </CardShell>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <DetailBreadcrumb
        items={[
          { label: 'Rede', to: '/rede' },
          { label: 'CTOs', to: '/rede/ctos' },
          { label: cto.name },
        ]}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold">{cto.name}</h1>
            <StatusBadge label={STATUS_LABEL[cto.status]} tone={cto.status} />
            <OccupancyBadge percent={cto.occupancyPercent} />
          </div>
          <p className="text-sm text-[var(--text-muted)]">Código {cto.code}</p>
          <EntityMeta
            items={[
              {
                label: 'OLT',
                value: olt?.name ?? '—',
                to: '/rede/olts',
              },
              {
                label: 'PON',
                value: pon?.name ?? '—',
                to: '/rede/pons',
              },
              {
                label: 'CTO',
                value: cto.name,
              },
            ]}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--accent)]"
          >
            <ArrowLeft size={14} /> Voltar
          </button>
          <Link
            to={buildMapDeepLink('cto', cto.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--accent)]"
          >
            <MapPin size={14} /> Ver no mapa
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--accent)]"
          >
            <Pencil size={14} /> Editar
          </button>
          <Link
            to={`/monitoramento?ctoId=${cto.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-slate-950"
          >
            <Activity size={14} /> Abrir monitoramento filtrado
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DetailSection title="Capacidade e portas">
          <OccupancyBar
            percent={cto.occupancyPercent}
            occupied={cto.occupiedPorts}
            capacity={cto.capacity}
            free={cto.freePorts}
          />
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Capacidade</dt>
              <dd className="font-medium">{cto.capacity} portas</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Ocupadas</dt>
              <dd className="font-medium">{cto.occupiedPorts}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Livres</dt>
              <dd className="font-medium">{cto.freePorts}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Splitter</dt>
              <dd className="font-medium">{cto.splitter}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Distância</dt>
              <dd className="font-medium">
                {cto.distanceMeters.toLocaleString('pt-BR')} m
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Potência média</dt>
              <dd className="font-medium">
                {avgPower === null ? '—' : `${avgPower.toFixed(1)} dBm`}
              </dd>
            </div>
          </dl>
        </DetailSection>

        <DetailSection
          title="CTO recomendada"
          description="Menor ocupação na mesma PON (sugestão para novo cliente)"
        >
          {recommended ? (
            <div className="space-y-2">
              <Link
                to={`/rede/ctos/${recommended.id}`}
                className="text-lg font-medium text-[var(--accent)] hover:underline"
              >
                {recommended.name}
              </Link>
              <p className="text-sm text-[var(--text-muted)]">
                {recommended.code} · {recommended.occupancyPercent.toLocaleString('pt-BR')}% ·{' '}
                {recommended.freePorts} portas livres
              </p>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              Não há outra CTO na mesma PON para comparar.
            </p>
          )}
        </DetailSection>
      </div>

      <DetailSection
        title="Clientes nesta CTO"
        description={`${ctoClients.length} vinculado(s)`}
      >
        {clientsLoading ? (
          <p className="text-sm text-[var(--text-muted)]">Carregando clientes...</p>
        ) : ctoClients.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">Nenhum cliente nesta CTO.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--text-muted)]">
                <tr>
                  <th className="px-2 py-1.5 font-medium">Nome</th>
                  <th className="px-2 py-1.5 font-medium">Plano</th>
                  <th className="px-2 py-1.5 font-medium">Potência</th>
                  <th className="px-2 py-1.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ctoClients.map((client) => (
                  <tr key={client.id} className="border-t border-[var(--border)]">
                    <td className="px-2 py-2">
                      <Link
                        to={`/rede/clientes/${client.id}`}
                        className="text-[var(--accent)] hover:underline"
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-2 py-2">{client.plan}</td>
                    <td className="px-2 py-2">{client.powerDbm.toFixed(1)} dBm</td>
                    <td className="px-2 py-2">
                      <StatusBadge label={STATUS_LABEL[client.status]} tone={client.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DetailSection>

      <div className="grid gap-4 lg:grid-cols-2">
        <DetailSection title="Histórico de eventos" description="Vinculados a esta CTO">
          {eventsLoading ? (
            <p className="text-sm text-[var(--text-muted)]">Carregando eventos...</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">Nenhum evento registrado.</p>
          ) : (
            <ul className="space-y-2">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2"
                >
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{event.description}</p>
                  <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                    {formatDistanceToNow(new Date(event.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </DetailSection>

        <DetailSection title="Fotos e documentação" description="Placeholder — Storage na Sprint 02">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] text-xs text-[var(--text-muted)]">
              Fotos da CTO
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-sm">
              <p className="font-medium">Documentos</p>
              <ul className="mt-2 space-y-1 text-xs text-[var(--text-muted)]">
                <li>• croqui-caixa.pdf (em breve)</li>
                <li>• foto-instalacao.jpg (em breve)</li>
                <li>• laudo-otdr.pdf (em breve)</li>
              </ul>
            </div>
          </div>
        </DetailSection>
      </div>

      <FormDrawer
        open={drawerOpen}
        title="Editar CTO"
        onClose={() => setDrawerOpen(false)}
      >
        <CtoForm
          key={cto.id}
          initial={cto}
          olts={olts}
          pons={pons}
          isSubmitting={isSubmitting}
          onCancel={() => setDrawerOpen(false)}
          onSubmit={handleSubmit}
        />
      </FormDrawer>
    </div>
  )
}
