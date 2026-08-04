import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronsDown,
  CircleHelp,
  LayoutDashboard,
  Map,
  Network,
  Radio,
  Sparkles,
  X,
} from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { cn } from '@/shared/utils'

const ONBOARDING_VERSION = 'r20-onboarding-v1'

const steps = [
  {
    eyebrow: 'Bem-vindo ao seu turno',
    title: 'Veja a rede inteira. Entenda o que importa.',
    description:
      'O R20 NOC reúne saúde, localização e contexto técnico para você sair do alerta até a causa em poucos passos.',
    accent: 'Controle operacional',
  },
  {
    eyebrow: 'Seu ponto de partida',
    title: 'Comece pela saúde da operação.',
    description:
      'O Dashboard resume disponibilidade, clientes offline, sinal degradado e chamados. Um desvio vira um caminho de investigação.',
    accent: 'Dashboard NOC',
  },
  {
    eyebrow: 'Do alerta ao território',
    title: 'Cruze evento, ativo e localização.',
    description:
      'O Monitoramento mostra o que mudou. O Mapa revela onde. Os detalhes explicam a hierarquia e o impacto.',
    accent: 'Diagnóstico conectado',
  },
  {
    eyebrow: 'Modelo mental da rede',
    title: 'A hierarquia mantém tudo no contexto.',
    description:
      'Cada cliente está ligado a uma CTO, uma PON e uma OLT. Navegue pelos vínculos para localizar falhas e capacidade disponível.',
    accent: 'POP / OLT / PON / CTO / Cliente',
  },
  {
    eyebrow: 'Tudo pronto',
    title: 'Seu Command Deck está online.',
    description:
      'Comece pelo Dashboard, acompanhe eventos ao vivo e volte a este guia quando quiser pelo botão de ajuda na barra superior.',
    accent: 'Pronto para operar',
  },
] as const

const flowItems = [
  { icon: Activity, label: 'Evento detectado', detail: 'Perda de sinal' },
  { icon: Map, label: 'Área localizada', detail: 'POP Centro' },
  { icon: Network, label: 'Causa isolada', detail: 'PON 01/03' },
]

const completionKey = `${ONBOARDING_VERSION}:complete`

function WelcomeVisual() {
  return (
    <div className="onboarding-radar" aria-hidden="true">
      <div className="onboarding-radar__ring onboarding-radar__ring--outer" />
      <div className="onboarding-radar__ring onboarding-radar__ring--middle" />
      <div className="onboarding-radar__ring onboarding-radar__ring--inner" />
      <div className="onboarding-radar__sweep" />
      <span className="onboarding-node onboarding-node--one" />
      <span className="onboarding-node onboarding-node--two" />
      <span className="onboarding-node onboarding-node--three" />
      <div className="onboarding-radar__core">
        <Radio size={28} />
        <span>REDE ATIVA</span>
      </div>
    </div>
  )
}

function DashboardVisual() {
  return (
    <div className="onboarding-dashboard" aria-hidden="true">
      <div className="onboarding-dashboard__top">
        <span>SAÚDE DA REDE</span>
        <span className="onboarding-live"><i /> AO VIVO</span>
      </div>
      <div className="onboarding-kpi-grid">
        <div><span>Disponibilidade</span><strong>99,82%</strong><small>estável</small></div>
        <div><span>Clientes online</span><strong>47</strong><small>de 50</small></div>
        <div className="is-alert"><span>Requer atenção</span><strong>03</strong><small>ver eventos</small></div>
      </div>
      <div className="onboarding-signal-chart">
        {[34, 48, 42, 66, 58, 74, 68, 84, 78, 92, 86, 96].map((height, index) => (
          <i key={index} style={{ height: `${height}%`, animationDelay: `${index * 45}ms` }} />
        ))}
      </div>
    </div>
  )
}

function FlowVisual() {
  return (
    <div className="onboarding-flow" aria-hidden="true">
      {flowItems.map(({ icon: Icon, label, detail }, index) => (
        <div className="onboarding-flow__item" key={label} style={{ animationDelay: `${index * 140}ms` }}>
          <div className="onboarding-flow__icon"><Icon size={20} /></div>
          <div><strong>{label}</strong><span>{detail}</span></div>
          {index < flowItems.length - 1 ? <ArrowRight className="onboarding-flow__arrow" size={18} /> : null}
        </div>
      ))}
    </div>
  )
}

function HierarchyVisual() {
  const nodes = [
    ['OLT', 'OLT Centro 01'],
    ['PON', '01 / 03'],
    ['CTO', 'CTO-014'],
    ['CLI', '50 assinantes'],
  ]

  return (
    <div className="onboarding-hierarchy" aria-hidden="true">
      {nodes.map(([code, label], index) => (
        <div className="onboarding-hierarchy__row" key={code} style={{ '--depth': index } as React.CSSProperties}>
          <span>{code}</span><strong>{label}</strong>{index < nodes.length - 1 ? <i /> : null}
        </div>
      ))}
    </div>
  )
}

function ReadyVisual() {
  return (
    <div className="onboarding-ready" aria-hidden="true">
      <div className="onboarding-ready__seal"><Check size={34} /></div>
      <div className="onboarding-ready__line"><Check size={15} /><span>Painel operacional conectado</span></div>
      <div className="onboarding-ready__line"><Check size={15} /><span>Monitoramento em tempo real</span></div>
      <div className="onboarding-ready__line"><Check size={15} /><span>Mapa e ativos sincronizados</span></div>
    </div>
  )
}

