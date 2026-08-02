import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/infra/firebase'
import { COLLECTIONS, type Ticket } from '@/shared/types/network'

export type NewTicket = Pick<Ticket, 'title' | 'priority'> &
  Pick<Required<Ticket>, 'description' | 'category'>

export function subscribeTickets(
  onData: (tickets: Ticket[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    collection(db, COLLECTIONS.tickets),
    (snapshot) => {
      const tickets = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }) as Ticket)
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      onData(tickets)
    },
    onError,
  )
}

export async function createTicket(values: NewTicket) {
  const ref = doc(collection(db, COLLECTIONS.tickets))
  const now = new Date().toISOString()
  await setDoc(ref, { ...values, status: 'open', createdAt: now, updatedAt: now })
}

export async function changeTicketStatus(id: string, status: Ticket['status']) {
  await updateDoc(doc(db, COLLECTIONS.tickets, id), {
    status,
    updatedAt: new Date().toISOString(),
  })
}
