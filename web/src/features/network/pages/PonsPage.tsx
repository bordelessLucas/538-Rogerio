import { useState } from 'react'
import { FormDrawer } from '@/features/network/components/FormDrawer'
import {
  EmptyState,
  EntityActions,
  ListToolbar,
  PaginationBar,
} from '@/features/network/components/ListChrome'
import { PonForm } from '@/features/network/components/PonForm'
import type { PonFormValues } from '@/features/network/domain/schemas'
import { useOlts, usePons } from '@/features/network/hooks/useNetworkCollections'
import {
  createPon,
  deletePon,
  updatePon,
} from '@/features/network/services/networkService'
import { matchesQuery, paginate } from '@/features/network/utils/list'
import { CardShell, StatusBadge } from '@/shared/ui'
import { useToast } from '@/shared/ui/Toast'
import { STATUS_LABEL } from '@/shared/utils'
import type { Pon } from '@/shared/types/network'

export function PonsPage() {
  const { pushToast } = useToast()
  const { items: pons, isLoading, error } = usePons()
  const { items: olts } = useOlts()
  const [search, setSearch] = useState('')
  const [oltFilter, setOltFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Pon | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filtered = pons.filter((pon) => {
    const matchesSearch = matchesQuery(pon.name, search)
    const matchesOlt = oltFilter === 'all' || pon.oltId === oltFilter
    return matchesSearch && matchesOlt
  })
  const paged = paginate(filtered, page, 10)
  const oltName = (id: string) => olts.find((olt) => olt.id === id)?.name ?? '—'

  async function handleSubmit(values: PonFormValues) {
    setIsSubmitting(true)
    try {
      if (editing) {
        await updatePon(editing.id, values)
        pushToast('PON atualizada', 'success')
      } else {
        await createPon(values)
        pushToast('PON cadastrada', 'success')
      }
      setDrawerOpen(false)
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao salvar PON', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(pon: Pon) {
    if (!window.confirm(`Excluir ${pon.name}?`)) return
    try {
      await deletePon(pon.id)
      pushToast('PON excluída', 'success')
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao excluir PON', 'error')
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
        placeholder="Buscar PON..."
        onCreate={() => {
          setEditing(null)
          setDrawerOpen(true)
        }}
        createLabel="+ Nova PON"
        filters={
          <select
            value={oltFilter}
            onChange={(e) => {
              setOltFilter(e.target.value)
              setPage(1)
            }}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
          >
            <option value="all">Todas OLTs</option>
            {olts.map((olt) => (
              <option key={olt.id} value={olt.id}>
                {olt.name}
              </option>
            ))}
          </select>
        }
      />

      {error ? <p className="text-sm text-[var(--status-offline)]">{error.message}</p> : null}

      {isLoading ? (
        <CardShell>
          <p className="text-sm text-[var(--text-muted)]">Carregando PONs...</p>
        </CardShell>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma PON encontrada"
          description="Cadastre a primeira PON vinculada a uma OLT."
          actionLabel="Cadastrar primeira PON"
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
                  <th className="px-3 py-2 font-medium">Porta</th>
                  <th className="px-3 py-2 font-medium">OLT</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paged.items.map((pon) => (
                  <tr key={pon.id} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2">{pon.name}</td>
                    <td className="px-3 py-2">{pon.port}</td>
                    <td className="px-3 py-2">{oltName(pon.oltId)}</td>
                    <td className="px-3 py-2">
                      <StatusBadge label={STATUS_LABEL[pon.status]} tone={pon.status} />
                    </td>
                    <td className="px-3 py-2">
                      <EntityActions
                        onEdit={() => {
                          setEditing(pon)
                          setDrawerOpen(true)
                        }}
                        onDelete={() => void handleDelete(pon)}
                        detailsTo="/rede/pons"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {paged.items.map((pon) => (
              <CardShell key={pon.id} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{pon.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Porta {pon.port} · {oltName(pon.oltId)}
                    </p>
                  </div>
                  <StatusBadge label={STATUS_LABEL[pon.status]} tone={pon.status} />
                </div>
                <EntityActions
                  onEdit={() => {
                    setEditing(pon)
                    setDrawerOpen(true)
                  }}
                  onDelete={() => void handleDelete(pon)}
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
        title={editing ? 'Editar PON' : 'Nova PON'}
        onClose={() => setDrawerOpen(false)}
      >
        <PonForm
          key={editing?.id ?? 'new'}
          initial={editing}
          olts={olts}
          isSubmitting={isSubmitting}
          onCancel={() => setDrawerOpen(false)}
          onSubmit={handleSubmit}
        />
      </FormDrawer>
    </div>
  )
}
