import type {
  Client,
  Cto,
  NetworkEvent,
  NocMetrics,
  Olt,
  OltVendor,
  Pon,
  Pop,
  Ticket,
  AssetStatus,
} from '@/shared/types/network'

/** Centro aproximado — ajustar com área real da R20 depois */
export const BASE = { lat: -23.5505, lng: -46.6333 }

const now = () => new Date().toISOString()

export const seedPops: Omit<Pop, 'id'>[] = [
  {
    name: 'POP Centro',
    address: 'Av. Central, 100 — Centro',
    lat: BASE.lat,
    lng: BASE.lng,
    status: 'online',
    createdAt: now(),
  },
  {
    name: 'POP Norte',
    address: 'Rua das Fibras, 45 — Zona Norte',
    lat: BASE.lat + 0.035,
    lng: BASE.lng - 0.02,
    status: 'online',
    createdAt: now(),
  },
]

const oltDefs: Array<{
  popIndex: number
  name: string
  vendor: OltVendor
  ip: string
  status: AssetStatus
  lat: number
  lng: number
}> = [
  {
    popIndex: 0,
    name: 'OLT-ZTE-01',
    vendor: 'ZTE',
    ip: '10.10.1.2',
    status: 'online',
    lat: BASE.lat + 0.002,
    lng: BASE.lng + 0.001,
  },
  {
    popIndex: 0,
    name: 'OLT-HW-02',
    vendor: 'Huawei',
    ip: '10.10.1.3',
    status: 'online',
    lat: BASE.lat - 0.004,
    lng: BASE.lng + 0.006,
  },
  {
    popIndex: 1,
    name: 'OLT-FH-03',
    vendor: 'Fiberhome',
    ip: '10.10.2.2',
    status: 'alert',
    lat: BASE.lat + 0.038,
    lng: BASE.lng - 0.018,
  },
  {
    popIndex: 1,
    name: 'OLT-DT-04',
    vendor: 'Datacom',
    ip: '10.10.2.3',
    status: 'online',
    lat: BASE.lat + 0.032,
    lng: BASE.lng - 0.024,
  },
]

export const seedOlts: Array<Omit<Olt, 'id' | 'popId'> & { popIndex: number }> =
  oltDefs.map((olt) => ({ ...olt, createdAt: now() }))

/** 10 PONs — 2–3 por OLT */
export const seedPons: Array<Omit<Pon, 'id' | 'oltId'> & { oltIndex: number }> = [
  { oltIndex: 0, name: 'PON-0/1/1', port: 1, status: 'online', createdAt: now() },
  { oltIndex: 0, name: 'PON-0/1/2', port: 2, status: 'online', createdAt: now() },
  { oltIndex: 0, name: 'PON-0/1/3', port: 3, status: 'online', createdAt: now() },
  { oltIndex: 1, name: 'PON-0/1/1', port: 1, status: 'online', createdAt: now() },
  { oltIndex: 1, name: 'PON-0/1/2', port: 2, status: 'alert', createdAt: now() },
  { oltIndex: 2, name: 'PON-0/1/1', port: 1, status: 'online', createdAt: now() },
  { oltIndex: 2, name: 'PON-0/1/2', port: 2, status: 'offline', createdAt: now() },
  { oltIndex: 2, name: 'PON-0/1/3', port: 3, status: 'online', createdAt: now() },
  { oltIndex: 3, name: 'PON-0/1/1', port: 1, status: 'online', createdAt: now() },
  { oltIndex: 3, name: 'PON-0/1/2', port: 2, status: 'online', createdAt: now() },
]

const FIRST_NAMES = [
  'João',
  'Maria',
  'Pedro',
  'Ana',
  'Carlos',
  'Juliana',
  'Lucas',
  'Fernanda',
  'Rafael',
  'Camila',
  'Bruno',
  'Patricia',
  'Diego',
  'Larissa',
  'Felipe',
  'Beatriz',
  'Gustavo',
  'Amanda',
  'Thiago',
  'Renata',
]
const LAST_NAMES = [
  'Silva',
  'Souza',
  'Oliveira',
  'Costa',
  'Mendes',
  'Santos',
  'Almeida',
  'Ferreira',
  'Lima',
  'Rocha',
]
const PLANS = ['200 Mega', '300 Mega', '500 Mega', '700 Mega', '1 Giga']
const ONUS = ['ZTE F670L', 'Huawei EG8145', 'Fiberhome AN5506', 'Nokia G-240W']
const STATUSES: AssetStatus[] = ['online', 'online', 'online', 'alert', 'offline']

function buildCtos(): Array<
  Omit<Cto, 'id' | 'oltId' | 'ponId'> & { oltIndex: number; ponIndex: number }
