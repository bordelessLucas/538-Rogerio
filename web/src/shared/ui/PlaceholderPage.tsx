import { Link, useSearchParams } from 'react-router-dom'
import { CardShell } from '@/shared/ui'

export function PlaceholderPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  const [params] = useSearchParams()
  const ctoId = params.get('ctoId')
  const clientId = params.get('clientId')

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
      </div>
      <CardShell>
        <p className="text-sm text-[var(--text-muted)]">
          Módulo no menu — implementação detalhada na Fase 1 (próximos 60–90 dias).
        </p>
        {ctoId || clientId ? (
          <p className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm">
            Contexto recebido:{' '}
            {ctoId ? (
              <span className="font-medium text-[var(--accent)]">ctoId={ctoId}</span>
            ) : null}
            {clientId ? (
              <span className="font-medium text-[var(--accent)]">clientId={clientId}</span>
            ) : null}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/monitoramento"
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:border-[var(--accent)]"
          >
            Monitoramento
          </Link>
          <Link
            to="/rede"
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:border-[var(--accent)]"
          >
            Cadastro de Rede
          </Link>
        </div>
      </CardShell>
    </div>
  )
}
