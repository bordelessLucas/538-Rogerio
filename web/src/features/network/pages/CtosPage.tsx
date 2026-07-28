import { useState } from 'react'
import { FormDrawer } from '@/features/network/components/FormDrawer'
import {
  EmptyState,
  EntityActions,
  ListToolbar,
  OccupancyBadge,
  PaginationBar,
} from '@/features/network/components/ListChrome'
import { CtoForm } from '@/features/network/components/CtoForm'
import type { CtoFormValues } from '@/features/network/domain/schemas'
import { useCtos, useOlts, usePons } from '@/features/network/hooks/useNetworkCollections'
import {
  createCto,
  deleteCto,
  updateCto,
} from '@/features/network/services/networkService'
import { matchesQuery, paginate } from '@/features/network/utils/list'
import { CardShell, StatusBadge } from '@/shared/ui'
import { useToast } from '@/shared/ui/Toast'
import { STATUS_LABEL } from '@/shared/utils'
import type { Cto } from '@/shared/types/network'

export function CtosPage() {
  const { pushToast } = useToast()
  const { items: ctos, isLoading, error } = useCtos()
  const { items: olts } = useOlts()
  const { items: pons } = usePons()
  const [search, setSearch] = useState('')
  const [oltFilter, setOltFilter] = useState('all')
  const [ponFilter, setPonFilter] = useState('all')
  const [occupancyFilter, setOccupancyFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Cto | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filtered = ctos.filter((cto) => {
    const matchesSearch =
      matchesQuery(cto.name, search) || matchesQuery(cto.code, search)
    const matchesOlt = oltFilter === 'all' || cto.oltId === oltFilter
    const matchesPon = ponFilter === 'all' || cto.ponId === ponFilter
    const matchesOccupancy =
      occupancyFilter === 'all' ||
      (occupancyFilter === 'low' && cto.occupancyPercent <= 60) ||
      (occupancyFilter === 'mid' &&
        cto.occupancyPercent > 60 &&
        cto.occupancyPercent <= 80) ||
      (occupancyFilter === 'high' && cto.occupancyPercent > 80)
    return matchesSearch && matchesOlt && matchesPon && matchesOccupancy
  })
  const paged = paginate(filtered, page, 10)
  const oltName = (id: string) => olts.find((olt) => olt.id === id)?.name ?? '—'
  const ponName = (id: string) => pons.find((pon) => pon.id === id)?.name ?? '—'
  const ponsForFilter =
    oltFilter === 'all' ? pons : pons.filter((pon) => pon.oltId === oltFilter)

  async function handleSubmit(values: CtoFormValues) {
    setIsSubmitting(true)
    try {
      if (editing) {
        await updateCto(editing.id, values)
        pushToast('CTO atualizada', 'success')
      } else {
        await createCto(values)
        pushToast('CTO cadastrada — aparece no mapa se tiver lat/lng', 'success')
      }
      setDrawerOpen(false)
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao salvar CTO', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(cto: Cto) {
    if (!window.confirm(`Excluir ${cto.name}?`)) return
    try {
      await deleteCto(cto.id)
      pushToast('CTO excluída', 'success')
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao excluir CTO', 'error')
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
        placeholder="Buscar CTO ou código..."
        onCreate={() => {
          setEditing(null)
          setDrawerOpen(true)
        }}
        createLabel="+ Nova CTO"
        filters={
          <div className="flex flex-wrap gap-2">
            <select
              value={oltFilter}
              onChange={(e) => {
                setOltFilter(e.target.value)
                setPonFilter('all')
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
            <select
              value={ponFilter}
              onChange={(e) => {
                setPonFilter(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            >
              <option value="all">Todas PONs</option>
              {ponsForFilter.map((pon) => (
                <option key={pon.id} value={pon.id}>
                  {pon.name}
                </option>
              ))}
            </select>
            <select
              value={occupancyFilter}
              onChange={(e) => {
                setOccupancyFilter(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            >
              <option value="all">Toda lotação</option>
              <option value="low">≤ 60%</option>
              <option value="mid">60–80%</option>
              <option value="high">&gt; 80%</option>
            </select>
          </div>
        }
      />

      {error ? <p className="text-sm text-[var(--status-offline)]">{error.message}</p> : null}

      {isLoading ? (
        <CardShell>
          <p className="text-sm text-[var(--text-muted)]">Carregando CTOs...</p>
        </CardShell>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma CTO encontrada"
          description="Cadastre a primeira CTO associada a OLT + PON."
          actionLabel="Cadastrar primeira CTO"
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
                  <th className="px-3 py-2 font-medium">Código</th>
                  <th className="px-3 py-2 font-medium">OLT / PON</th>
                  <th className="px-3 py-2 font-medium">Portas</th>
                  <th className="px-3 py-2 font-medium">Lotação</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paged.items.map((cto) => (
                  <tr key={cto.id} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2">{cto.name}</td>
                    <td className="px-3 py-2">{cto.code}</td>
                    <td className="px-3 py-2">
                      {oltName(cto.oltId)} / {ponName(cto.ponId)}
                    </td>
                    <td className="px-3 py-2">
                      {cto.occupiedPorts}/{cto.capacity} · livres {cto.freePorts}
                    </td>
                    <td className="px-3 py-2">
                      <OccupancyBadge percent={cto.occupancyPercent} />
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge label={STATUS_LABEL[cto.status]} tone={cto.status} />
                    </td>
                    <td className="px-3 py-2">
                      <EntityActions
                        onEdit={() => {
                          setEditing(cto)
                          setDrawerOpen(true)
                        }}
                        onDelete={() => void handleDelete(cto)}
                        mapQuery={cto.name}
                        detailsTo="/rede/ctos"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {paged.items.map((cto) => (
              <CardShell key={cto.id} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{cto.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{cto.code}</p>
                  </div>
                  <OccupancyBadge percent={cto.occupancyPercent} />
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  {oltName(cto.oltId)} · {ponName(cto.ponId)} · {cto.occupiedPorts}/
                  {cto.capacity}
                </p>
                <EntityActions
                  onEdit={() => {
                    setEditing(cto)
                    setDrawerOpen(true)
                  }}
                  onDelete={() => void handleDelete(cto)}
                  mapQuery={cto.name}
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
        title={editing ? 'Editar CTO' : 'Nova CTO'}
        onClose={() => setDrawerOpen(false)}
      >
        <CtoForm
          key={editing?.id ?? 'new'}
          initial={editing}
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
