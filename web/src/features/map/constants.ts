/** Centro aproximado da área de demo (ajustar com coordenadas reais da R20). */
export const MAP_DEFAULT_CENTER: [number, number] = [-23.5505, -46.6333]
export const MAP_DEFAULT_ZOOM = 13

export const STATUS_HEX = {
  online: '#22c55e',
  alert: '#eab308',
  offline: '#ef4444',
  disabled: '#94a3b8',
} as const

export const TYPE_LABEL = {
  client: 'Cliente',
  cto: 'CTO',
  olt: 'OLT',
  pop: 'POP',
} as const

export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
