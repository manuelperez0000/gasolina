import { useState, useEffect, useCallback } from 'react'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../db/firebase'
import type { Usuario, AuthState } from '../types'
import { useUserStore } from '../stores/useUserStore'

const USUARIOS_COLLECTION = 'usuarios'

async function loadUserProfile(email: string) {
  const q = query(
    collection(db, USUARIOS_COLLECTION),
    where('email', '==', email),
  )
  const snapshot = await getDocs(q)
  if (!snapshot.empty) {
    const docSnap = snapshot.docs[0]
    return { id: docSnap.id, ...docSnap.data() } as Usuario
  }

  const username = email.split('@')[0]
  const newUser = {
    email,
    username,
    rol: 'cajero' as const,
  }
  const docRef = await addDoc(collection(db, USUARIOS_COLLECTION), newUser)
  return { id: docRef.id, ...newUser }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.email) {
        try {
          const userProfile = await loadUserProfile(firebaseUser.email)
          setState({ user: userProfile, loading: false, error: null })
          // sync to zustand store and localStorage
          try {
            useUserStore.getState().setUser(userProfile)
          } catch {}
        } catch {
          setState({ user: null, loading: false, error: 'Error al cargar el usuario' })
        }
      } else {
        setState({ user: null, loading: false, error: null })
        try {
          useUserStore.getState().clearUser()
        } catch {}
      }
    })

    return unsubscribe
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      // after successful auth, load profile and sync to store
      if (res.user?.email) {
        try {
          const userProfile = await loadUserProfile(res.user.email)
          setState({ user: userProfile, loading: false, error: null })
          try {
            useUserStore.getState().setUser(userProfile)
          } catch {}
        } catch (err) {
          // if profile load fails, still consider login successful
          setState((prev) => ({ ...prev, loading: false }))
        }
      }
      return true
    } catch (error) {
      const err = error as { code?: string }
      const code = err.code || ''
      const message =
        code === 'auth/wrong-password' || code === 'auth/user-not-found'
          ? 'Credenciales inválidas'
          : code === 'auth/invalid-email'
          ? 'Correo inválido'
          : 'Error al iniciar sesión'
      setState({ user: null, loading: false, error: message })
      return false
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.SubmitEvent) => {
      e.preventDefault()
      await login(email, password)
    },
    [email, password, login],
  )

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await signOut(auth)
    } finally {
      setState({ user: null, loading: false, error: null })
      try {
        useUserStore.getState().clearUser()
      } catch {}
    }
  }, [])

  return {
    ...state,
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    login,
    logout,
  }
}
