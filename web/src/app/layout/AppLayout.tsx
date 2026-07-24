import {
  Activity,
  Boxes,
  LayoutDashboard,
  Map,
  Menu,
  Network,
  Settings,
  Ticket,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { APP_VERSION, cn } from '@/shared/utils'

const navItems = [
  { to: '/', label: 'Dashboard NOC', icon: LayoutDashboard, end: true },
  { to: '/mapa', label: 'Mapa Inteligente', icon: Map },
  { to: '/rede', label: 'Cadastro de Rede', icon: Network },
  { to: '/monitoramento', label: 'Monitoramento', icon: Activity },
  { to: '/chamados', label: 'Chamados', icon: Ticket, soon: true },
  { to: '/configuracoes', label: 'Configurações', icon: Settings, soon: true },
]

function breadcrumbFromPath(pathname: string) {
  if (pathname === '/') return 'Dashboard NOC'
  const item = navItems.find((entry) => entry.to !== '/' && pathname.startsWith(entry.to))
  return item?.label ?? 'R20 NOC'
}

export function AppLayout() {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="flex min-h-screen">
        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[var(--border)] bg-[var(--bg-panel)] transition-transform lg:static lg:translate-x-0',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em] text-[var(--accent)] uppercase">
                R20 Telecom
              </p>
              <h1 className="text-lg font-semibold">R20 NOC</h1>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/5 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition',
                      isActive
                        ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                        : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)]',
                    )
                  }
                >
                  <Icon size={18} />
                  <span className="flex-1">{item.label}</span>
                  {item.soon ? (
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase">
                      Em breve
                    </span>
                  ) : null}
                </NavLink>
              )
            })}
          </nav>

          <div className="border-t border-[var(--border)] p-4 text-xs text-[var(--text-muted)]">
            <div className="mb-2 flex items-center gap-2">
              <Boxes size={14} />
              Protótipo FTTH
            </div>
            <p>{APP_VERSION}</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg-base)]/90 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-lg border border-[var(--border)] p-2 text-[var(--text-muted)] hover:bg-white/5 lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={18} />
              </button>
              <div>
                <p className="text-xs text-[var(--text-muted)]">Painel operacional</p>
                <h2 className="text-sm font-medium md:text-base">
                  {breadcrumbFromPath(location.pathname)}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{profile?.displayName ?? 'Usuário'}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {profile?.role?.toUpperCase() ?? 'NOC'} · sessão ativa
                </p>
              </div>
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-muted)] transition hover:border-[var(--status-offline)] hover:text-[var(--status-offline)]"
              >
                Sair
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-6">
            <Outlet />
          </main>

          <footer className="border-t border-[var(--border)] px-4 py-3 text-center text-xs text-[var(--text-muted)] md:px-6">
            R20 NOC · {APP_VERSION} · Visão operacional da rede FTTH
          </footer>
        </div>
      </div>
    </div>
  )
}
