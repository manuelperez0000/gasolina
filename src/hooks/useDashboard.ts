/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect, type FormEvent } from 'react'
import { useUserStore } from '../stores/useUserStore'
//import { toast } from 'react-toastify'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../db/firebase'
import type { RegistroGasolina, SubmitResult, UseDashboardReturn } from '../types'

const REGISTROS_COLLECTION = 'registros_gasolina'

function getTodayRange(): { start: Date; end: Date } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const end = new Date(start.getTime() + 86400000)
  return { start, end }
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value
  if (value && typeof (value as any).toDate === 'function') {
    return (value as any).toDate()
  }
  return null
}

export function useDashboard(): UseDashboardReturn {

  const [registros, setRegistros] = useState<RegistroGasolina[]>([])
  const [loading, setLoading] = useState(false)
  const [placa, setPlaca] = useState('')
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingPlaca, setEditingPlaca] = useState('')

  const buscarRegistrosHoy = useCallback(async () => {
    setLoading(true)
    try {
      const { start, end } = getTodayRange()
      const q = query(
        collection(db, REGISTROS_COLLECTION),
        where('fecha', '>=', start),
        where('fecha', '<', end),
      )
      const snapshot = await getDocs(q)
      const docs = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as RegistroGasolina,
      )
      setRegistros(docs)
    } finally {
      setLoading(false)
    }
  }, [])

  const user = useUserStore((s) => s.user)

  const registrarPlaca = useCallback(
    async (placaValue: string) => {
      const usernameValue = user?.username
      if (!usernameValue) {
        return { success: false, message: 'Usuario no autenticado' }
      }
      const placaUpper = placaValue.toUpperCase().trim()
      if (!placaUpper) {
        return { success: false, message: 'Ingrese una placa válida' }
      }

      setLoading(true)
      try {
        const { start, end } = getTodayRange()
        const q = query(
          collection(db, REGISTROS_COLLECTION),
          where('placa', '==', placaUpper),
        )
        const snapshot = await getDocs(q)

        const existingToday = snapshot.docs.some((doc) => {
          const data = doc.data() as { fecha?: unknown }
          const fecha = toDate(data.fecha)
          return fecha !== null && fecha >= start && fecha < end
        })

        if (existingToday) {
          return {
            success: false,
            message: 'Esta placa ya surtió gasolina hoy',
          }
        }

        await addDoc(collection(db, REGISTROS_COLLECTION), {
          placa: placaUpper,
          fecha: serverTimestamp(),
          registradoPor: usernameValue,
        })

        await buscarRegistrosHoy()
        return { success: true, message: '¡Registrado con éxito!' }
      } catch (error) {
        console.error('Error al registrar placa:', error)
        const message =
          error instanceof Error
            ? error.message
            : 'Error al registrar la placa'
        return { success: false, message }
      } finally {
        setLoading(false)
      }
    },
    [buscarRegistrosHoy, user],
  )

  const editarPlaca = useCallback(
    async (id: string, nuevaPlaca: string) => {
      const placaUpper = nuevaPlaca.toUpperCase().trim()
      if (!placaUpper) {
        return { success: false, message: 'Ingrese una placa válida' }
      }

      setLoading(true)
      try {
        const { start, end } = getTodayRange()
        const q = query(
          collection(db, REGISTROS_COLLECTION),
          where('placa', '==', placaUpper),
        )
        const snapshot = await getDocs(q)

        const existingToday = snapshot.docs.some((docSnapshot) => {
          if (docSnapshot.id === id) return false
          const data = docSnapshot.data() as { fecha?: unknown }
          const fecha = toDate(data.fecha)
          return fecha !== null && fecha >= start && fecha < end
        })

        if (existingToday) {
          return {
            success: false,
            message: 'Esta placa ya surtió gasolina hoy',
          }
        }

        await updateDoc(doc(db, REGISTROS_COLLECTION, id), {
          placa: placaUpper,
        })

        await buscarRegistrosHoy()
        const result = { success: true, message: 'Placa actualizada correctamente' }
        setSubmitResult(result)
        return result
      } catch (error) {
        console.error('Error al editar placa:', error)
        const message =
          error instanceof Error
            ? error.message
            : 'Error al editar la placa'
        const result = { success: false, message }
        setSubmitResult(result)
        return result
      } finally {
        setLoading(false)
      }
    },
    [buscarRegistrosHoy],
  )

  const eliminarPlaca = useCallback(
    async (id: string) => {
      setLoading(true)
      try {
        await deleteDoc(doc(db, REGISTROS_COLLECTION, id))
        await buscarRegistrosHoy()
        const result = { success: true, message: 'Placa eliminada correctamente' }
        setSubmitResult(result)
        return result
      } catch (error) {
        console.error('Error al eliminar placa:', error)
        const message =
          error instanceof Error
            ? error.message
            : 'Error al eliminar la placa'
        const result = { success: false, message }
        setSubmitResult(result)
        return result
      } finally {
        setLoading(false)
      }
    },
    [buscarRegistrosHoy],
  )

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      const result = await registrarPlaca(placa)
      if (result.success) {
        setPlaca('')
      }
      setSubmitResult(result)
      return result
    },
    [placa, registrarPlaca],
  )

  useEffect(() => {
    buscarRegistrosHoy()
  }, [])

  const handleStartEdit = (registro: { id?: string; placa: string }) => {
    if (!registro.id) return
    setEditingId(registro.id)
    setEditingPlaca(registro.placa)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingPlaca('')
  }

  const handleSaveEdit = async (id: string) => {
    const result = await editarPlaca(id, editingPlaca)
    if (result.success) {
      handleCancelEdit()
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    await eliminarPlaca(id)
  }

  return {
    registros,
    loading,
    placa,
    setPlaca,
    handleSubmit,
    buscarRegistrosHoy,
    submitResult,
    editarPlaca,
    eliminarPlaca,
    editingId,
    editingPlaca,
    setEditingId,
    setEditingPlaca,
    handleStartEdit,
    handleSaveEdit,
    handleDelete,
    handleCancelEdit,
  }
}
