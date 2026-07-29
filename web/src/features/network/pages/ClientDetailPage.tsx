import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Activity, ArrowLeft, MapPin, Pencil } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  DetailBreadcrumb,
  DetailSection,
  EntityMeta,
  PowerIndicator,
  SignalSparkline,
} from '@/features/network/components/detail'
import { FormDrawer } from '@/features/network/components/FormDrawer'
import { ClientForm } from '@/features/network/components/ClientForm'
import type { ClientFormValues } from '@/features/network/domain/schemas'
import {
  useCtos,
  useOlts,
  usePons,
} from '@/features/network/hooks/useNetworkCollections'
import { useAssetEvents, useClient } from '@/features/network/hooks/useNetworkEntity'
import { updateClient } from '@/features/network/services/networkService'
import { buildMapDeepLink } from '@/features/map/utils/mapDeepLink'
import { CardShell, StatusBadge } from '@/shared/ui'
import { useToast } from '@/shared/ui/Toast'
import { STATUS_LABEL } from '@/shared/utils'

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { pushToast } = useToast()
  const { item: client, isLoading, error } = useClient(id)
  const { items: ctos } = useCtos()
  const { items: olts } = useOlts()
  const { items: pons } = usePons()
  const { events, isLoading: eventsLoading } = useAssetEvents(id)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signalStubOpen, setSignalStubOpen] = useState(false)

  const cto = useMemo(
    () => ctos.find((item) => item.id === client?.ctoId) ?? null,
    [ctos, client?.ctoId],
  )
  const olt = useMemo(
    () => olts.find((item) => item.id === client?.oltId) ?? null,
    [olts, client?.oltId],
  )
  const pon = useMemo(
    () => pons.find((item) => item.id === client?.ponId) ?? null,
    [pons, client?.ponId],
  )

  async function handleSubmit(values: ClientFormValues) {
    if (!client) return
    setIsSubmitting(true)
    try {
      await updateClient(client.id, values)
      pushToast('Cliente atualizado', 'success')
      setDrawerOpen(false)
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao salvar cliente', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <CardShell>
        <p className="text-sm text-[var(--text-muted)]">Carregando cliente...</p>
      </CardShell>
    )
  }

  if (error) {
    return (
      <CardShell>
        <p className="text-sm text-[var(--status-offline)]">{error.message}</p>
      </CardShell>
    )
  }

  if (!client) {
    return (
      <div className="space-y-4">
        <DetailBreadcrumb
          items={[
            { label: 'Rede', to: '/rede' },
            { label: 'Clientes', to: '/rede/clientes' },
            { label: 'Não encontrado' },
          ]}
        />
        <CardShell>
          <p className="text-sm text-[var(--text-muted)]">Cliente não encontrado.</p>
          <Link to="/rede/clientes" className="mt-3 inline-block text-sm text-[var(--accent)]">
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
          { label: 'Clientes', to: '/rede/clientes' },
          { label: client.name },
        ]}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold">{client.name}</h1>
            <StatusBadge label={STATUS_LABEL[client.status]} tone={client.status} />
          </div>
          <p className="text-sm text-[var(--text-muted)]">{client.plan}</p>
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
                value: cto?.name ?? '—',
                to: cto ? `/rede/ctos/${cto.id}` : undefined,
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
            to={buildMapDeepLink('client', client.id)}
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
          <button
            type="button"
            onClick={() => {
              setSignalStubOpen(true)
              navigate(`/monitoramento?clientId=${client.id}`)
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-slate-950"
          >
            <Activity size={14} /> Histórico de sinal
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DetailSection title="Potência óptica" className="lg:col-span-1">
          <PowerIndicator powerDbm={client.powerDbm} size="lg" />
        </DetailSection>

        <DetailSection title="Dados do assinante" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Plano</dt>
              <dd className="font-medium">{client.plan}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">ONU</dt>
              <dd className="font-medium">{client.onuModel}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Equipamento</dt>
              <dd className="font-medium">{client.equipment}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">IP</dt>
              <dd className="font-medium">{client.ip}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">MAC</dt>
              <dd className="font-medium">{client.mac}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Serial</dt>
              <dd className="font-medium">{client.serial}</dd>
            </div>
            <div className="col-span-2 md:col-span-3">
              <dt className="text-xs text-[var(--text-muted)]">Último acesso</dt>
              <dd className="font-medium">
                {formatDistanceToNow(new Date(client.lastAccessAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}{' '}
                <span className="text-xs font-normal text-[var(--text-muted)]">
                  ({new Date(client.lastAccessAt).toLocaleString('pt-BR')})
                </span>
              </dd>
            </div>
          </dl>
        </DetailSection>
      </div>

      <DetailSection
        title="Histórico de sinal"
        description={signalStubOpen ? 'Preview simulado' : 'Sparkline fake para demo'}
      >
        <SignalSparkline powerDbm={client.powerDbm} />
      </DetailSection>

      <div className="grid gap-4 lg:grid-cols-2">
        <DetailSection title="Histórico / eventos">
          {eventsLoading ? (
            <p className="text-sm text-[var(--text-muted)]">Carregando...</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">Nenhum evento vinculado.</p>
          ) : (
            <ul className="space-y-2">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2"
                >
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{event.description}</p>
                </li>
              ))}
            </ul>
          )}
        </DetailSection>

        <DetailSection title="Operação (placeholders)">
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            <li className="rounded-lg border border-[var(--border)] px-3 py-2">
              Fotos da instalação — em breve (Storage)
            </li>
            <li className="rounded-lg border border-[var(--border)] px-3 py-2">
              Ordens de serviço — Sprint 02
            </li>
            <li className="rounded-lg border border-[var(--border)] px-3 py-2">
              Chamados — link futuro para /chamados
            </li>
            <li className="rounded-lg border border-[var(--border)] px-3 py-2">
              Teste de velocidade — stub
            </li>
          </ul>
        </DetailSection>
      </div>

      <FormDrawer
        open={drawerOpen}
        title="Editar cliente"
        onClose={() => setDrawerOpen(false)}
      >
        <ClientForm
          key={client.id}
          initial={client}
          ctos={ctos}
          isSubmitting={isSubmitting}
          onCancel={() => setDrawerOpen(false)}
          onSubmit={handleSubmit}
        />
      </FormDrawer>
    </div>
  )
}
