import { useState } from 'react'
import { FormDrawer } from '@/features/network/components/FormDrawer'
import {
  EmptyState,
  EntityActions,
  ListToolbar,
  PaginationBar,
} from '@/features/network/components/ListChrome'
import { ClientForm } from '@/features/network/components/ClientForm'
import type { ClientFormValues } from '@/features/network/domain/schemas'
import { useClients, useCtos } from '@/features/network/hooks/useNetworkCollections'
import {
  createClient,
  deleteClient,
  updateClient,
} from '@/features/network/services/networkService'
import { matchesQuery, paginate } from '@/features/network/utils/list'
import { CardShell, StatusBadge } from '@/shared/ui'
import { useToast } from '@/shared/ui/Toast'
import { STATUS_LABEL } from '@/shared/utils'
import type { Client } from '@/shared/types/network'

export function ClientsPage() {
  const { pushToast } = useToast()
  const { items: clients, isLoading, error } = useClients()
  const { items: ctos } = useCtos()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ctoFilter, setCtoFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filtered = clients.filter((client) => {
    const matchesSearch =
      matchesQuery(client.name, search) ||
      matchesQuery(client.plan, search) ||
      matchesQuery(client.serial, search)
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    const matchesCto = ctoFilter === 'all' || client.ctoId === ctoFilter
    return matchesSearch && matchesStatus && matchesCto
  })
  const paged = paginate(filtered, page, 10)
  const ctoName = (id: string) => ctos.find((cto) => cto.id === id)?.name ?? '—'

  async function handleSubmit(values: ClientFormValues) {
    setIsSubmitting(true)
    try {
      if (editing) {
        await updateClient(editing.id, values)
        pushToast('Cliente atualizado', 'success')
      } else {
        await createClient(values)
        pushToast('Cliente cadastrado — aparece no mapa se tiver lat/lng', 'success')
      }
      setDrawerOpen(false)
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao salvar cliente', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(client: Client) {
    if (!window.confirm(`Excluir ${client.name}?`)) return
    try {
      await deleteClient(client.id)
      pushToast('Cliente excluído', 'success')
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao excluir cliente', 'error')
    }
  }

  return (
    <div className="space-y-4">
      <ListToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        placeholder="Buscar nome, plano ou serial..."
        onCreate={() => {
          setEditing(null)
          setDrawerOpen(true)
        }}
        createLabel="+ Novo cliente"
        filters={
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            >
              <option value="all">Todos status</option>
              <option value="online">Online</option>
              <option value="alert">Alerta</option>
              <option value="offline">Offline</option>
              <option value="disabled">Desativado</option>
            </select>
            <select
              value={ctoFilter}
              onChange={(e) => {
                setCtoFilter(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            >
              <option value="all">Todas CTOs</option>
              {ctos.map((cto) => (
                <option key={cto.id} value={cto.id}>
                  {cto.name}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {error ? <p className="text-sm text-[var(--status-offline)]">{error.message}</p> : null}

      {isLoading ? (
        <CardShell>
          <p className="text-sm text-[var(--text-muted)]">Carregando clientes...</p>
        </CardShell>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum cliente encontrado"
          description="Cadastre o primeiro cliente associado a uma CTO."
          actionLabel="Cadastrar primeiro cliente"
          onAction={() => {
            setEditing(null)
            setDrawerOpen(true)
          }}
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-[var(--border)] md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)]">
                <tr>
                  <th className="px-3 py-2 font-medium">Nome</th>
                  <th className="px-3 py-2 font-medium">Plano</th>
                  <th className="px-3 py-2 font-medium">CTO</th>
                  <th className="px-3 py-2 font-medium">Potência</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paged.items.map((client) => (
                  <tr key={client.id} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2">{client.name}</td>
                    <td className="px-3 py-2">{client.plan}</td>
                    <td className="px-3 py-2">{ctoName(client.ctoId)}</td>
                    <td className="px-3 py-2">{client.powerDbm.toFixed(1)} dBm</td>
                    <td className="px-3 py-2">
                      <StatusBadge label={STATUS_LABEL[client.status]} tone={client.status} />
                    </td>
                    <td className="px-3 py-2">
                      <EntityActions
                        onEdit={() => {
                          setEditing(client)
                          setDrawerOpen(true)
                        }}
                        onDelete={() => void handleDelete(client)}
                        mapQuery={client.name}
                        detailsTo="/rede/clientes"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {paged.items.map((client) => (
              <CardShell key={client.id} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {client.plan} · {ctoName(client.ctoId)}
                    </p>
                  </div>
                  <StatusBadge label={STATUS_LABEL[client.status]} tone={client.status} />
                </div>
                <EntityActions
                  onEdit={() => {
                    setEditing(client)
                    setDrawerOpen(true)
                  }}
                  onDelete={() => void handleDelete(client)}
                  mapQuery={client.name}
                />
              </CardShell>
            ))}
          </div>

          <PaginationBar
            page={paged.page}
            pageCount={paged.pageCount}
            total={paged.total}
            onPageChange={setPage}
          />
        </>
      )}

      <FormDrawer
        open={drawerOpen}
        title={editing ? 'Editar cliente' : 'Novo cliente'}
        onClose={() => setDrawerOpen(false)}
      >
        <ClientForm
          key={editing?.id ?? 'new'}
          initial={editing}
          ctos={ctos}
          isSubmitting={isSubmitting}
          onCancel={() => setDrawerOpen(false)}
          onSubmit={handleSubmit}
        />
      </FormDrawer>
    </div>
  )
}
