/**
 * Reseta o documento `metrics/noc` com os valores realistas da demo.
 *
 * Uso: npm run seed:dashboard
 * Requer `.env` com VITE_FIREBASE_* e usuário demo existente.
 */
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getFirestore, setDoc } from 'firebase/firestore'

const DEMO_EMAIL = process.env.SEED_EMAIL ?? 'admin@r20noc.com'
const DEMO_PASSWORD = process.env.SEED_PASSWORD ?? 'R20noc@2026'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const seedMetrics = {
  clientsOnline: 1240,
  clientsOffline: 37,
  clientsBadSignal: 12,
  oltsCount: 4,
  ticketsOpen: 18,
  networkAvailabilityPercent: 99.4,
  fiberBreaks: 1,
  ctosOvercapacity: 2,
  pppoeActive: 1198,
  activeAlarms: 9,
  slaPercentToday: 99.1,
  updatedAt: new Date().toISOString(),
}

function assertConfig() {
  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `Variáveis Firebase ausentes: ${missing.join(', ')}. Carregue o .env (npm run seed:dashboard).`,
    )
  }
}

async function main() {
  assertConfig()

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore(app)

  console.log(`Autenticando como ${DEMO_EMAIL}...`)
  await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD)

  await setDoc(doc(db, 'metrics', 'noc'), seedMetrics, { merge: true })
  console.log('metrics/noc atualizado:')
  console.table({
    clientsOnline: seedMetrics.clientsOnline,
    clientsOffline: seedMetrics.clientsOffline,
    clientsBadSignal: seedMetrics.clientsBadSignal,
    oltsCount: seedMetrics.oltsCount,
    ticketsOpen: seedMetrics.ticketsOpen,
    networkAvailabilityPercent: seedMetrics.networkAvailabilityPercent,
  })
  console.log('Seed do dashboard concluído.')
  process.exit(0)
}

main().catch((error: unknown) => {
  console.error('Falha no seed:dashboard:', error instanceof Error ? error.message : error)
  process.exit(1)
})
