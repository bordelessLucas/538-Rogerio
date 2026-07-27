import type { AssetStatus } from '@/shared/types/network'

export const STATUS_LABEL: Record<AssetStatus, string> = {
  online: 'Online',
  alert: 'Alerta',
  offline: 'Offline',
  disabled: 'Desativado',
}

export const STATUS_COLOR: Record<AssetStatus, string> = {
  online: 'var(--status-online)',
  alert: 'var(--status-alert)',
  offline: 'var(--status-offline)',
  disabled: 'var(--status-disabled)',
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const APP_VERSION = 'v0.1.0-proto'

/** Timestamp relativo para o listener do dashboard (“Atualizado há Xs”). */
export function formatUpdatedAgo(isoDate: string, nowMs = Date.now()): string {
  const diffSeconds = Math.max(0, Math.floor((nowMs - new Date(isoDate).getTime()) / 1000))

  if (diffSeconds < 60) {
    return `Atualizado há ${diffSeconds}s`
  }

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) {
    return `Atualizado há ${diffMinutes}min`
  }

  const diffHours = Math.floor(diffMinutes / 60)
  return `Atualizado há ${diffHours}h`
}
