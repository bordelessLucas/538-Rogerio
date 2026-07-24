import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { registerDemoAdmin } from '@/features/auth/services/authService'
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-base)] px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(34,197,94,0.08),_transparent_50%)]" />
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-panel)]/90 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-[var(--accent)] uppercase">
            R20 Telecom
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">R20 NOC</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Plataforma operacional para provedores FTTH
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-1.5">
            <span className="text-sm text-[var(--text-muted)]">E-mail</span>
            <input
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-[var(--text-primary)] outline-none ring-[var(--accent)] focus:ring-2"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm text-[var(--text-muted)]">Senha</span>
            <input
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-[var(--text-primary)] outline-none ring-[var(--accent)] focus:ring-2"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error ? (
            <p className="rounded-lg border border-[var(--status-offline)]/40 bg-[var(--status-offline)]/10 px-3 py-2 text-sm text-[var(--status-offline)]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 font-medium text-slate-950 transition hover:brightness-110 disabled:opacity-60"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleCreateDemo}
          disabled={isCreatingDemo}
          className="mt-3 w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text-primary)] disabled:opacity-60"
        >
          {isCreatingDemo ? 'Criando usuário demo...' : 'Criar usuário demo (primeira vez)'}
        </button>

        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
          <br />
          <Link className="text-[var(--accent)]" to="/">
            {APP_VERSION}
          </Link>
        </p>
      </div>
    </div>
  )
}