const visuals = [WelcomeVisual, DashboardVisual, FlowVisual, HierarchyVisual, ReadyVisual]

interface OnboardingExperienceProps {
  autoOpen?: boolean
  showTrigger?: boolean
}

export function OnboardingExperience({
  autoOpen = false,
  showTrigger = true,
}: OnboardingExperienceProps) {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const titleId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const gestureStartY = useRef<number | null>(null)
  const lastWheelAt = useRef(0)
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!autoOpen) return
    const completed = window.localStorage.getItem(completionKey) === 'complete'
    if (!completed) setIsOpen(true)
  }, [autoOpen])

  useEffect(() => {
    if (!isOpen) return
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
      if (event.key === 'ArrowRight') setStep((current) => Math.min(current + 1, steps.length - 1))
      if (event.key === 'ArrowLeft') setStep((current) => Math.max(current - 1, 0))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  function finish() {
    window.localStorage.setItem(completionKey, 'complete')
    setIsOpen(false)
    setStep(0)
    if (user) navigate('/')
  }

  function dismiss() {
    window.localStorage.setItem(completionKey, 'complete')
    setIsOpen(false)
    setStep(0)
  }

  const current = steps[step]
  const Visual = visuals[step]
  const firstName = profile?.displayName?.split(' ')[0]

  function moveStep(direction: 1 | -1) {
    setStep((currentStep) => Math.max(0, Math.min(currentStep + direction, steps.length - 1)))
  }

  function handleWheel(event: React.WheelEvent<HTMLElement>) {
    if (Math.abs(event.deltaY) < 18) return
    const now = Date.now()
    if (now - lastWheelAt.current < 520) return
    lastWheelAt.current = now
    moveStep(event.deltaY > 0 ? 1 : -1)
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    const target = event.target as HTMLElement
    if (target.closest('button, a, input, select, textarea, [role="button"]')) {
      gestureStartY.current = null
      return
    }
    gestureStartY.current = event.clientY
  }

  function handlePointerUp(event: React.PointerEvent<HTMLElement>) {
    if (gestureStartY.current === null) return
    const distance = event.clientY - gestureStartY.current
    gestureStartY.current = null
    if (Math.abs(distance) >= 48) moveStep(distance > 0 ? 1 : -1)
  }

  return (
    <>
      {showTrigger ? (
        <button
          type="button"
          className="onboarding-help"
          onClick={() => { setStep(0); setIsOpen(true) }}
          aria-label="Abrir guia do R20 NOC"
          title="Guia do sistema"
        >
          <CircleHelp size={18} />
          <span>Guia</span>
        </button>
      ) : null}

      {isOpen ? (
        <div className="onboarding-backdrop" role="presentation">
          <section
            className="onboarding-shell"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <div className="onboarding-rail">
              <div className="onboarding-rail__brand"><Sparkles size={18} /><span>R20 NOC</span></div>
              <div className="onboarding-rail__steps" aria-label="Progresso da introdução">
                {steps.map((item, index) => (
                  <button
                    type="button"
                    key={item.accent}
                    onClick={() => setStep(index)}
                    className={cn('onboarding-step-dot', index === step && 'is-current', index < step && 'is-done')}
                    aria-label={`Ir para etapa ${index + 1}: ${item.accent}`}
                    aria-current={index === step ? 'step' : undefined}
                  >
                    {index < step ? <Check size={12} /> : String(index + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
              <p>{String(step + 1).padStart(2, '0')} <span>/ {String(steps.length).padStart(2, '0')}</span></p>
            </div>

            <div className="onboarding-main">
              <button
                ref={closeButtonRef}
                type="button"
                className="onboarding-close"
                onClick={dismiss}
                aria-label="Fechar introdução"
              ><X size={18} /></button>

              <div className="onboarding-copy" key={`copy-${step}`}>
                <span className="onboarding-eyebrow">{step === 0 && firstName ? `${firstName}, ` : ''}{current.eyebrow}</span>
                <h1 id={titleId}>{current.title}</h1>
                <p>{current.description}</p>
                <div className="onboarding-accent"><i />{current.accent}</div>
              </div>

              <div className="onboarding-stage" key={`visual-${step}`}><Visual /></div>

              <div className="onboarding-gesture-hint" aria-hidden="true">
                <ChevronsDown size={15} />
                <span>{step === steps.length - 1 ? 'Arraste para cima para voltar' : 'Role ou arraste para baixo'}</span>
              </div>

              <div className="onboarding-actions">
                <button type="button" className="onboarding-skip" onClick={dismiss}>Pular introdução</button>
                <div>
                  {step > 0 ? (
                    <button type="button" className="onboarding-prev" onClick={() => setStep(step - 1)}>
                      <ArrowLeft size={17} /> Voltar
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="onboarding-next"
                    onClick={step === steps.length - 1 ? finish : () => setStep(step + 1)}
                  >
                    {step === steps.length - 1 ? <><LayoutDashboard size={17} /> {user ? 'Abrir Dashboard' : 'Ir para o login'}</> : <>Continuar <ArrowRight size={17} /></>}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
