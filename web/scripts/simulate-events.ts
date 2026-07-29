/**
 * Simulador local de eventos operacionais (Dia 06).
 * Sem Cloud Functions — funciona no plano Spark.
 *
 * Uso: npm run simulate:events
 * Opcional: SIMULATE_INTERVAL_MS=5000
 */
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

const DEMO_EMAIL = process.env.SEED_EMAIL ?? 'admin@r20noc.com'
const DEMO_PASSWORD = process.env.SEED_PASSWORD ?? 'R20noc@2026'
const INTERVAL_MS = Number(process.env.SIMULATE_INTERVAL_MS ?? 8_000)

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
}

function assertConfig() {
  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key)
  if (missing.length > 0) {
    throw new Error(`Variáveis Firebase ausentes: ${missing.join(', ')}`)
  }
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

async function simulateOnce(db: ReturnType<typeof getFirestore>) {
  const [clientsSnap, ctosSnap] = await Promise.all([
    getDocs(collection(db, 'clients')),
    getDocs(collection(db, 'ctos')),
  ])

  const clients = clientsSnap.docs.map((entry) => ({
    id: entry.id,
    ...(entry.data() as { name: string }),
  }))
  const ctos = ctosSnap.docs.map((entry) => ({
    id: entry.id,
    ...(entry.data() as { name: string }),
  }))

  if (clients.length === 0) {
    throw new Error('Sem clientes. Rode o seed no Dashboard primeiro.')
  }

  const kinds = ['client_offline', 'signal_oscillation', 'power_alert', 'client_online'] as const
  const kind = pick([...kinds])
  const createdAt = new Date().toISOString()
  const ref = doc(collection(db, 'events'))

  if (kind === 'signal_oscillation' && ctos.length > 0) {
    const cto = pick(ctos)
    await setDoc(ref, {
      type: kind,
      severity: 'warning',
      title: 'Oscilação de sinal',
      description: `Variação óptica detectada na ${cto.name}`,
      assetType: 'cto',
      assetId: cto.id,
      assetName: cto.name,
      createdAt,
      acknowledged: false,
    })
    await updateDoc(doc(db, 'ctos', cto.id), { status: 'alert' })
    console.log(`[${createdAt}] Oscilação → ${cto.name}`)
    return
  }

  const client = pick(clients)

  if (kind === 'client_offline') {
    await setDoc(ref, {
      type: kind,
      severity: 'critical',
      title: 'Cliente Offline',
      description: `${client.name} sem sessão PPPoE`,
      assetType: 'client',
      assetId: client.id,
      assetName: client.name,
      createdAt,
      acknowledged: false,
    })
    await updateDoc(doc(db, 'clients', client.id), { status: 'offline' })
    console.log(`[${createdAt}] Offline → ${client.name}`)
    return
  }

  if (kind === 'power_alert') {
    await setDoc(ref, {
      type: kind,
      severity: 'warning',
      title: 'Alerta de potência',
      description: `${client.name} com sinal abaixo de -26 dBm`,
      assetType: 'client',
      assetId: client.id,
      assetName: client.name,
      createdAt,
      acknowledged: false,
    })
    await updateDoc(doc(db, 'clients', client.id), { status: 'alert' })
    console.log(`[${createdAt}] Potência → ${client.name}`)
    return
  }

  await setDoc(ref, {
    type: 'client_online',
    severity: 'info',
    title: 'Cliente Online',
    description: `${client.name} restabeleceu sessão`,
    assetType: 'client',
    assetId: client.id,
    assetName: client.name,
    createdAt,
    acknowledged: false,
  })
  await updateDoc(doc(db, 'clients', client.id), { status: 'online' })
  console.log(`[${createdAt}] Online → ${client.name}`)
}

async function main() {
  assertConfig()
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore(app)

  console.log(`Autenticando como ${DEMO_EMAIL}...`)
  await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD)
  console.log(`Simulador ativo a cada ${INTERVAL_MS}ms. Ctrl+C para parar.`)

  await simulateOnce(db)
  setInterval(() => {
    void simulateOnce(db).catch((error: unknown) => {
      console.error('Falha na simulação:', error instanceof Error ? error.message : error)
    })
  }, INTERVAL_MS)
}

main().catch((error: unknown) => {
  console.error('Falha no simulate:events:', error instanceof Error ? error.message : error)
  process.exit(1)
})
