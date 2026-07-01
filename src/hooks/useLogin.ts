import { signInWithEmailAndPassword } from "firebase/auth"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../db/firebase"
import { toast } from 'react-toastify'

const STORAGE_KEY = 'gasolina-remembered-credentials'

type StoredCredentials = {
    email: string
    password: string
}

const getStoredCredentials = (): StoredCredentials | null => {
    if (typeof window === 'undefined') {
        return null
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (!stored) {
            return null
        }

        const parsed = JSON.parse(stored) as StoredCredentials
        if (parsed?.email && parsed?.password) {
            return parsed
        }
    } catch {
        window.localStorage.removeItem(STORAGE_KEY)
    }

    return null
}

const useLogin = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState(() => getStoredCredentials()?.email ?? '')
    const [password, setPassword] = useState(() => getStoredCredentials()?.password ?? '')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(Boolean(getStoredCredentials()))
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        if (rememberMe && email && password) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }))
            return
        }

        window.localStorage.removeItem(STORAGE_KEY)
    }, [email, password, rememberMe])

    const login = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        console.log('Attempting to log in with email:', email)
        try {
            const res = await signInWithEmailAndPassword(auth, email, password)
            console.log('Login successful:', res.user)
            if (res.user.email === 'manuelperez.0000@gmail.com') {
                navigate('/')
            } else {
                navigate('/cajero')
            }
        } catch (error) {
            const err = error as { code?: string }
            const code = err.code || ''
            const message =
                code === 'auth/wrong-password' || code === 'auth/user-not-found'
                    ? 'Credenciales inválidas'
                    : code === 'auth/invalid-email'
                        ? 'Correo inválido'
                        : 'Error al iniciar sesión'
            console.error('Login error:', message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return {
        email,
        password,
        setEmail,
        setPassword,
        showPassword,
        setShowPassword,
        rememberMe,
        setRememberMe,
        login,
        loading,
    }
}
export default useLogin