import { matchPath, NavLink, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/shared/utils'

const tabs = [
  { to: '/rede', label: 'Visão geral', end: true },
  { to: '/rede/olts', label: 'OLTs' },
  { to: '/rede/pons', label: 'PONs' },
  { to: '/rede/ctos', label: 'CTOs' },
  { to: '/rede/clientes', label: 'Clientes' },
]

export function NetworkLayout() {
  const { pathname } = useLocation()
  const isDetailRoute = Boolean(
    matchPath('/rede/ctos/:id', pathname) || matchPath('/rede/clientes/:id', pathname),
  )

  return (
    <div className="space-y-5">
      {isDetailRoute ? null : (
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
            Inventário
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            Cadastro de Rede
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Hierarquia OLT → PON → CTO → Cliente com associações e CRUD.
          </p>
        </div>
      )}

      {isDetailRoute ? null : (
        <div className="flex flex-wrap gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] p-1.5 shadow-[var(--shadow-panel)]">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]',
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      )}

      <Outlet />
    </div>
  )
}
