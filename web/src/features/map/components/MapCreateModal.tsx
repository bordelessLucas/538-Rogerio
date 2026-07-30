import { Building2, Home, Router, Server, X } from 'lucide-react'
import { useState } from 'react'
import { ClientForm } from '@/features/network/components/ClientForm'
import { CtoForm } from '@/features/network/components/CtoForm'
import { OltForm } from '@/features/network/components/OltForm'
import type {
  ClientFormValues,
  CtoFormValues,
  OltFormValues,
} from '@/features/network/domain/schemas'
import {
  useCtos,
  useOlts,
  usePons,
  usePops,
} from '@/features/network/hooks/useNetworkCollections'
import {
  createClient,
  createCto,
  createOlt,
} from '@/features/network/services/networkService'
import { useToast } from '@/shared/ui/Toast'
import type { Client, Cto, Olt } from '@/shared/types/network'
import { cn } from '@/shared/utils'

export type MapCreateEntityType = 'olt' | 'cto' | 'client'

export interface MapClickCoords {
  lat: number
  lng: number
}

interface MapCreateModalProps {
  coords: MapClickCoords
  onClose: () => void
  onCreated?: () => void
}

const TYPE_OPTIONS: Array<{
  type: MapCreateEntityType
  label: string
  description: string
  icon: typeof Server
}> = [
  {
    type: 'olt',
    label: 'OLT',
    description: 'Terminal óptico de linha',
    icon: Server,
  },
  {
    type: 'cto',
    label: 'CTO',
    description: 'Caixa de terminação óptica',
    icon: Router,
  },
  {
    type: 'client',
    label: 'Cliente',
    description: 'Assinante / ONU',
    icon: Home,
  },
]

function roundCoord(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000
}

export function MapCreateModal({ coords, onClose, onCreated }: MapCreateModalProps) {
  const { pushToast } = useToast()
  const { items: pops } = usePops()
  const { items: olts } = useOlts()
  const { items: pons } = usePons()
  const { items: ctos } = useCtos()

  const [selectedType, setSelectedType] = useState<MapCreateEntityType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const lat = roundCoord(coords.lat)
  const lng = roundCoord(coords.lng)

  const oltInitial = { lat, lng } as Olt
  const ctoInitial = { lat, lng } as Cto
  const clientInitial = { lat, lng } as Client

  async function handleCreateOlt(values: OltFormValues) {
    setIsSubmitting(true)
    try {
      await createOlt(values)
      pushToast('OLT cadastrada no mapa', 'success')
      onCreated?.()
      onClose()
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao cadastrar OLT', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCreateCto(values: CtoFormValues) {
    setIsSubmitting(true)
    try {
      await createCto(values)
      pushToast('CTO cadastrada no mapa', 'success')
      onCreated?.()
      onClose()
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao cadastrar CTO', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCreateClient(values: ClientFormValues) {
    setIsSubmitting(true)
    try {
      await createClient(values)
      pushToast('Cliente cadastrado no mapa', 'success')
      onCreated?.()
      onClose()
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Falha ao cadastrar cliente', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const title = !selectedType
    ? 'Cadastrar no mapa'
    : selectedType === 'olt'
      ? 'Nova OLT'
      : selectedType === 'cto'
        ? 'Nova CTO'
        : 'Novo Cliente'

  return (
    <div className="fixed inset-0 z-[1600] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/12 bg-[var(--bg-panel-solid)] shadow-[0_24px_64px_rgba(0,0,0,0.55)]',
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
              Mapa · novo ativo
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">{title}</h2>
            <p className="font-mono-metric mt-1 text-xs text-white/50">
              lat {lat} · lng {lng}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!selectedType ? (
            <div className="space-y-3">
              <p className="text-sm text-white/60">
                O que deseja cadastrar neste ponto?
              </p>
              <div className="grid gap-2">
                {TYPE_OPTIONS.map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.type}
                      type="button"
                      onClick={() => setSelectedType(option.type)}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)]"
                    >
                      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                        <Icon size={18} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{option.label}</span>
                        <span className="block text-xs text-white/50">{option.description}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
              <p className="flex items-start gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-xs text-white/40">
                <Building2 size={14} className="mt-0.5 shrink-0" />
                POP e PON não entram aqui: POP usa o seed; PON não tem coordenadas no mapa.
              </p>
            </div>
          ) : null}

          {selectedType === 'olt' ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setSelectedType(null)}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                ← Trocar tipo
              </button>
              <OltForm
                key={`olt-${lat}-${lng}`}
                initial={oltInitial}
                pops={pops}
                isSubmitting={isSubmitting}
                onSubmit={handleCreateOlt}
                onCancel={onClose}
              />
            </div>
          ) : null}

          {selectedType === 'cto' ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setSelectedType(null)}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                ← Trocar tipo
              </button>
              <CtoForm
                key={`cto-${lat}-${lng}`}
                initial={ctoInitial}
                olts={olts}
                pons={pons}
                isSubmitting={isSubmitting}
                onSubmit={handleCreateCto}
                onCancel={onClose}
              />
            </div>
          ) : null}

          {selectedType === 'client' ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setSelectedType(null)}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                ← Trocar tipo
              </button>
              <ClientForm
                key={`client-${lat}-${lng}`}
                initial={clientInitial}
                ctos={ctos}
                isSubmitting={isSubmitting}
                lockCoordinates
                onSubmit={handleCreateClient}
                onCancel={onClose}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
