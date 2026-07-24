import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '@/infra/firebase'
import { COLLECTIONS, type AppUser, type UserRole } from '@/shared/types/network'

async function ensureUserProfile(user: User, role: UserRole = 'admin'): Promise<AppUser> {
  const ref = doc(db, COLLECTIONS.users, user.uid)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    return snap.data() as AppUser
  }

  const profile: AppUser = {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? user.email?.split('@')[0] ?? 'Usuário',
    role,
    createdAt: new Date().toISOString(),
  }

  await setDoc(ref, {
    ...profile,
    createdAtServer: serverTimestamp(),
  })

  return profile
}

export async function loginWithEmail(email: string, password: string): Promise<AppUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return ensureUserProfile(credential.user)
}

export async function registerDemoAdmin(
  email: string,
  password: string,
  displayName: string,
): Promise<AppUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName })
  return ensureUserProfile(credential.user, 'admin')
}

export async function logout(): Promise<void> {
  await signOut(auth)
}

export function subscribeAuth(
  onChange: (user: User | null, profile: AppUser | null) => void,
): () => void {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      onChange(null, null)
      return
    }

    try {
      const profile = await ensureUserProfile(user)
      onChange(user, profile)
    } catch {
      onChange(user, null)
    }
  })
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.users, uid))
  return snap.exists() ? (snap.data() as AppUser) : null
}
