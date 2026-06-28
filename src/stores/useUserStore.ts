import { create } from 'zustand'
import type { Usuario } from '../types'

const LOCAL_KEY = 'gasolina-user'

function getInitialUser(): Usuario | null {
    if (typeof window === 'undefined') return null
    try {
        const raw = window.localStorage.getItem(LOCAL_KEY)
        if (!raw) return null
        return JSON.parse(raw) as Usuario
    } catch {
        try {
            window.localStorage.removeItem(LOCAL_KEY)
        } catch (err) {
            console.log(err)
        }
        return null
    }
}

interface UserStore {
    user: Usuario | null
    setUser: (u: Usuario | null) => void
    clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
    user: getInitialUser(),
    setUser: (u: Usuario | null) => {
        set({ user: u })
        if (typeof window === 'undefined') return
        try {
            if (u) window.localStorage.setItem(LOCAL_KEY, JSON.stringify(u))
            else window.localStorage.removeItem(LOCAL_KEY)
        } catch (err) { console.log(err) }
    },
    clearUser: () => {
        set({ user: null })
        if (typeof window === 'undefined') return
        try {
            window.localStorage.removeItem(LOCAL_KEY)
        } catch (err) { console.log(err) }
    },
}))

export default useUserStore
