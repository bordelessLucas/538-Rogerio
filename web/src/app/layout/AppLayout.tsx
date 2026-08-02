import {
  Activity,
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
import { BrandLogo } from '@/shared/ui'
import { APP_VERSION, cn } from '@/shared/utils'

const navItems = [
  { to: '/', label: 'Dashboard NOC', icon: LayoutDashboard, end: true },
  { to: '/mapa', label: 'Mapa Inteligente', icon: Map },
  { to: '/rede', label: 'Cadastro de Rede', icon: Network },
  { to: '/monitoramento', label: 'Monitoramento', icon: Activity },
  { to: '/chamados', label: 'Chamados', icon: Ticket },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

function breadcrumbFromPath(pathname: string) {
  if (pathname === '/') return 'Dashboard NOC'
  if (pathname.startsWith('/mapa')) return 'Mapa Inteligente'
  if (pathname.startsWith('/monitoramento')) return 'Monitoramento'
  if (pathname.startsWith('/chamados')) return 'Chamados'
  if (pathname.startsWith('/configuracoes')) return 'Configurações'

  if (pathname.startsWith('/rede')) {
    if (pathname.includes('/ctos/') && pathname !== '/rede/ctos') return 'Rede · Detalhe CTO'
    if (pathname.includes('/clientes/') && pathname !== '/rede/clientes') {
      return 'Rede · Detalhe Cliente'
    }
    if (pathname.startsWith('/rede/olts')) return 'Rede · OLTs'
    if (pathname.startsWith('/rede/pons')) return 'Rede · PONs'
    if (pathname.startsWith('/rede/ctos')) return 'Rede · CTOs'
    if (pathname.startsWith('/rede/clientes')) return 'Rede · Clientes'
    return 'Cadastro de Rede'
  }

  const item = navItems.find((entry) => entry.to !== '/' && pathname.startsWith(entry.to))
  return item?.label ?? 'R20 NOC'
}

export function AppLayout() {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const isMapRoute = location.pathname.startsWith('/mapa')

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className={cn('flex', isMapRoute ? 'h-screen overflow-hidden' : 'min-h-screen')}>
        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-30 bg-black/55 backdrop-blur-[2px] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 flex w-[17.5rem] flex-col border-r border-[var(--border)] bg-[var(--bg-panel)] transition-transform lg:static lg:translate-x-0',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4">
            <BrandLogo />
            <button
              type="button"
              className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/5 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 space-y-0.5 p-3">
            <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-[var(--text-muted)] uppercase">
              Operação
            </p>
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
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition',
                      isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? (
                        <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[var(--accent)]" />
                      ) : null}
                      <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-80'} />
                      <span className="flex-1 font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          <div className="border-t border-[var(--border)] p-4">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-3 py-2.5">
              <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
                Command Deck
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Protótipo FTTH · {APP_VERSION}
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg-base)]/85 px-4 py-3 backdrop-blur-md md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-lg border border-[var(--border)] p-2 text-[var(--text-muted)] hover:bg-white/5 lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={18} />
              </button>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-[var(--text-muted)] uppercase">
                  Painel operacional
                </p>
                <h2 className="text-sm font-semibold tracking-tight md:text-base">
                  {breadcrumbFromPath(location.pathname)}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-panel)] px-2.5 py-1.5 sm:flex">
                <span className="r20-live-dot size-1.5 rounded-full bg-[var(--status-online)]" />
                <span className="text-[11px] text-[var(--text-muted)]">AO VIVO</span>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{profile?.displayName ?? 'Usuário'}</p>
                <p className="font-mono-metric text-[11px] text-[var(--text-muted)]">
                  {(profile?.role ?? 'noc').toUpperCase()} · sessão ativa
                </p>
              </div>
              <button
                type="button"
                onClick={() => void signOut()}
                className="r20-btn r20-btn-ghost"
              >
                Sair
              </button>
            </div>
          </header>

          <main
            className={cn(
              'min-h-0 flex-1',
              isMapRoute ? 'relative overflow-hidden p-0' : 'px-4 py-6 md:px-6',
            )}
          >
            <Outlet />
          </main>

          {isMapRoute ? null : (
            <footer className="border-t border-[var(--border)] px-4 py-3 text-center text-xs text-[var(--text-muted)] md:px-6">
              <span className="text-[var(--text-primary)]">R20 NOC</span>
              {' · '}
              {APP_VERSION}
              {' · '}
              Visão operacional da rede FTTH
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}