> {
  const zones = ['CENTRO', 'SUL', 'NORTE', 'LESTE', 'OESTE']
  const items: Array<
    Omit<Cto, 'id' | 'oltId' | 'ponId'> & { oltIndex: number; ponIndex: number }
  > = []

  for (let i = 0; i < 20; i += 1) {
    const ponIndex = i % seedPons.length
    const oltIndex = seedPons[ponIndex].oltIndex
    const capacity = i % 3 === 0 ? 8 : 16
    const occupiedPorts = Math.min(
      capacity,
      Math.floor(capacity * (0.35 + (i % 7) * 0.1)),
    )
    const freePorts = capacity - occupiedPorts
    const occupancyPercent = Math.round((occupiedPorts / capacity) * 1000) / 10
    const status: AssetStatus =
      occupancyPercent > 80 ? 'alert' : i % 11 === 0 ? 'offline' : 'online'
    const angle = (i / 20) * Math.PI * 2
    const radius = 0.008 + (i % 5) * 0.004

    items.push({
      oltIndex,
      ponIndex,
      name: `CTO-${zones[i % zones.length]}-${String(i + 1).padStart(2, '0')}`,
      code: `CTO-${String(i + 1).padStart(3, '0')}`,
      capacity,
      occupiedPorts,
      freePorts,
      splitter: capacity === 8 ? '1:8' : '1:16',
      distanceMeters: 300 + i * 45,
      status,
      lat: BASE.lat + Math.cos(angle) * radius + (oltIndex >= 2 ? 0.03 : 0),
      lng: BASE.lng + Math.sin(angle) * radius + (oltIndex >= 2 ? -0.015 : 0),
      occupancyPercent,
      createdAt: now(),
    })
  }

  return items
}

export const seedCtos = buildCtos()

function buildClients(): Array<
  Omit<Client, 'id' | 'ctoId' | 'oltId' | 'ponId'> & { ctoIndex: number }
> {
  const items: Array<
    Omit<Client, 'id' | 'ctoId' | 'oltId' | 'ponId'> & { ctoIndex: number }
  > = []

  for (let i = 0; i < 50; i += 1) {
    const ctoIndex = i % seedCtos.length
    const cto = seedCtos[ctoIndex]
    const status = STATUSES[i % STATUSES.length]
    const powerDbm =
      status === 'offline' ? -32 : status === 'alert' ? -27.5 - (i % 3) * 0.4 : -18 - (i % 8) * 0.7

    items.push({
      ctoIndex,
      name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
      plan: PLANS[i % PLANS.length],
      onuModel: ONUS[i % ONUS.length],
      powerDbm: Math.round(powerDbm * 10) / 10,
      lastAccessAt: new Date(Date.now() - (status === 'offline' ? 86_400_000 : i * 120_000)).toISOString(),
      ip: `100.64.${10 + Math.floor(i / 25)}.${20 + (i % 200)}`,
      equipment: i % 2 === 0 ? 'ONU Bridge' : 'ONU Router',
      mac: `AA:BB:CC:${String(10 + (i % 80)).padStart(2, '0')}:${String(20 + (i % 50)).padStart(2, '0')}:${String(i % 99).padStart(2, '0')}`,
      serial: `ZTEG${String(12345000 + i)}`,
      status,
      lat: cto.lat + ((i % 5) - 2) * 0.00035,
      lng: cto.lng + ((i % 7) - 3) * 0.00035,
      createdAt: now(),
    })
  }

  return items
}

export const seedClients = buildClients()

export const seedEvents: Omit<NetworkEvent, 'id'>[] = [
  {
    type: 'client_offline',
    severity: 'critical',
    title: 'Cliente Offline',
    description: `${seedClients[2].name} sem sessão há mais de 1h`,
    assetType: 'client',
    assetId: 'pending',
    assetName: seedClients[2].name,
    createdAt: new Date(Date.now() - 1_800_000).toISOString(),
    acknowledged: false,
  },
  {
    type: 'power_alert',
    severity: 'warning',
    title: 'Alerta de potência',
    description: 'Sinal abaixo de -26 dBm',
    assetType: 'client',
    assetId: 'pending',
    assetName: seedClients[3].name,
    createdAt: new Date(Date.now() - 900_000).toISOString(),
    acknowledged: false,
  },
  {
    type: 'signal_oscillation',
    severity: 'warning',
    title: 'Oscilação de sinal',
    description: `Variação detectada na ${seedCtos[4].name}`,
    assetType: 'cto',
    assetId: 'pending',
    assetName: seedCtos[4].name,
    createdAt: new Date(Date.now() - 600_000).toISOString(),
    acknowledged: false,
  },
  {
    type: 'onu_reboot',
    severity: 'info',
    title: 'ONU reiniciada',
    description: `${seedClients[8].name} — reboot remoto concluído`,
    assetType: 'client',
    assetId: 'pending',
    assetName: seedClients[8].name,
    createdAt: new Date(Date.now() - 300_000).toISOString(),
    acknowledged: true,
  },
  {
    type: 'client_online',
    severity: 'info',
    title: 'Cliente Online',
    description: `${seedClients[0].name} restabeleceu sessão PPPoE`,
    assetType: 'client',
    assetId: 'pending',
    assetName: seedClients[0].name,
    createdAt: new Date(Date.now() - 120_000).toISOString(),
    acknowledged: true,
  },
]

export const seedTickets: Omit<Ticket, 'id'>[] = [
  {
    title: `Cliente sem conexão — ${seedClients[2].name}`,
    status: 'open',
    priority: 'high',
    createdAt: now(),
  },
  {
    title: `Sinal ruim — ${seedClients[3].name}`,
    status: 'in_progress',
    priority: 'medium',
    createdAt: now(),
  },
]

export const seedMetrics: NocMetrics = {
  clientsOnline: 1240,
  clientsOffline: 37,
  clientsBadSignal: 12,
  oltsCount: 4,
  ticketsOpen: 18,
  networkAvailabilityPercent: 99.4,
  fiberBreaks: 1,
  ctosOvercapacity: seedCtos.filter((cto) => cto.occupancyPercent > 80).length,
  pppoeActive: 1198,
  activeAlarms: 9,
  slaPercentToday: 99.1,
  updatedAt: now(),
}
