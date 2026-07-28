import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/shared/utils'

const tabs = [
  { to: '/rede', label: 'Visão geral', end: true },
  { to: '/rede/olts', label: 'OLTs' },
  { to: '/rede/pons', label: 'PONs' },
  { to: '/rede/ctos', label: 'CTOs' },
  { to: '/rede/clientes', label: 'Clientes' },
]

export function NetworkLayout() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Cadastro de Rede</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Hierarquia OLT → PON → CTO → Cliente com associações e CRUD.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-3">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                'rounded-lg px-3 py-1.5 text-sm transition',
                isActive
                  ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:bg-white/5',
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  )
}
