import { useCallback, useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../db/firebase'
import { toast } from 'react-toastify'

type UserRole = 'admin' | 'cajero'

const USERS_COLLECTION = 'usuarios'

function parsePermisos(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  const err = error as Record<string, unknown>
  return String(err?.message ?? 'Error al crear el usuario')
}

export function useUserAdmin() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [tipo, setTipo] = useState<UserRole>('cajero')
  const [permisos, setPermisos] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const resetForm = () => {
    setNombre('')
    setCorreo('')
    setTipo('cajero')
    setPermisos('')
    setPassword('')
  }

  const crearUsuario = useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault()
      setLoading(true)
      setSuccessMessage(null)

      if (!nombre || !correo || !password) {
        toast.error('Nombre, correo y contraseña son obligatorios.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${import.meta.env.VITE_FIREBASE_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: correo,
              password,
              returnSecureToken: false,
            }),
          },
        )

        const result = await response.json()
        if (!response.ok) {
          const message = result?.error?.message ?? 'No se pudo crear el usuario.'
          throw new Error(message)
        }

        await addDoc(collection(db, USERS_COLLECTION), {
          email: correo,
          username: nombre,
          rol: tipo,
          permisos: parsePermisos(permisos),
        })

        setSuccessMessage('Usuario creado exitosamente.')
        toast.success('Usuario creado exitosamente')
        resetForm()
      } catch (error) {
        const message = getErrorMessage(error)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [nombre, correo, tipo, permisos, password],
  )

  return {
    nombre,
    correo,
    tipo,
    permisos,
    password,
    loading,
    successMessage,
    setNombre,
    setCorreo,
    setTipo,
    setPermisos,
    setPassword,
    crearUsuario,
  }
}
