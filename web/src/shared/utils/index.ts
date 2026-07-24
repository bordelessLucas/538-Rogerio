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
