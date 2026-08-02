import { useState, type FormEvent } from 'react'
import { BellRing, Database, RadioTower, Save, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { CardShell, SectionLabel } from '@/shared/ui'
import { useToast } from '@/shared/ui/Toast'

interface SettingsState {
  operatorName: string
  timezone: string
  warningPower: string
  criticalPower: string
  availabilityTarget: string
  notifyCritical: boolean
  notifyOffline: boolean
  notifyDaily: boolean
}

const STORAGE_KEY = 'r20-noc-settings-v1'
const defaults: SettingsState = {
  operatorName: 'R20 NOC', timezone: 'America/Sao_Paulo', warningPower: '-24',
  criticalPower: '-27', availabilityTarget: '99.5', notifyCritical: true,
  notifyOffline: true, notifyDaily: false,
}

function loadSettings(): SettingsState {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaults, ...JSON.parse(saved) as Partial<SettingsState> } : defaults
  } catch { return defaults }
}

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (value: boolean) => void; label: string; hint: string }) {
  return <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-[var(--border)] py-4 last:border-0"><span><span className="block text-sm font-medium">{label}</span><span className="mt-0.5 block text-xs text-[var(--text-muted)]">{hint}</span></span><input type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span className="relative h-6 w-11 shrink-0 rounded-full bg-white/10 transition peer-checked:bg-[var(--accent)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)]"><span className="absolute top-1 left-1 size-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" /></span></label>
}

export function SettingsPage() {
  const { pushToast } = useToast()
  const [settings, setSettings] = useState<SettingsState>(loadSettings)
  const [active, setActive] = useState<'operation' | 'alerts' | 'integrations'>('operation')

  function update<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  function save(event: FormEvent) {
    event.preventDefault()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    pushToast('Configurações salvas neste dispositivo', 'success')
  }

  return <form onSubmit={save} className="space-y-5">
    <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="mb-2 text-[11px] font-semibold tracking-[.18em] text-[var(--accent)] uppercase">Control plane · ambiente local</p><h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Configurações</h1><p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">Defina os limiares que orientam a operação e como o time recebe alertas.</p></div><button className="r20-btn r20-btn-primary"><Save size={16} /> Salvar alterações</button></section>

    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <CardShell className="h-fit p-2!">
        {[
          { id: 'operation', label: 'Operação', icon: SlidersHorizontal },
          { id: 'alerts', label: 'Alertas', icon: BellRing },
          { id: 'integrations', label: 'Integrações', icon: Database },
        ].map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActive(id as typeof active)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${active === id ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:bg-white/[.04]'}`}><Icon size={17} />{label}</button>)}
      </CardShell>

      <div className="space-y-4">
        {active === 'operation' ? <>
          <CardShell><div className="flex items-start gap-3"><div className="rounded-lg bg-[var(--accent-soft)] p-2 text-[var(--accent)]"><RadioTower size={19} /></div><div><SectionLabel>Identidade operacional</SectionLabel><p className="mt-1 text-sm text-[var(--text-muted)]">Nome e fuso usados nos relatórios e registros.</p></div></div><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm">Nome da operadora<input className="r20-input mt-1.5" value={settings.operatorName} onChange={(event) => update('operatorName', event.target.value)} /></label><label className="text-sm">Fuso horário<select className="r20-input mt-1.5" value={settings.timezone} onChange={(event) => update('timezone', event.target.value)}><option value="America/Sao_Paulo">Brasília (UTC-3)</option><option value="America/Manaus">Manaus (UTC-4)</option><option value="America/Rio_Branco">Rio Branco (UTC-5)</option></select></label></div></CardShell>
          <CardShell><SectionLabel>Limiares de rede</SectionLabel><p className="mt-1 text-sm text-[var(--text-muted)]">Valores usados para classificar saúde óptica e SLA.</p><div className="mt-5 grid gap-4 sm:grid-cols-3"><label className="text-sm">Sinal em atenção (dBm)<input type="number" className="r20-input mt-1.5 font-mono-metric" value={settings.warningPower} onChange={(event) => update('warningPower', event.target.value)} /></label><label className="text-sm">Sinal crítico (dBm)<input type="number" className="r20-input mt-1.5 font-mono-metric" value={settings.criticalPower} onChange={(event) => update('criticalPower', event.target.value)} /></label><label className="text-sm">Meta de disponibilidade (%)<input type="number" step="0.1" className="r20-input mt-1.5 font-mono-metric" value={settings.availabilityTarget} onChange={(event) => update('availabilityTarget', event.target.value)} /></label></div><div className="mt-5 overflow-hidden rounded-lg border border-[var(--border)]"><div className="grid grid-cols-3 text-center text-xs"><div className="bg-[var(--status-online)]/10 p-3 text-[var(--status-online)]">Normal<br/><strong className="font-mono-metric">&gt; {settings.warningPower} dBm</strong></div><div className="bg-[var(--status-alert)]/10 p-3 text-[var(--status-alert)]">Atenção<br/><strong className="font-mono-metric">{settings.warningPower} a {settings.criticalPower} dBm</strong></div><div className="bg-[var(--status-offline)]/10 p-3 text-[var(--status-offline)]">Crítico<br/><strong className="font-mono-metric">&lt; {settings.criticalPower} dBm</strong></div></div></div></CardShell>
        </> : null}

        {active === 'alerts' ? <CardShell><div className="flex items-start gap-3"><div className="rounded-lg bg-[var(--status-alert)]/10 p-2 text-[var(--status-alert)]"><BellRing size={19} /></div><div><SectionLabel>Política de notificações</SectionLabel><p className="mt-1 text-sm text-[var(--text-muted)]">Escolha quais ocorrências pedem atenção imediata.</p></div></div><div className="mt-3"><Toggle checked={settings.notifyCritical} onChange={(value) => update('notifyCritical', value)} label="Alarmes críticos" hint="Rompimentos, OLT offline e indisponibilidade em massa." /><Toggle checked={settings.notifyOffline} onChange={(value) => update('notifyOffline', value)} label="Cliente offline" hint="Notificar quando um cliente perder conectividade." /><Toggle checked={settings.notifyDaily} onChange={(value) => update('notifyDaily', value)} label="Resumo diário" hint="Consolidado operacional ao encerrar o turno." /></div></CardShell> : null}

        {active === 'integrations' ? <div className="grid gap-4 md:grid-cols-2">{[
          { name: 'Firebase', detail: 'Auth, Firestore e Hosting', status: 'Conectado', icon: Database },
          { name: 'SNMP / OLT', detail: 'Coleta automática de telemetria', status: 'Planejado', icon: RadioTower },
          { name: 'RADIUS / PPPoE', detail: 'Sessões e autenticação', status: 'Planejado', icon: ShieldCheck },
          { name: 'Webhook', detail: 'Saída para canais externos', status: 'Planejado', icon: BellRing },
        ].map(({ name, detail, status, icon: Icon }) => <CardShell key={name}><div className="flex items-start justify-between gap-4"><div className="flex gap-3"><div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-2 text-[var(--text-muted)]"><Icon size={18} /></div><div><h3 className="text-sm font-semibold">{name}</h3><p className="mt-1 text-xs text-[var(--text-muted)]">{detail}</p></div></div><span className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase ${status === 'Conectado' ? 'bg-[var(--status-online)]/10 text-[var(--status-online)]' : 'bg-white/5 text-[var(--text-muted)]'}`}>{status}</span></div></CardShell>)}</div> : null}
      </div>
    </div>
  </form>
}
