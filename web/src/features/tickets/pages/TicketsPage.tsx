import { useDeferredValue, useEffect, useState, type FormEvent } from 'react'
import { AlertTriangle, CheckCircle2, Clock3, Plus, Search, TicketCheck, X } from 'lucide-react'
import { CardShell, ListSkeleton, StatusBadge } from '@/shared/ui'
import { useToast } from '@/shared/ui/Toast'
import type { Ticket } from '@/shared/types/network'
import { changeTicketStatus, createTicket, subscribeTickets } from '@/features/tickets/services/ticketService'

const statusLabel = { open: 'Aberto', in_progress: 'Em atendimento', closed: 'Resolvido' }
const priorityLabel = { low: 'Baixa', medium: 'Média', high: 'Alta' }
const priorityTone = { low: 'neutral', medium: 'warn', high: 'offline' } as const

function ageLabel(date: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - Date.parse(date)) / 60_000))
  if (minutes < 60) return `${minutes} min`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`
  return `${Math.floor(minutes / 1440)}d`
}

export function TicketsPage() {
  const { pushToast } = useToast()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [status, setStatus] = useState<'all' | Ticket['status']>('all')
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => subscribeTickets(
    (items) => { setTickets(items); setLoading(false) },
    (reason) => { setError(reason.message); setLoading(false) },
  ), [])

  const normalized = deferredQuery.trim().toLowerCase()
  const visible = tickets.filter((ticket) =>
    (status === 'all' || ticket.status === status) &&
    (!normalized || `${ticket.title} ${ticket.description ?? ''}`.toLowerCase().includes(normalized)),
  )
  const openCount = tickets.filter((item) => item.status === 'open').length
  const activeCount = tickets.filter((item) => item.status === 'in_progress').length
  const criticalCount = tickets.filter((item) => item.priority === 'high' && item.status !== 'closed').length

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSaving(true)
    try {
      await createTicket({
        title: String(data.get('title')),
        description: String(data.get('description')),
        priority: String(data.get('priority')) as Ticket['priority'],
        category: String(data.get('category')) as NonNullable<Ticket['category']>,
      })
      setCreating(false)
      pushToast('Chamado aberto com sucesso', 'success')
    } catch (reason) {
      pushToast(reason instanceof Error ? reason.message : 'Falha ao abrir chamado', 'error')
    } finally { setSaving(false) }
  }

  async function advance(ticket: Ticket) {
    const next = ticket.status === 'open' ? 'in_progress' : 'closed'
    try {
      await changeTicketStatus(ticket.id, next)
      pushToast(next === 'closed' ? 'Chamado resolvido' : 'Atendimento iniciado', 'success')
    } catch (reason) {
      pushToast(reason instanceof Error ? reason.message : 'Falha ao atualizar chamado', 'error')
    }
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-semibold tracking-[.18em] text-[var(--accent)] uppercase">Service desk · fila ao vivo</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Chamados</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Triagem, atendimento e resolução da operação FTTH em um só fluxo.</p>
        </div>
        <button type="button" className="r20-btn r20-btn-primary" onClick={() => setCreating(true)}><Plus size={16} /> Novo chamado</button>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Aguardando triagem', value: openCount, icon: Clock3, color: 'var(--status-alert)' },
          { label: 'Em atendimento', value: activeCount, icon: TicketCheck, color: 'var(--accent)' },
          { label: 'Alta prioridade', value: criticalCount, icon: AlertTriangle, color: 'var(--status-offline)' },
        ].map(({ label, value, icon: Icon, color }) => (
          <CardShell key={label} className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-0.5" style={{ background: color }} />
            <div className="flex items-center justify-between"><p className="text-xs text-[var(--text-muted)]">{label}</p><Icon size={17} style={{ color }} /></div>
            <p className="font-mono-metric mt-3 text-3xl font-semibold">{value}</p>
          </CardShell>
        ))}
      </section>

      <CardShell className="p-0! overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 md:flex-row md:items-center">
          <label className="relative min-w-0 flex-1"><Search className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-muted)]" size={16} /><input className="r20-input pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por assunto ou descrição" /></label>
          <div className="flex gap-1 overflow-x-auto">
            {(['all', 'open', 'in_progress', 'closed'] as const).map((value) => <button key={value} type="button" onClick={() => setStatus(value)} className={`r20-btn whitespace-nowrap ${status === value ? 'r20-btn-primary' : 'r20-btn-ghost'}`}>{value === 'all' ? 'Todos' : statusLabel[value]}</button>)}
          </div>
        </div>
        {loading ? <div className="p-4"><ListSkeleton rows={5} /></div> : error ? <p className="p-8 text-center text-sm text-[var(--status-offline)]">{error}</p> : visible.length === 0 ? <div className="p-12 text-center"><CheckCircle2 className="mx-auto text-[var(--status-online)]" /><p className="mt-3 font-medium">Fila limpa por aqui</p><p className="mt-1 text-sm text-[var(--text-muted)]">Nenhum chamado corresponde aos filtros.</p></div> : (
          <div className="divide-y divide-[var(--border)]">
            {visible.map((ticket) => <article key={ticket.id} className="group grid gap-3 p-4 transition hover:bg-white/[.025] md:grid-cols-[minmax(0,1fr)_140px_150px] md:items-center">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><StatusBadge label={priorityLabel[ticket.priority]} tone={priorityTone[ticket.priority]} /><span className="font-mono-metric text-[10px] text-[var(--text-muted)]">#{ticket.id.slice(0, 6).toUpperCase()}</span></div><h3 className="mt-2 truncate text-sm font-semibold">{ticket.title}</h3><p className="mt-1 line-clamp-1 text-xs text-[var(--text-muted)]">{ticket.description || 'Sem descrição adicional'} · aberto há {ageLabel(ticket.createdAt)}</p></div>
              <StatusBadge label={statusLabel[ticket.status]} tone={ticket.status === 'closed' ? 'online' : ticket.status === 'in_progress' ? 'alert' : 'neutral'} />
              <div className="md:text-right">{ticket.status === 'closed' ? <span className="text-xs text-[var(--status-online)]">Concluído</span> : <button type="button" className="r20-btn r20-btn-ghost" onClick={() => void advance(ticket)}>{ticket.status === 'open' ? 'Assumir' : 'Resolver'}</button>}</div>
            </article>)}
          </div>
        )}
      </CardShell>

      {creating ? <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-4" role="dialog" aria-modal="true"><form onSubmit={(event) => void handleCreate(event)} className="w-full max-w-xl rounded-t-2xl border border-[var(--border)] bg-[var(--bg-panel)] shadow-2xl md:rounded-2xl"><div className="flex items-center justify-between border-b border-[var(--border)] p-5"><div><p className="text-[10px] tracking-[.16em] text-[var(--accent)] uppercase">Nova ocorrência</p><h2 className="mt-1 text-xl font-semibold">Abrir chamado</h2></div><button type="button" className="rounded-lg p-2 hover:bg-white/5" onClick={() => setCreating(false)} aria-label="Fechar"><X size={18} /></button></div><div className="grid gap-4 p-5"><label className="text-sm">Assunto<input required minLength={5} name="title" className="r20-input mt-1.5" placeholder="Ex.: Cliente sem conexão" /></label><label className="text-sm">Descrição<textarea required name="description" rows={4} className="r20-input mt-1.5 resize-none" placeholder="Descreva os sintomas e testes realizados" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm">Prioridade<select name="priority" className="r20-input mt-1.5"><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option></select></label><label className="text-sm">Categoria<select name="category" className="r20-input mt-1.5"><option value="connection">Conexão</option><option value="signal">Sinal</option><option value="equipment">Equipamento</option><option value="other">Outro</option></select></label></div></div><div className="flex justify-end gap-2 border-t border-[var(--border)] p-4"><button type="button" className="r20-btn r20-btn-ghost" onClick={() => setCreating(false)}>Cancelar</button><button disabled={saving} className="r20-btn r20-btn-primary disabled:opacity-50">{saving ? 'Abrindo...' : 'Abrir chamado'}</button></div></form></div> : null}
    </div>
  )
}
