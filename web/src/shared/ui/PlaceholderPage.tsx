import { CardShell } from '@/shared/ui'

export function PlaceholderPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
      </div>
      <CardShell>
        <p className="text-sm text-[var(--text-muted)]">
          Módulo estruturado no menu. Implementação detalhada nas próximas sprints do plano.
        </p>
      </CardShell>
    </div>
  )
}
