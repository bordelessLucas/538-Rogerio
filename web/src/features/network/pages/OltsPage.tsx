import { useState } from 'react'
import { FormDrawer } from '@/features/network/components/FormDrawer'
import {
  EmptyState,
  EntityActions,
  ListToolbar,
  PaginationBar,
} from '@/features/network/components/ListChrome'
import { OltForm } from '@/features/network/components/OltForm'
import type { OltFormValues } from '@/features/network/domain/schemas'
import { useOlts, usePops } from '@/features/network/hooks/useNetworkCollections'
import {
  createOlt,
  deleteOlt,
  updateOlt,
} from '@/features/network/services/networkService'
import { matchesQuery, paginate } from '@/features/network/utils/list'
import { CardShell, StatusBadge } from '@/shared/ui'
import { useToast } from '@/shared/ui/Toast'
import { STATUS_LABEL } from '@/shared/utils'
import type { Olt } from '@/shared/types/network'

export function OltsPage() {
  const { pushToast } = useToast()
  const { items: olts, isLoading, error } = useOlts()
  const { items: pops } = usePops()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Olt | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filtered = olts.filter((olt) => {
    const matchesSearch =
      matchesQuery(olt.name, search) ||
      matchesQuery(olt.ip, search) ||
      matchesQuery(olt.vendor, search)
    const matchesStatus = statusFilter === 'all' || olt.status === statusFilter
    return matchesSearch && matchesStatus
  })
  const paged = paginate(filtered, page, 10)

  function openCreate() {
    setEditing(null)
    setDrawerOpen(true)
  }

  function openEdit(olt: Olt) {
    setEditing(olt)
    setDrawerOpen(true)
  }

  async function handleSubmit(values: OltFormValues) {
    setIsSubmitting(true)
    try {
      if (editing) {
        await updateOlt(editing.id, values)
        pushToast('OLT atualizada', 'success')
      } else {
        await createOlt(values)
        pushToast('OLT cadastrada', 'success')
      }
      setDrawerOpen(false)
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao salvar OLT', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(olt: Olt) {
    if (!window.confirm(`Excluir ${olt.name}?`)) return
    try {
      await deleteOlt(olt.id)
      pushToast('OLT excluída', 'success')
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao excluir OLT', 'error')
    }
  }

  const popName = (popId: string) => pops.find((pop) => pop.id === popId)?.name ?? '—'

  return (
    <div className="space-y-4">
      <ListToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        placeholder="Buscar OLT, IP, vendor..."
        onCreate={openCreate}
        createLabel="+ Nova OLT"
        filters={
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
        }
      />

      {error ? (
        <p className="text-sm text-[var(--status-offline)]">{error.message}</p>
      ) : null}

      {isLoading ? (
        <CardShell>
          <p className="text-sm text-[var(--text-muted)]">Carregando OLTs...</p>
        </CardShell>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma OLT encontrada"
          description="Cadastre a primeira OLT para montar a hierarquia da rede."
          actionLabel="Cadastrar primeira OLT"
          onAction={openCreate}
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-[var(--border)] md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)]">
                <tr>
                  <th className="px-3 py-2 font-medium">Nome</th>
                  <th className="px-3 py-2 font-medium">Vendor</th>
                  <th className="px-3 py-2 font-medium">IP</th>
                  <th className="px-3 py-2 font-medium">POP</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paged.items.map((olt) => (
                  <tr key={olt.id} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2">{olt.name}</td>
                    <td className="px-3 py-2">{olt.vendor}</td>
                    <td className="px-3 py-2">{olt.ip}</td>
                    <td className="px-3 py-2">{popName(olt.popId)}</td>
                    <td className="px-3 py-2">
                      <StatusBadge label={STATUS_LABEL[olt.status]} tone={olt.status} />
                    </td>
                    <td className="px-3 py-2">
                      <EntityActions
                        onEdit={() => openEdit(olt)}
                        onDelete={() => void handleDelete(olt)}
                        mapQuery={olt.name}
                        detailsTo="/rede/olts"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {paged.items.map((olt) => (
              <CardShell key={olt.id} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{olt.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {olt.vendor} · {olt.ip}
                    </p>
                  </div>
                  <StatusBadge label={STATUS_LABEL[olt.status]} tone={olt.status} />
                </div>
                <p className="text-xs text-[var(--text-muted)]">POP: {popName(olt.popId)}</p>
                <EntityActions
                  onEdit={() => openEdit(olt)}
                  onDelete={() => void handleDelete(olt)}
                  mapQuery={olt.name}
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
        title={editing ? 'Editar OLT' : 'Nova OLT'}
        onClose={() => setDrawerOpen(false)}
      >
        <OltForm
          key={editing?.id ?? 'new'}
          initial={editing}
          pops={pops}
          isSubmitting={isSubmitting}
          onCancel={() => setDrawerOpen(false)}
          onSubmit={handleSubmit}
        />
      </FormDrawer>
    </div>
  )
}
