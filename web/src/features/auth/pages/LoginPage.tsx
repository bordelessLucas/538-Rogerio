import { Eye, EyeOff } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { registerDemoAdmin } from '@/features/auth/services/authService'
import { BrandLogo } from '@/shared/ui'
import { APP_VERSION } from '@/shared/utils'

const DEMO_EMAIL = 'admin@r20noc.com'
const DEMO_PASSWORD = 'R20noc@2026'

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'

  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreatingDemo, setIsCreatingDemo] = useState(false)

  if (!isLoading && isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao autenticar'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCreateDemo() {
    setError(null)
    setIsCreatingDemo(true)

    try {
      await registerDemoAdmin(DEMO_EMAIL, DEMO_PASSWORD, 'Admin R20 NOC')
      navigate('/', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao criar usuário demo'
      if (message.includes('email-already-in-use')) {
        setError('Usuário demo já existe. Use o botão Entrar.')
      } else {
        setError(message)
      }
    } finally {
      setIsCreatingDemo(false)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[var(--bg-base)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(56,189,248,0.16),transparent_45%),radial-gradient(ellipse_at_90%_100%,rgba(34,197,94,0.08),transparent_40%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center gap-10 px-4 py-10 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        <section className="max-w-xl flex-1">
          <BrandLogo markClassName="size-14 rounded-2xl" className="mb-8 gap-4" />
          <p className="text-xs font-semibold tracking-[0.28em] text-[var(--accent)] uppercase">
            Command Deck
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--text-primary)] md:text-5xl">
            Operação FTTH
            <span className="block text-[var(--accent)]">com clareza de NOC</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-[var(--text-muted)]">
            Dashboard, mapa, cadastro e monitoramento em um painel feito para a sala de
            operação — não para planilha.
          </p>
          <ul className="mt-8 grid max-w-md grid-cols-2 gap-3 text-sm text-[var(--text-muted)]">
            <li className="rounded-lg border border-[var(--border)] bg-[var(--bg-panel)]/70 px-3 py-2">
              Status ao vivo
            </li>
            <li className="rounded-lg border border-[var(--border)] bg-[var(--bg-panel)]/70 px-3 py-2">
              Mapa da rede
            </li>
            <li className="rounded-lg border border-[var(--border)] bg-[var(--bg-panel)]/70 px-3 py-2">
              Hierarquia OLT→Cliente
            </li>
            <li className="rounded-lg border border-[var(--border)] bg-[var(--bg-panel)]/70 px-3 py-2">
              Feed de alarmes
            </li>
          </ul>
        </section>

        <section className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-panel)]/90 p-7 shadow-[var(--shadow-panel)] backdrop-blur">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Entrar no painel</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Use as credenciais de demonstração da R20.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium tracking-wide text-[var(--text-muted)] uppercase">
                E-mail
              </span>
              <input
                className="r20-input font-mono-metric"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium tracking-wide text-[var(--text-muted)] uppercase">
                Senha
              </span>
              <div className="relative">
                <input
                  className="r20-input pr-11"
                  type={isPasswordVisible ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                  aria-label={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-[var(--text-muted)] transition hover:bg-white/5 hover:text-[var(--text-primary)]"
                >
                  {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error ? (
              <p className="rounded-lg border border-[var(--status-offline)]/40 bg-[var(--status-offline)]/10 px-3 py-2 text-sm text-[var(--status-offline)]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="r20-btn r20-btn-primary w-full py-2.5 disabled:opacity-60"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleCreateDemo}
            disabled={isCreatingDemo}
            className="r20-btn r20-btn-ghost mt-3 w-full py-2.5 disabled:opacity-60"
          >
            {isCreatingDemo ? 'Criando usuário demo...' : 'Criar usuário demo (primeira vez)'}
          </button>

          <p className="mt-6 text-center font-mono-metric text-[11px] text-[var(--text-muted)]">
            Demo: {DEMO_EMAIL}
            <br />
            <Link className="text-[var(--accent)]" to="/">
              {APP_VERSION}
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
