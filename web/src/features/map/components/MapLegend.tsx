import { FUTURE_MAP_LAYERS } from '@/features/map/domain/mapTypes'
import { STATUS_HEX, TYPE_LABEL } from '@/features/map/constants'
import { STATUS_LABEL } from '@/shared/utils'

export function MapLegend() {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--bg-panel)] p-3 shadow-[0_8px_28px_rgba(0,0,0,0.55)]">
      <h3 className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--text-muted)] uppercase">
        Legenda
      </h3>

      <div className="mb-3 space-y-1.5">
        <p className="text-[11px] text-[var(--text-muted)]">Tipos</p>
        <ul className="space-y-1 text-sm">
          <li className="flex items-center gap-2">
            <span className="inline-block size-3 rounded-[4px] bg-[var(--accent)]" />
            {TYPE_LABEL.client} (casa)
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block size-3 rounded-full bg-[var(--accent)]" />
            {TYPE_LABEL.cto} (círculo)
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block size-3 rotate-45 rounded-[2px] bg-[var(--accent)]" />
            {TYPE_LABEL.olt} (losango)
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block size-3.5 rounded-[3px] bg-[var(--accent)]" />
            {TYPE_LABEL.pop} (prédio)
          </li>
        </ul>
      </div>

      <div className="mb-3 space-y-1.5 border-t border-[var(--border)] pt-3">
        <p className="text-[11px] text-[var(--text-muted)]">Status</p>
        <ul className="space-y-1 text-sm">
          {(Object.keys(STATUS_LABEL) as Array<keyof typeof STATUS_LABEL>).map((key) => (
            <li key={key} className="flex items-center gap-2">
              <span className="inline-block size-2.5 rounded-full" style={{ background: STATUS_HEX[key] }} />
              {STATUS_LABEL[key]}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[var(--border)] pt-3">
        <p className="mb-1.5 text-[11px] text-[var(--text-muted)]">Camadas futuras</p>
        <ul className="space-y-1 text-xs text-[var(--text-muted)]">
          {FUTURE_MAP_LAYERS.map((layer) => (
            <li key={layer} className="flex items-center gap-2 opacity-60">
              <input type="checkbox" disabled className="accent-[var(--accent)]" />
              {layer}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
