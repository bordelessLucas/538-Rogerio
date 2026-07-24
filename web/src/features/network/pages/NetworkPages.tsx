import { CardShell } from '@/shared/ui'

export function NetworkOverviewPage() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {['OLTs', 'PONs', 'CTOs', 'Clientes'].map((item) => (
        <CardShell key={item}>
          <p className="text-sm text-[var(--text-muted)]">{item}</p>
          <p className="mt-2 text-2xl font-semibold">—</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Seed / Dia 04</p>
        </CardShell>
      ))}
    </div>
  )
}

export function NetworkEntityPage({ entity }: { entity: string }) {
  return (
    <CardShell>
      <h2 className="font-medium">Listagem de {entity}</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Rota e tipos prontos. Formulários e tabela chegam no Dia 04.
      </p>
    </CardShell>
  )
}
